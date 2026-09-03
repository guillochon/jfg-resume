/**
 * Loads repo-root .env (without overriding existing env), optionally fetches
 * NASA ADS first-author stats, then runs Resumx for HTML + PDF (or watch).
 */
import { spawnSync, spawn } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const resumxEntry = join(repoRoot, 'node_modules', '@resumx', 'resumx', 'dist', 'index.js');

const DEFAULT_FIRST_AUTHOR_QUERY = 'author:"^Guillochon, J"';
const DEFAULT_ALL_PUBLICATIONS_QUERY = 'author:"Guillochon, J"';
const ADS_API = 'https://api.adsabs.harvard.edu/v1/search/query';
const PAGE_SIZE = 2000;

function loadDotEnv() {
	const path = join(repoRoot, '.env');
	if (!existsSync(path)) return;
	const text = readFileSync(path, 'utf-8');
	for (const rawLine of text.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith('#')) continue;
		const eq = line.indexOf('=');
		if (eq === -1) continue;
		const key = line.slice(0, eq).trim();
		if (!key) continue;
		if (process.env[key] !== undefined) continue;
		let val = line.slice(eq + 1).trim();
		if (
			(val.startsWith('"') && val.endsWith('"')) ||
			(val.startsWith("'") && val.endsWith("'"))
		) {
			val = val.slice(1, -1);
		}
		process.env[key] = val;
	}
}

/**
 * English grouped integers (e.g. 2,529). Wrapped in `<span>` so Resumx’s date lexer
 * does not treat comma-separated digit runs as dates.
 */
function wrapGroupedInt(n) {
	const s = new Intl.NumberFormat('en-US').format(n);
	return `<span>${s}</span>`;
}

/** h-index is usually small; bare digits can still match as dates — join with ZWNJ (invisible). */
function wrapHIndexInt(n) {
	const s = String(n);
	const inner = s.length < 2 ? s : s.split('').join('\u200c');
	return `<span>${inner}</span>`;
}

function adsUiSearchUrl(q) {
	const params = new URLSearchParams({
		q,
		sort: 'citation_count desc',
		p_: '0',
	});
	return `https://ui.adsabs.harvard.edu/search/?${params.toString()}`;
}

/**
 * @returns {{ numFound: number, citationCounts: number[], totalCitations: number }}
 */
async function fetchAdsStatsWithCitations(token, q) {
	let start = 0;
	let numFound = 0;
	const citationCounts = [];
	let firstPage = true;

	while (true) {
		const params = new URLSearchParams({
			q,
			fl: 'bibcode,citation_count',
			rows: String(PAGE_SIZE),
			start: String(start),
			sort: 'citation_count desc',
		});
		const url = `${ADS_API}?${params}`;
		const res = await fetch(url, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (!res.ok) {
			const body = await res.text();
			throw new Error(`ADS API ${res.status}: ${body.slice(0, 500)}`);
		}
		const data = await res.json();
		if (firstPage) {
			numFound = data.response?.numFound ?? 0;
			firstPage = false;
		}
		const docs = data.response?.docs ?? [];
		for (const d of docs) {
			citationCounts.push(d.citation_count ?? 0);
		}
		start += docs.length;
		if (start >= numFound || docs.length === 0) break;
	}

	const totalCitations = citationCounts.reduce((a, b) => a + b, 0);
	return { numFound, citationCounts, totalCitations };
}

/** h-index from citation counts (one value per paper). */
function hIndex(citationCounts) {
	if (citationCounts.length === 0) return 0;
	const sorted = [...citationCounts].sort((a, b) => b - a);
	let h = 0;
	for (let i = 0; i < sorted.length; i++) {
		const rank = i + 1;
		if (sorted[i] >= rank) h = rank;
	}
	return h;
}

async function fetchAdsNumFound(token, q) {
	const params = new URLSearchParams({
		q,
		fl: 'bibcode',
		rows: '0',
		sort: 'citation_count desc',
	});
	const url = `${ADS_API}?${params}`;
	const res = await fetch(url, {
		headers: { Authorization: `Bearer ${token}` },
	});
	if (!res.ok) {
		const body = await res.text();
		throw new Error(`ADS API ${res.status}: ${body.slice(0, 500)}`);
	}
	const data = await res.json();
	return data.response?.numFound ?? 0;
}

async function maybeBuildStatsLine() {
	const token = process.env.ADS_KEY?.trim();
	if (!token) return null;

	const firstAuthorQ = (
		process.env.ADS_SEARCH_QUERY?.trim() || DEFAULT_FIRST_AUTHOR_QUERY
	).trim();
	const allPubsQ = (
		process.env.ADS_TOTAL_PUBLICATIONS_QUERY?.trim() ||
		DEFAULT_ALL_PUBLICATIONS_QUERY
	).trim();

	const [firstAuthor, totalPublications] = await Promise.all([
		fetchAdsStatsWithCitations(token, firstAuthorQ),
		fetchAdsNumFound(token, allPubsQ),
	]);

	const citeSumFirstAuthor = firstAuthor.totalCitations;
	const h = hIndex(firstAuthor.citationCounts);

	const allUrl = adsUiSearchUrl(allPubsQ);
	const firstUrl = adsUiSearchUrl(firstAuthorQ);
	const totalLinked = `**${wrapGroupedInt(totalPublications)}**`;
	const parenLinked = `**${wrapGroupedInt(firstAuthor.numFound)}** first author w/ **${wrapGroupedInt(citeSumFirstAuthor)}** citations, h-index ${wrapHIndexInt(h)}`;
	return `Publications: [${totalLinked}](${allUrl}) ([${parenLinked}](${firstUrl}))`;
}

function resumxArgs(format, output, extra, watch) {
	const args = [resumxEntry, 'resume.md', '--format', format, '--output', output];
	if (watch) args.push('--watch');
	for (const e of extra) args.push(e);
	return args;
}

function runResumx(format, output, varArgs, watch) {
	const extra = varArgs.length ? ['--var', varArgs[0]] : [];
	const args = resumxArgs(format, output, extra, watch);
	if (watch) {
		const child = spawn(process.execPath, args, {
			cwd: repoRoot,
			stdio: 'inherit',
		});
		child.on('exit', (code, signal) => {
			if (signal) process.exit(1);
			process.exit(code ?? 0);
		});
		return;
	}
	const r = spawnSync(process.execPath, args, {
		cwd: repoRoot,
		stdio: 'inherit',
	});
	if (r.error) throw r.error;
	if (r.status !== 0) process.exit(r.status ?? 1);
}

const SKILLS_LAYOUT_SCRIPT = `
<script>
(() => {
	const layoutSkillBullets = () => {
		const items = [...document.querySelectorAll('#skills li')];
		for (const li of items) {
			li.classList.remove('skills-row-start');
			li.style.removeProperty('--bullet-offset');
		}
		for (let i = 1; i < items.length; i++) {
			const prev = items[i - 1].getBoundingClientRect();
			const cur = items[i].getBoundingClientRect();
			if (Math.abs(prev.top - cur.top) > 2) {
				items[i].classList.add('skills-row-start');
				continue;
			}
			const gap = Math.max(0, cur.left - prev.right);
			items[i].style.setProperty('--bullet-offset', gap / 2 + 'px');
		}
	};
	window.layoutSkillBullets = layoutSkillBullets;
	const run = () => layoutSkillBullets();
	if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
	else run();
	window.addEventListener('resize', run);
})();
</script>
`;

function injectSkillsLayoutScript(htmlPath) {
	let html = readFileSync(htmlPath, 'utf8');
	if (html.includes('layoutSkillBullets')) return;
	if (!html.includes('</body>')) {
		html += SKILLS_LAYOUT_SCRIPT;
	} else {
		html = html.replace('</body>', `${SKILLS_LAYOUT_SCRIPT}</body>`);
	}
	writeFileSync(htmlPath, html);
}

async function printResumePdf(htmlPath, pdfPath) {
	const { chromium } = await import('playwright');
	const browser = await chromium.launch();
	const page = await browser.newPage();
	await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
	await page.emulateMedia({ media: 'print' });
	await page.setViewportSize({ width: 794, height: 1123 });
	await page.evaluate(async () => {
		if (document.fonts) await document.fonts.ready;
		await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
		if (window.layoutSkillBullets) window.layoutSkillBullets();
	});
	await page.pdf({
		path: pdfPath,
		format: 'A4',
		printBackground: true,
		preferCSSPageSize: true,
	});
	await browser.close();
}

async function main() {
	loadDotEnv();
	const watch = process.argv.includes('--watch');
	const statsLine = await maybeBuildStatsLine();
	const varPair = statsLine ? [`ads_stats_line=${statsLine}`] : [];

	if (watch) {
		runResumx('pdf,html', 'index', varPair, true);
		return;
	}

	runResumx('html', 'index', varPair, false);
	const htmlPath = join(repoRoot, 'index.html');
	injectSkillsLayoutScript(htmlPath);
	await printResumePdf(htmlPath, join(repoRoot, 'resume.pdf'));
	console.log('  PDF ✓\n');
}

main().catch((err) => {
	console.error(err instanceof Error ? err.message : err);
	process.exit(1);
});

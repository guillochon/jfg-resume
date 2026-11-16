---
output: ./
pages: 1
style:
  font-size: 9.4pt
css:
  - resume-layout.css
---

# James Guillochon

San Diego, CA | [+1 (619) 701-0974](tel:+16197010974) | [guillochon@gmail.com](mailto:guillochon@gmail.com) | [LinkedIn](https://www.linkedin.com/in/guillochon) | [GitHub](https://github.com/guillochon) | [🎓 Google Scholar](https://scholar.google.com/citations?user=QXTYwTcAAAAJ)

{{ ads_stats_line }}

## Education

### **Harvard** <span style="font-weight: 400;">— Postdoctoral Scholar, Astronomy — Cambridge, MA</span> || June 2018

### **Insight Data Science** <span style="font-weight: 400;">— Fellow, Data Science — Boston, MA</span> || June 2018

### **UC Santa Cruz** <span style="font-weight: 400;">— PhD, Astronomy — Santa Cruz, CA</span> || June 2013

### **UC Irvine** <span style="font-weight: 400;">— BS, Physics — Irvine, CA</span> || June 2005

## Skills

- Agentic AI
- ArcGIS API for Python
- ArcGIS Pro
- ArcPy
- Azure OpenAI
- Bayesian Analysis
- Bayesian Modeling
- CLIs
- Deep Learning
- ELK Stack
- GDAL/rasterio
- Generative AI
- GeoPandas
- Go
- Jupyter
- LangChain
- LIDAR
- LLM
- MCP
- Motion Planning
- OpenCV
- Parameter Prediction
- PDAL
- PointCNN
- Python
- PyTorch
- Research Leadership
- ROS
- Science Communication
- scikit-learn
- scipy
- Tesseract

## Work Experience

### **Esri** — Principal Data Scientist <span class="work-location">San Diego, CA (Home Office)</span> || Jan 2021 - Present (5 years)

- <span style="font-weight: 600;">Leadership & AI Strategy:</span> Co-led the AI & Analytics Tech Center, shaped Professional Services AI strategy and customer-readiness materials, mentored staff, and supported bids, workshops, and customer scoping.
- <span style="font-weight: 600;">Generative AI & LLM Tooling:</span> Contributed to generative AI workflows by implementing tools that integrate large language models for image interrogation, free-form text object detection, and automated object replacement.
- <span style="font-weight: 600;">Deep Learning Imagery Analysis:</span> Built deep learning pipelines for satellite and aerial imagery covering zero-shot detection, land classification, algal-bloom prediction, feature extraction, and time-series monitoring.
- <span style="font-weight: 600;">3D Scene & LIDAR Optimization:</span> Optimized 3D LIDAR processing pipelines and applied PointCNN models alongside advanced AI algorithms and image embeddings to identify infrastructural assets within 3D scenes.
- <span style="font-weight: 600;">Agentic AI Harnesses:</span> Developed multiplatform agentic harnesses with MCP servers and CLIs for model serving, image AI proxying, and tool orchestration across local and cloud developer workflows.
- <span style="font-weight: 600;">Oriented Imagery Asset Extraction:</span> Extracted street-level and oblique assets with oriented imagery embeddings.
- <span style="font-weight: 600;">Semantic Imagery Search:</span> Built embedding-based search over satellite scenes without a new detector per request.
- <span style="font-weight: 600;">Scanned Document Asset Extraction:</span> Extracted assets and mapped extents from scans using OCR, language models, and geospatial enrichment.
- <span style="font-weight: 600;">Automated Anomaly Detection:</span> Deployed monitoring that flags suspicious changesets in open-source map catalogs.
- <span style="font-weight: 600;">PS AI Enablement Tooling:</span> Built catalogs and assistants for skills discovery, battle cards, code reuse, and customer-needs drafting.

### **Berkshire Grey** — Principal Data Scientist <span class="work-location">Lexington, MA</span> || Oct 2018 - Dec 2020 (2 years)

- <span style="font-weight: 600;">Robotics Software Stack:</span> Led optimization of the Python/ROS pick-and-place stack for arms, conveyors, and shuttles.
- <span style="font-weight: 600;">Motion Planning & Parameter Prediction:</span> Integrated parameter prediction to select robotic motions for unseen products on demand.
- <span style="font-weight: 600;">Bayesian Sensing & Pick Verification:</span> Developed online Bayesian analysis of data from sensors integrated into the picking system to dynamically determine how many items the robotic arm lifted.
- <span style="font-weight: 600;">Operations Analytics:</span> Curated a KPI dashboard for the deployed robotic system via the ELK Stack.

### **Harvard-Smithsonian** — NASA Einstein/ITC Fellow <span class="work-location">Cambridge, MA</span> || Sept 2013 - Aug 2018 (5 years)

- <span style="font-weight: 600;">Black Hole Hydrodynamics:</span> Developed a custom FLASH adaptive-mesh module for stars encountering black holes. PhD: 43 piecewise-parabolic runs with multipole self-gravity of partial and full disruptions of low- and high-mass main-sequence stars ([Hydrodynamical Simulations to Determine the Feeding Rate of Black Holes by the Tidal Disruption of Stars](https://ui.adsabs.harvard.edu/abs/2013ApJ...767...25G), 2013 ApJ) on UCSC Pleiades, Laozi, and NASA Pleiades, with fitting formulae for mass lost, peak time, peak accretion rate, and post-peak decay. [MOSFiT](https://mosfit.rtfd.io)'s tidal-disruption model uses the simulated fallback rates. Harvard: the first MHD simulations of tidal disruptions, up to 100 million cells, at NASA Advanced Supercomputing (Ames).
- <span style="font-weight: 600;">MOSFiT & Bayesian Modeling:</span> Developed [MOSFiT](https://mosfit.rtfd.io), a Bayesian engine for fitting transient light curves to data.
- <span style="font-weight: 600;">Research Leadership:</span> Technical lead of an eight-person team of students and postdocs; [dozens of projects](https://ui.adsabs.harvard.edu/search/q=guillochon%2C%20james&sort=date%20desc%2C%20bibcode%20desc&p_=0) with 10k+ citations.
- <span style="font-weight: 600;">Science Communication:</span> [NOVA](http://www.pbs.org/wgbh/nova/space/black-hole-apocalypse.html) (2018), on measuring a black hole's mass from a destroyed star.
- <span style="font-weight: 600;">Open Astronomy Catalogs:</span> Led the [Open Astronomy Catalogs](https://astrocats.space), a data-sharing platform with a user-facing frontend and an API.

## Projects

- <span style="font-weight: 600;">[Shaderous](https://guillochon.github.io/shaderous/):</span> 3D finite-volume gas dynamics and ideal MHD in the browser ([source](https://github.com/guillochon/shaderous)). Fluid and gravity are WGSL compute shaders on WebGPU, and the timestep and block scheduling stay on the GPU: unsplit MUSCL-Hancock (third-order reconstruction, HLLC fluxes), van Leer MHD with constrained transport (HLLD or HLLE), multigrid Poisson gravity, and block-structured AMR, for shocks, self-gravitating stars, tidal disruptions, and ideal-gas to degenerate equations of state.

---
title: "Cislunar collision risk assessment"
demo: ""
tools: "ESA MASTER debris model"
skills: "Collision risk assessment, Mission design, Test trajectory generation, Software verification"
---

### Motivation

Lunar and interplanetary missions are expected to multiply in the coming years. Each one departs from Earth, and often returns to it, through the low Earth orbit region and the geostationary belt, the **protected regions** where the debris population keeps growing. The crossing is fast and brief, so a collision is unlikely, but at these speeds an impact is far more likely to be catastrophic.

![Earth's protected regions: the low Earth orbit region up to 2000 km altitude and the geostationary region, within 15 degrees of the equator.](/portfolio/uploads/crl-protected-regions.webp)

*The protected regions around Earth.*

Existing collision-risk tools are built for spacecraft that stay in orbit. ESA's own guidelines state that no fully dedicated tool exists for assessing collision risk outside Earth orbits.

### Objective

To build and demonstrate a tool that assesses the collision risk of missions crossing Earth's protected regions, starting from the trajectory itself, and to answer two questions:

1. How does the collision probability of a transfer mission compare with that of a spacecraft that stays in Earth orbit?
2. Of those collisions, how many would be catastrophic?
3. Of those catastrophic collisions, how many are caused by debris too small to be tracked?

![Scope of the thesis: the collision-risk assessment module of a space-safety software suite takes a trajectory as input and produces risk metrics, answering three questions and demonstrated on three lunar transfer cases.](/portfolio/uploads/crl-objective.svg)

*Scope of the work.*

### Methodology

The tool reads a mission trajectory, breaks it into arcs, finds where the arcs cross a spatial grid over the protected regions, and combines each crossing with the local debris environment from ESA's MASTER model. It was developed as a module of an ESA-funded space-safety software suite, and was the subject of my master's thesis at Technische Universität Berlin.

![Block diagram of the pipeline: mission trajectory, locally Keplerian arcs, crossings of a spatial grid, statistical debris flux from ESA MASTER, and risk metrics per cell and per mission.](/portfolio/uploads/crl-pipeline.svg)

*The pipeline, from a trajectory file to risk metrics.*

It reports three metrics, for every cell and for the mission as a whole: the **collision probability**, the **catastrophic fraction** (the share of collisions energetic enough to destroy the spacecraft), and the **unmitigable fraction** (the share caused by debris too small to be tracked and avoided).

### Mission design of the test cases

To demonstrate the tool, I designed three lunar transfers from scratch, each representing a different way of reaching the Moon:

- **Free-return:** a ballistic round trip around the Moon.
- **Phasing loop:** a chemical-propulsion transfer that spends several revolutions around Earth to arrive at the Moon at the right time.
- **Low-thrust spiral:** an electric-propulsion transfer that spirals out from a transfer orbit and then coasts along a path towards a halo orbit near the Moon.

![The three lunar transfer cases in an Earth-centred inertial frame: free-return, low-thrust spiral with its bridge, manifold coast and halo orbit, and phasing loop.](/portfolio/uploads/crl-cases.webp)

*The three test trajectories.*

For comparison, I analysed four spacecraft that stay in Earth orbit: an ISS-like orbit, a Starlink-like orbit, a sun-synchronous orbit and a geostationary transfer orbit. The mission designs and the tool were verified against the physics of each case and against ESA MASTER's reference results.

### Results

- **Short exposure.** The transfers cross the protected region only briefly, so their collision probability is lower than that of spacecraft that stay in orbit.
- **Probability is not severity.** A low collision probability does not mean a low catastrophic fraction: the places where a transfer collects most collision probability are not the places where its collisions are most severe.
- **Risk is concentrated.** Most of the catastrophic contribution comes from a small share of the cells a transfer passes through.
- **Some risk cannot be screened.** A meaningful share of the catastrophic contribution comes from debris too small to be tracked.

Spacecraft that stay in orbit pass through the same cells again and again, so their exposure is continuous:

![Collision probability (top) and catastrophic fraction (bottom) per grid cell for the four Earth-orbit baselines: ISS-like, Starlink-like, sun-synchronous and geostationary transfer orbit.](/portfolio/uploads/crl-cells-baselines.webp)

*Earth-orbit baselines, by right ascension and declination (altitude for the transfer orbit).*

The transfers cross a smaller set of cells, once or a few times:

![Collision probability (top) and catastrophic fraction (bottom) per grid cell for the three transfers, by right ascension and altitude.](/portfolio/uploads/crl-cells-transfer.webp)

*Collision probability (top) and catastrophic fraction (bottom) per grid cell.*

A single collision probability for the whole mission therefore does not describe the risk of a transfer: it has to be assessed spatially and by severity.

### My role

I developed the collision-risk assessment tool, designed the three test trajectories, and carried out the verification and the analysis, as part of an ESA-funded project.

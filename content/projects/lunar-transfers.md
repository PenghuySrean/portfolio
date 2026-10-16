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

To build and demonstrate a collision-risk assessment tool for missions that cross Earth's protected regions, working directly from the mission trajectory. It was developed as a module of **PlanetSSA**, an ESA-funded project led by GMV that is building an integrated analysis software toolbox for safe and sustainable interplanetary return missions, and it was the subject of my master's thesis at Technische Universität Berlin, carried out with MAITY Space, a subcontractor to the project.

![Scope of the thesis: the collision-risk assessment module within PlanetSSA takes a trajectory as input and produces risk metrics, and is demonstrated on three lunar transfer cases.](/portfolio/uploads/crl-objective.webp)

*Scope of the work.*

### Mission design of the test cases

To demonstrate the tool, I designed three lunar transfers from scratch, each representing a different way of reaching the Moon:

- **Free-return:** a ballistic round trip around the Moon.
- **Phasing loop:** a chemical-propulsion transfer that spends several revolutions around Earth to arrive at the Moon at the right time.
- **Low-thrust spiral:** an electric-propulsion transfer that spirals out from a transfer orbit and then coasts along a path towards a halo orbit near the Moon.

![The three lunar transfer cases in an Earth-centred inertial frame: free-return, low-thrust spiral with its bridge, manifold coast and halo orbit, and phasing loop.](/portfolio/uploads/crl-cases.webp)

*The three test trajectories.*

### Methodology and results

The methodology and the results are part of my master's thesis and are not shown here, as I am preparing them for publication. I am happy to discuss them in person.

### My role

I developed the collision-risk assessment tool, designed the three test trajectories, and carried out the verification and the analysis, as part of PlanetSSA, an ESA-funded project.

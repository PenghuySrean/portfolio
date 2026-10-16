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

### The project

**PlanetSSA** is an ESA-funded project that is building an integrated analysis software toolbox for safe and sustainable interplanetary return missions. MAITY Space is a subcontractor to the project, and I carried out my master's thesis at Technische Universität Berlin with them. My work covers the **collision-risk assessment module**, outlined in red below, which takes a mission trajectory as input and produces risk metrics.

![Overview of the project and the scope of the thesis: the collision-risk assessment module within PlanetSSA, its three objectives, and the three lunar transfers used to demonstrate it.](/portfolio/uploads/crl-objective.webp)

*The project and the scope of my work.*

### My contribution

As part of the project, besides implementing the collision-risk computation software module, I designed the orbit transfers used to demonstrate it. Each represents a different way of reaching the Moon:

- **Free-return:** a ballistic round trip around the Moon.
- **Phasing loop:** a chemical-propulsion transfer that spends several revolutions around Earth to arrive at the Moon at the right time.
- **Low-thrust spiral:** an electric-propulsion transfer that spirals out from a transfer orbit and then coasts along a path towards a halo orbit near the Moon.

![The three lunar transfer cases in an Earth-centred inertial frame: free-return, low-thrust spiral with its bridge, manifold coast and halo orbit, and phasing loop.](/portfolio/uploads/crl-cases.webp)

*The three transfer trajectories.*

I also carried out the verification of the tools and the trajectories.

### Methodology and results

The methodology and the results are part of my master's thesis and are not shown here, as I am preparing them for publication. I am happy to discuss them in person.

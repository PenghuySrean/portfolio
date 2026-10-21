---
title: Space Debris Risk for Interplanetary Trajectories
demo: ''
tools: ESA MASTER debris model
skills: Collision risk assessment, Mission design, Test trajectory generation, Software verification
---

### Motivation

Lunar and interplanetary exploration is growing. More and more actors are joining, and lunar activity is now expanding globally and commercially, with an industry forecast of more than 250 missions planned over the coming decade ([NSR, 2022](https://www.analysysmason.com/press/it-news-online-nsr-developing-moon-market-propelled-by-250-missions-and-$105-billion-in-revenue-through-decade/)). These missions leave Earth, and some come back, crossing the protected regions of low Earth orbit and the geostationary belt, where the debris population keeps growing. My thesis investigates the collision risk of these crossings.

![Earth's protected regions: the low Earth orbit region up to 2000 km altitude and the geostationary region, within 15 degrees of the equator.](/portfolio/uploads/crl-protected-regions.webp)

_The protected regions around Earth._

Most existing collision-risk tools are built for spacecraft that stay in orbit and cannot take an interplanetary trajectory as input, and ESA's own guidelines state that no fully dedicated tool exists for assessing collision risk outside Earth orbits. To fill this gap, I built a software tool that takes an interplanetary trajectory and analyses its collision risk in Earth's protected regions.

### The project

This diagram shows the overall structure of the project and the scope of my work.

![Overview of PlanetSSA and the scope of my work: the collision-risk assessment module, its research questions, and the three lunar transfers used to demonstrate it.](/portfolio/uploads/crl-objective.webp)

_The overall structure of PlanetSSA, with the scope of my work outlined in red._

### My contribution

As part of the work, I designed the orbit transfers used to demonstrate the collision-risk module. Designing them led me to learn about the three-body problem and the trajectory optimisation techniques required to design these orbits.

- **Free-return:** a ballistic round trip around the Moon.
- **Phasing loop:** a chemical-propulsion transfer that spends several revolutions around Earth to arrive at the Moon at the right time.
- **Low-thrust spiral:** an electric-propulsion transfer that spirals out from a transfer orbit and then coasts along a path towards a halo orbit near the Moon.

![The three lunar transfer cases in an Earth-centred inertial frame: free-return, low-thrust spiral with its bridge, manifold coast and halo orbit, and phasing loop.](/portfolio/uploads/crl-cases.webp)

_The three transfer trajectories._

### Methodology and results

More detail on the methodology and results may be added later.

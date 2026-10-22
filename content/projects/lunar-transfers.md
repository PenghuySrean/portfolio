---
title: Space Debris Risk for Interplanetary Trajectories
demo: ''
tools: ESA MASTER debris model
skills: Collision risk assessment, Mission design, Test trajectory generation, Software verification
---

My master's thesis, carried out at MAITY Space within PlanetSSA, an ESA-funded space-safety project. I designed three lunar transfer missions and developed a tool that assesses their collision risk with space debris in Earth's protected regions.

### Project overview

Lunar and interplanetary exploration is growing. More and more actors are joining, and lunar activity is now expanding globally and commercially, with an industry forecast of more than 250 missions planned over the coming decade ([NSR, 2022](https://www.analysysmason.com/press/it-news-online-nsr-developing-moon-market-propelled-by-250-missions-and-$105-billion-in-revenue-through-decade/)). These missions leave Earth, and some come back, crossing the protected regions of low Earth orbit and the geostationary belt, where the debris population keeps growing.

![Earth's protected regions: the low Earth orbit region up to 2000 km altitude and the geostationary region, within 15 degrees of the equator.](/portfolio/uploads/crl-protected-regions.webp)

_The protected regions around Earth._

Most existing collision-risk tools are built for spacecraft that stay in orbit and cannot take an interplanetary trajectory as input, and ESA's own guidelines state that no fully dedicated tool exists for assessing collision risk outside Earth orbits.

### Objective

- Design representative lunar transfer missions that cover the main classes of cislunar transfers
- Develop a tool that assesses the collision risk of an interplanetary trajectory while it crosses Earth's protected regions
- Verify the tool

### Methodology

**1. Mission case selection**

Lunar transfers fall into four classes: direct transfers, phasing loops, low-energy transfers and low-thrust transfers. Three were selected as demonstration cases, so that the tool is tested across the range of cislunar missions:

| Class | Selected case | Why |
|---|---|---|
| Direct transfer | Free-return | Apollo heritage, with a built-in abort-to-Earth option |
| Phasing loop | 3.5-revolution phasing loop | Widely used, with flexible launch windows |
| Low-thrust transfer | Tangential-thrust spiral to an L1 halo orbit | Fuel-efficient option for small satellites with electric propulsion |

Low-energy transfers were not selected separately, because their manifolds do not reach Earth's protected regions directly. The bridge needed to reach them is covered by the low-thrust case.

**2. Mission design process**

All three missions were designed with the same process:

1. **Select the mission class** and the representative case (see above).
2. **Choose the dynamical model:** the two-body problem where the Moon's gravity can be neglected (phasing loop), and the circular restricted three-body problem (CR3BP) where it shapes the trajectory (free-return, low-thrust spiral).
3. **Generate an initial guess** from simpler dynamics.
4. **Correct or optimise** the trajectory until it meets the mission constraints.
5. **Validate** the trajectory with physical checks.
6. **Export** it as a CCSDS Orbit Ephemeris Message (OEM), the input format of the collision-risk tool.

The designs follow established methods from the literature and are representative rather than optimised.

- **Free-return.** *Model:* CR3BP. *Initial guess:* a two-body transfer gives the departure angle and speed. *Correction:* a differential correction targets the crossing behind the Moon at the flyby altitude, with a continuation from a reference altitude to the target; the return leg is corrected with the state transition matrix to meet the Earth-entry altitude and flight-path angle. *Constraints:* 192 km departure perigee, 1700 km lunar flyby, re-entry at 121 km and −6°. *Validation:* the Jacobi constant stays constant along the whole trajectory, confirming that the CR3BP propagation is consistent.
- **Phasing loop.** *Model:* two-body arcs connected by impulsive burns at perigee, raising the apogee in steps until it reaches lunar distance. *Design:* a search over the number of revolutions and the size of each orbit, so that the spacecraft arrives at the Moon at the required time. *Constraints:* no burn above 0.3 km/s. *Result:* arrival after about 28.7 days, with a total Δv of 0.673 km/s. *Validation:* the revolutions multiplied by the orbital periods add up to the intended transfer time.
- **Low-thrust spiral.** *Model:* CR3BP with thrust, in three phases following Mingotti et al.: a tangential-thrust spiral from a GTO-like parking orbit (400 × 35 864 km), an optimised bridge, and a coast along the stable manifold of an Earth–Moon L1 halo orbit (Az = 8000 km). *Optimisation:* the bridge is a two-point boundary value problem, solved with direct shooting and Sequential Least Squares Quadratic Programming (SLSQP), with only two free variables (the point on the halo orbit and the coast time along the manifold) to keep the problem tractable. *Spacecraft:* 1000 kg, 0.5 N thrust, 3000 s specific impulse. *Validation:* on the spiral the mass falls linearly and the thrust stays aligned with the velocity; the halo orbit and manifold keep a constant Jacobi constant; on the bridge the propellant use matches the rocket equation.

![The three lunar transfer cases in an Earth-centred inertial frame: free-return, low-thrust spiral with its bridge, manifold coast and halo orbit, and phasing loop.](/portfolio/uploads/crl-cases.webp)

_The three transfer trajectories._

**3. Collision-risk tool**

![Overview of PlanetSSA and the scope of my work: the collision-risk assessment module, its research questions, and the three lunar transfers used to demonstrate it.](/portfolio/uploads/crl-objective.webp)

_The overall structure of PlanetSSA, with the scope of my work outlined in red._

The tool assesses the risk directly from a mission's state history, so it works for any trajectory, not only for resident Earth orbits. It runs as a pipeline:

1. **Trajectory processing:** the trajectory is read from the OEM file, and the tool determines which regions of space around Earth it passes through and for how long, on a spatial grid compatible with MASTER.
2. **Debris environment:** for each crossed cell, ESA's MASTER model provides the local debris flux and the mass and size distributions of the debris.
3. **Risk and severity:** the collision probability follows from a statistical, flux-based approach. The severity of each possible collision is classified by its energy-to-mass ratio (catastrophic above 40 J/g), and catastrophic collisions are split into mitigable and unmitigable ones, depending on whether the debris is large enough (about 10 cm) to be tracked and avoided. The results are resolved per cell and for the whole mission.

**4. Verification**
- MASTER itself cannot take an interplanetary trajectory as input, so the tool was compared with MASTER on Earth-bound orbits, where both can be run.
- The trajectory processing and the mission designs were checked against the original trajectories, the software is covered by automated tests, and it was reviewed within the ESA project.

### My contribution

- Selected and designed the three lunar transfer missions
- Designed and implemented the core trajectory-processing methods of the tool
- Implemented the tool architecture, together with my supervisor
- Verified the tool against ESA MASTER

### Results

- Three lunar transfer missions, a free-return, a phasing loop and a low-thrust spiral, designed and exported as OEM trajectories
- A working tool that assesses the debris collision risk of an interplanetary trajectory, which existing tools such as MASTER cannot do
- The tool verified against MASTER on Earth-bound orbits, and demonstrated on the three missions

The collision-risk results of the three missions are part of the thesis and are not presented here.

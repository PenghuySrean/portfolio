---
title: "International Space Challenge"
demo: ""
tools: ""
skills: ""
---

A mission design for two 12U CubeSats to study radiation belt loss during the 2024–2026 solar maximum, developed by a student team from Cambodia for the International Space Challenge 2022 (Distinction Award). My tasks were orbit and mission analysis, the electrical power system, and contributing to project planning and coordination. This page focuses on the orbit and mission analysis.

![CAD model of the 12U Reahou-Sat CubeSat, made by a teammate.](/portfolio/uploads/isc-satellite-cad.webp)

_The Reahou-Sat CubeSat (CAD model by a teammate)._

### Mission statement

To observe, from a CubeSat in a geostationary transfer orbit, the boundary of the outer radiation belt and the region of EMIC and chorus waves that interacts with the loss mechanisms of the radiation belts.

The mission was formulated together with the team, and formulating it was one of the hardest parts of the project.

### Mission summary

- **Science goal:** to study the dynamics of radiation belt loss due to two mechanisms, magnetopause incursion and EMIC waves
- **Mission objectives:** observe magnetopause incursions during the solar maximum, and observe EMIC waves during solar wind and storm events
- **Orbit:** super-synchronous transfer orbit, apogee about 47,800 km altitude, perigee about 400 km, inclination 10°, eccentricity 0.78
- **Payload:** a particle telescope (MERiT) and a fluxgate magnetometer
- **Spacecraft:** two 12U CubeSats with a green propulsion system, UHF and S-band communications and a deployed solar array
- **Constraints:** pass through both radiation belts, operate for at least one year, include a propulsion system, and cost less than USD 50 million

### Objective

- Design an orbit that takes the satellites through the outer radiation belt, on the sunward side where the loss events occur
- Plan the mission phases from launch to deorbit
- Make sure the satellites leave orbit within the space debris guidelines

### Methodology

- **Orbit design:** a highly elliptical, super-synchronous transfer orbit (apogee about 47,800 km altitude, perigee about 400 km, inclination 10°). I chose the semi-major axis to reach the outer belt, and the low inclination keeps the satellites near the equatorial plane.
- **Mission phases:** launch, orbit correction, one year of science operation, and deorbit. The orbit is maintained during the mission so the satellites keep observing the sunward side of the belt.
- **Lifetime analysis:** I simulated the orbit decay for four initial orbit cases, changing the RAAN, with the public tool STELA. I used the sun-perigee angle to decide when the deorbit device works best.

![Mission concept: two satellites in a highly elliptical orbit crossing the outer radiation belt on the sunward side. Schematic, not to scale.](/portfolio/uploads/isc-mission-orbit.webp)

_The mission concept._

### Concept of operations

The satellites operate in three modes:

- **Safe mode:** minimum power use, for non-nominal situations such as an internal error or insufficient energy
- **Science mode:** the payload measures and stores data, with the solar arrays pointing at the Sun
- **Communication mode:** science mode combined with data downlink, using target pointing

Mission timeline:

- **T + 24 hours:** launch and deployment, onboard computer boots up and the UHF antenna deploys
- **T + 72 hours:** beacon and health telemetry received, attitude pointing experiment
- **T + 7 days:** orbit correction
- **T + 365 days:** validation of the science data, then the extended mission
- **End of life:** deorbiting and disposal

### Other subsystems

The other parts of the design were developed by my teammates:

- Payload: a particle telescope and a fluxgate magnetometer
- Propulsion: a green propulsion system for orbit correction and maintenance
- Communications: UHF and S-band links with positive link margins
- Shielding: 8 mm of aluminium against the radiation environment
- Estimated programme cost: about USD 6.1 million

### My contribution

- Led the orbit and mission analysis
- Led the electrical power system
- Contributed to project planning and coordination

### Results

- The shortest predicted lifetime is about 457 days: 365 days of mission plus about 92 days of deorbiting, for an initial RAAN of 180°
- The deorbit device works best when the sun-perigee angle is near 180°. For RAAN 180° the angle ends at 197° after one year, so the plan is to maintain the orbit near 180°
- The other three cases (RAAN 0°, 90° and 270°) are still in orbit after about two years, so the initial orbit and the orbit maintenance strongly affect the lifetime
- Delta-V budget: about 0.72 km/s for the plane correction and about 4.48 km/s for one year of orbit maintenance, 5.2 km/s in total

| Initial RAAN | RAAN after 1 year | Sun-perigee angle after 1 year |
| --- | --- | --- |
| 0° | 266.50° | 16.47° |
| 90° | 0.78° | 100.40° |
| 180° | 71.32° | 197.06° |
| 270° | 165.34° | 281.70° |

_Orbit drift after one year without orbit maintenance._
- The electrical power system was sized to 89 W at end of life, with about 25 Wh of energy storage

![Predicted semi-major axis over time for four initial RAAN values, showing the mission period, the deorbiting period and the reentry point.](/portfolio/uploads/isc-lifetime-prediction.webp)

_Lifetime prediction for four initial RAAN values._

### Future work

- The attitude control, thermal control and onboard data handling design were not covered and would be the next step

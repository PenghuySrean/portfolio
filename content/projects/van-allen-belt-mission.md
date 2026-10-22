---
title: "International Space Challenge"
demo: ""
tools: ""
skills: ""
---

A mission design for two 12U CubeSats to study radiation belt loss during the 2024–2026 solar maximum, developed by a student team from Cambodia for the International Space Challenge 2022 (Distinction Award). My tasks were orbit and mission analysis, the electrical power system, and contributing to project planning and coordination. This page focuses on the orbit and mission analysis.

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

### Results

- The shortest predicted lifetime is about 457 days: 365 days of mission plus about 92 days of deorbiting, for an initial RAAN of 180°
- The deorbit device works best when the sun-perigee angle is near 180°. For RAAN 180° the angle ends at 197° after one year, so the plan is to maintain the orbit near 180°
- The other three cases (RAAN 0°, 90° and 270°) are still in orbit after about two years, so the initial orbit and the orbit maintenance strongly affect the lifetime
- The electrical power system was sized to 89 W at end of life, with about 25 Wh of energy storage

![Predicted semi-major axis over time for four initial RAAN values, showing the mission period, the deorbiting period and the reentry point.](/portfolio/uploads/isc-lifetime-prediction.webp)

_Lifetime prediction for four initial RAAN values._

### Mission feasibility

The rest of the concept, developed by my teammates, shows that the mission is feasible:

- Payload: a particle telescope and a fluxgate magnetometer
- Propulsion: a green propulsion system for orbit maintenance, with about 7.6 kg of propellant for one year
- Communications: UHF and S-band links with positive link margins
- Shielding: 8 mm of aluminium against the radiation environment
- Estimated programme cost: about USD 6.1 million

### My contribution

- Led the orbit and mission analysis
- Led the electrical power system
- Contributed to project planning and coordination

### Future work

- The attitude control, thermal control and onboard data handling design were not covered and would be the next step

![Distinction Award certificate, International Space Challenge 2022](/portfolio/uploads/certificates/isc-2022-distinction-award.jpeg)

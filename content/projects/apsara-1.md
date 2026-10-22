---
title: "APSARA-1 CubeSat project"
demo: ""
tools: ""
skills: ""
---

APSARA-1 is Cambodia's first CubeSat, a student-led project of the Institute of Technology of Cambodia (ITC) with the University of Tokyo. It is a 1U CubeSat with a multispectral camera for drought monitoring, planned for release from the International Space Station. I worked on it as an intern from December 2020 to June 2021. This page focuses on the orbit simulator I developed, which predicts how long the satellite stays in orbit. The work was published as a first-author paper in a domestic journal.

![CAD model of the APSARA-1 CubeSat with its UHF antennas deployed.](/portfolio/uploads/apsara-satellite-cad.webp)

_The APSARA-1 CubeSat (CAD model)._

### Mission overview

- **Mission:** to use space data and technology to address socio-economic issues in Cambodia, and to promote STEM education
- **Orbit:** release from the ISS in January 2024 at about 400 km altitude and 51.6° inclination, when solar activity is near its peak

### Objective

- Predict the orbital lifetime of the satellite, which depends strongly on solar activity
- Support operations planning, since a shorter lifetime leaves less time for the mission
- Show that the satellite meets the space debris mitigation guidelines

![Solar radio flux forecast: the planned launch in January 2024 coincides with the solar maximum, and the low, medium and high flux values used in the simulation are marked.](/portfolio/uploads/apsara-solar-flux-forecast.webp)

_Solar activity forecast. The launch coincides with the solar maximum._

### Methodology

- **Orbit model:** the simulator propagates the satellite's position and velocity in an Earth-centred inertial frame, with point-mass gravity, the J2 perturbation and atmospheric drag, using a fourth-order Runge-Kutta integrator in MATLAB.
- **Atmosphere:** density comes from the NRLMSISE-00 model, which I evaluated for altitudes from 150 to 450 km, averaged over latitude and longitude, for three solar activity conditions (low, medium and high, the 5th, 50th and 95th percentiles of the 2024–25 solar flux forecast). The simulator interpolates the table along the orbit.
- **Satellite:** a mass of 1.33 kg, a drag area of 0.015 m² and a drag coefficient of 2.
- **Verification:** I compared the decay with STELA, a public end-of-life tool from the French space agency, using the same setup.

![Architecture of the orbit simulator: input state and density table, the three force models and the integrator, and the output state.](/portfolio/uploads/apsara-simulator-architecture.webp)

_The simulator architecture._

![Mathematical architecture of the simulator: the drag, point-mass gravity and J2 accelerations are summed and integrated with RK4.](/portfolio/uploads/apsara-math-architecture.webp)

_The equations in the simulator._

### My contribution

- Developed the orbit simulator and wrote the paper as first author
- Performed the lifetime and space debris compliance analysis
- Designed the command and data handling subsystem

### Results

- At 400 km, the predicted lifetime is about 144 days for the nominal case, about 72 days for high solar activity and about 255 days for low solar activity
- The decay times agree with STELA within about 8%
- Even in the longest case the satellite leaves orbit within about nine months, so it meets the debris guideline

![Predicted altitude over time for low, medium and high solar activity, from the in-house simulator (solid) and from STELA (dashed).](/portfolio/uploads/apsara-decay-vs-stela.webp)

_Orbital decay at 400 km, in-house simulator compared with STELA._

The simulator also provides sunlight and eclipse data for the power and thermal analysis.

### Publication

The simulator and its results are described in the paper ["Development of Orbital Simulator for Cambodian CubeSat Mission in LEO"](https://www.researchgate.net/publication/360318005_Development_of_Orbital_Simulator_for_Cambodian_CubeSat_Mission_in_LEO) (2021), which I wrote as first author with colleagues from ITC, the American University of Phnom Penh and the University of Tokyo. The methodology, the figures and the results above come from this paper.

### Command and data handling

I also designed the command and data handling subsystem. I selected flight-proven commercial components after a trade study, including the onboard computer with 128 MB of flash memory, planned image compression to shorten the downlink, and a reset system based on watchdog timers to recover from temporary failures.

### Other subsystems

The other subsystems were developed by my teammates:

- **Payload:** four cameras that give RGB and near-infrared images, from which vegetation maps (NDVI) are computed
- **Attitude control:** sun sensors, a magnetometer and a gyroscope, with three magnetorquers for detumbling and nadir pointing
- **Power:** four solar panels and two batteries of about 20 Wh in total
- **Communications:** a UHF transceiver with a deployable antenna
- **Structure and thermal:** an in-house machined structure, with a battery heater and passive insulation

### Future work

- A more detailed atmosphere model that varies with latitude and longitude, and higher-order gravity terms
- A graphical interface, and extension to other subsystems such as power and attitude control, which later led to my 6-DOF simulator

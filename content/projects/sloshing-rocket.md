---
title: "Airbus Sloshing Rocket"
demo: ""
tools: ""
skills: ""
---

A water rocket with a deployable wing, designed by Team Skyhawk Squadron, four TU Berlin master's students, for the Airbus Sloshing Water Rocket Workshop 2024. I was the team leader and in charge of the flight system: the flight computer and the 6-DOF flight simulation.

![CAD model of the Airbus Sloshing Rocket, designed by a teammate.](/portfolio/uploads/Screenshot%202026-10-17%20034430.webp)

_The rocket (CAD model by a teammate)._

### Competition overview

- **Competition:** the Airbus Sloshing Rocket Workshop, organised by EUROAVIA with Airbus. Student teams design a low-cost water rocket and present it at the workshop in Portugal. The 2024 edition was my team's entry.
- **Challenge:** a rocket whose flight is disturbed by the sloshing of water in an unpressurised tank, which the design has to manage, passively (for example with baffles) or actively (for example with control surfaces).
- **Judged on:** the distance covered, the altitude reached, the total flight time and the payload, together with the technical report and the presentation.
- **Main rules:** at most 1.5 m long, 2.25 m wingspan and 5 kg at take-off, launched at 85° and below 10 atmospheres. The unpressurised slosh tank holds at least 500 ml of water, half full, and the propulsion water must not weigh more than the water in the slosh tank. Water is the only propellant, and air the only gas.
- **Team:** four TU Berlin master's students, each leading one subsystem and supporting another.

### Objective

- Design a water rocket that maximises both the height and the flight time, by unfolding a wing at the apogee
- Understand how sloshing liquid in the tank affects the stability of the rocket
- Design a flight computer that deploys the wing and records the flight data
- Build a flight simulation to plan the flight logic before any hardware is available

### Design

The main design challenge is that two goals pull in opposite directions: a rocket shaped for low drag climbs high but stays in the air for a short time, while a rocket built for airtime climbs less. The team therefore chose a **foldable wing**: the wings stay folded during the climb, so that the rocket reaches a greater height, and unfold at the apogee to extend the flight time.

- **Why the apogee:** the flight simulation showed that the apogee is the best moment to deploy. A glide study that I did afterwards with the extended model confirmed it: the rocket is slowest at the apogee and the wing loads are lowest there, deploying earlier while still climbing costs altitude, and deploying later on the way down gives up the height that the glide needs.
- **Mechanism (my teammates):** tension springs unfold the wings when a servo releases a rubber band. The first simulation showed the wings kicking back at the end of the motion, so a pin puller was added to lock them in the unfolded position.
- **Stability (my teammates):** the rocket has two wings and four fins, and its stability was analysed with XFLR5 using a NACA 0012 airfoil and a swept wing. The wings reduce the stability, and with the flight computer and ballast near the nose the configuration reached about 1.7 calibres.
- **Flight computer (my part):** it measures the altitude and triggers the wing deployment, so the deployment logic and the simulation had to be designed together.

### Methodology

**Flight computer**
- I designed a custom circuit board with a microcontroller, an inertial sensor, a pressure sensor for the height, a memory card for the flight data, indicators, and three servo outputs, one for the wing deployment and two as backup. The requirements were that it measures the flight, controls the wing deployment, records the data, and that its algorithm is model-based.

![The flight computer board with its main components labelled: Arduino Nano, BME280 pressure sensor, MPU6050 inertial sensor, memory card holder, buzzer, LED, power switch and digital pins.](/portfolio/uploads/skyhawk-flight-computer-pcb.webp)

_The flight computer board._

**Flight simulation (Simulink)**
- **States:** the position and velocity in an Earth-fixed frame, and the masses of water and air in the bottle, integrated with a fixed-step Runge-Kutta solver (1 ms).
- **Forces:** point-mass gravity, aerodynamic drag in an exponential atmosphere, and thrust along the flight direction, for a launch at 85°.
- **Thrust model:** in the water phase, the air in the bottle expands adiabatically and pushes the water out as a jet (Bernoulli), including the area ratio between nozzle and bottle and the pressure of the water column under the thrust acceleration. Once the water is gone, the remaining air blows down isentropically through the nozzle, first choked and then subsonic, with the pressure thrust of the exhaust.
- **Sensors:** a barometer model turns the simulated altitude into a noisy pressure signal, so the flight logic can be developed without flying.
- **Rotational dynamics:** the model contains an attitude loop, which is switched off in the results shown.
- **After the event:** I revised the propulsion model and fixed a numerical error in it (a block update setting that held the thrust constant between solver stages), cross-checked it with an independent implementation in Python (apogee within 0.03 m), and extended it with a glide version in which the wings unfold at the apogee (lift and drag of a wing at a fixed trimmed lift coefficient), checked against closed-form results such as the energy balance and the steady glide speed. The results below come from this revised model.
- **Use:** the model gave the deployment timing and the flight logic, and the flight software was to be generated as code from it.

![Overview of the Simulink flight simulation: translational and rotational dynamics, the barometer sensor model, the simulated rocket states and the thrust model inspection.](/portfolio/uploads/skyhawk-simulink-model.webp)

_The Simulink flight simulation._

### My contribution

- Team leader, responsible for the project management
- Designed the flight computer
- Developed the flight simulation with the thrust and sensor models, and later extended it with the glide phase
- Set the timing of the wing deployment from the simulation

### Other subsystems

The other subsystems were developed by my teammates:

- **Mechanical design:** the rocket structure and the wing
- **Aerodynamics and flight dynamics:** the wing profile and the sloshing simulation
- **Avionics and propulsion:** integration of the avionics and the propulsion system

### Results

The simulation was run for the test case of the design report: a 2 L bottle with 667 ml of water at 6 bar, a 10 mm nozzle, a launch at 85° and a very light airframe. It is a test case of the model, not the performance of the actual rocket.

- The water phase lasts about 325 ms, and the air phase brings the total thrust time to about 490 ms. The thrust starts at about 80 N, and the total impulse is about 19 Ns.
- The rocket reaches a peak speed of about 58 m/s and an apogee of about 35 m, with a flight time of about 6 s.

![Thrust, inner air pressure, water mass and air mass over time, coloured by flight phase.](/portfolio/uploads/skyhawk-sim-propulsion.webp)

_Propulsion over the first 0.7 s._

![Altitude and speed over time for the test case.](/portfolio/uploads/skyhawk-sim-altitude-speed.webp)

_Altitude and speed._

![Animation of the simulated flight in a local east-north-up frame, coloured by flight phase.](/portfolio/uploads/skyhawk-sim-flight.mp4)

_Demo: the simulated flight._

**Effect of the wing (illustrative).** For a light rocket of 0.4 kg, unfolding the wings at the apogee gives a distance of about 300 m from the launch pad and about 41 s in the air, against about 15 m and 6 s with the wings folded. The benefit depends strongly on the wing loading: it falls quickly as the mass grows and disappears for rockets heavier than about 1 kg. The wing dimensions and aerodynamic coefficients of this study are assumptions and are not validated with flight data.

![Trajectory of the light rocket with the wings folded (dashed) and unfolded at the apogee (green), with altitude and speed.](/portfolio/uploads/skyhawk-sim-glide.webp)

_Wings folded and unfolded at the apogee._

![Animation of the glide for the light rocket.](/portfolio/uploads/skyhawk-sim-glide-vs-noglide.mp4)

_Demo: the glide with the wings unfolded at the apogee._

### Future work

- Validate the flight simulation against measured flight data
- Add the rotational dynamics and the gyroscope to the flight logic

Unfortunately, we could not launch the rocket at the event because of a technical problem. However, the team placed 3rd for the technical content, the engineering and the presentation.

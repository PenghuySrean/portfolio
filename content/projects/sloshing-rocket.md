---
title: "Airbus Sloshing Rocket"
demo: ""
tools: ""
skills: ""
---

A water rocket with a deployable wing, designed by Team Skyhawk Squadron, four TU Berlin master's students, for the Airbus Sloshing Water Rocket Workshop 2024. I was the team leader and in charge of the flight system: the flight computer and the 6-DOF flight simulation.

Unfortunately, we could not launch the rocket at the event because of a technical problem. However, the team placed 3rd for the technical content, the engineering and the presentation.

![CAD model of the Airbus Sloshing Rocket, designed by a teammate.](/portfolio/uploads/Screenshot%202026-10-17%20034430.webp)

_The rocket (CAD model by a teammate)._

### Objective

- Design a water rocket that maximises both the height and the flight time, by unfolding a wing at the apogee
- Understand how sloshing liquid in the tank affects the stability of the rocket
- Design a flight computer that deploys the wing and records the flight data
- Build a flight simulation to plan the flight logic before any hardware is available

### Methodology

- **Flight system requirements:** the flight computer must measure the flight, control the wing deployment, record the data and log it for analysis, and its algorithm must be model-based.
- **Flight computer:** I designed a custom circuit board with a microcontroller, an inertial sensor, a pressure sensor for the height, a memory card for the flight data, indicators, and three servo outputs, one for the wing deployment and two as backup.
- **Flight simulation:** I built a six-degree-of-freedom simulation in Simulink with translational and rotational dynamics, a barometer sensor model, and a thrust model of the water rocket.
- **Thrust model:** the model uses the ideal gas law and adiabatic expansion of the pressurised air, with the water mass flow through the throat.
- **Flight logic:** the simulation shows the best moment for deploying the wing, near the apogee, and lets us design the deployment logic from the measured altitude.
- **Software plan:** flight software generated as code from the Simulink model, and a four-day development plan for the workshop.

![The flight computer board with its main components labelled: Arduino Nano, BME280 pressure sensor, MPU6050 inertial sensor, memory card holder, buzzer, LED, power switch and digital pins.](/portfolio/uploads/skyhawk-flight-computer-pcb.webp)

_The flight computer board._

![Overview of the Simulink flight simulation: translational and rotational dynamics, the barometer sensor model, the simulated rocket states and the thrust model inspection.](/portfolio/uploads/skyhawk-simulink-model.webp)

_The Simulink flight simulation._

### My contribution

- Team leader, responsible for the project management
- Designed the flight computer
- Developed the 6-DOF flight simulation, including the thrust and sensor models

### Other subsystems

The other subsystems were developed by my teammates:

- **Mechanical design:** the rocket structure and the wing
- **Aerodynamics and flight dynamics:** the wing profile and the sloshing simulation
- **Avionics and propulsion:** integration of the avionics and the propulsion system

### Results

- The thrust model shows the pressure falling from about 6 bar to 3.5 bar in about 0.3 s while the water leaves the tank, with the thrust dropping from about 80 N to about 40 N
- The simulation reproduces the expected behaviour: once all the water is out, the air expands until its pressure equals the atmosphere
- The barometer model turns the simulated altitude into a noisy pressure signal, so the flight logic can be developed without flying
- 3rd place for the technical content, the engineering and the presentation

![Thrust model results: thrust, inner air pressure and water mass flow over time.](/portfolio/uploads/skyhawk-thrust-model.webp)

_Thrust model results._

![Simulated barometer signal: noisy and calculated pressure over time.](/portfolio/uploads/skyhawk-barometer-model.webp)

_Barometer sensor model._

### Future work

- Validate the flight simulation against measured flight data
- Add the rotational dynamics and the gyroscope to the flight logic

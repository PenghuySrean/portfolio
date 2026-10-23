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

### Simulation

The first step was a flight simulation of the rocket in Simulink, which I built so that design options could be tested before anything was built.

- **States:** the position and velocity in an Earth-fixed frame, and the masses of water and air in the bottle, integrated with a fixed-step Runge-Kutta solver (1 ms).
- **Forces:** point-mass gravity, aerodynamic drag in an exponential atmosphere, and thrust along the flight direction, for a launch at 85°.
- **Thrust model:** in the water phase, the air in the bottle expands adiabatically and pushes the water out as a jet (Bernoulli), including the area ratio between nozzle and bottle and the pressure of the water column under the thrust acceleration. Once the water is gone, the remaining air blows down isentropically through the nozzle, first choked and then subsonic, with the pressure thrust of the exhaust.
- **Sensors:** a barometer model turns the simulated altitude into a noisy pressure signal, so the flight logic can be developed without flying.
- **Rotational dynamics:** the model contains an attitude loop, which is switched off in the results shown.
- **After the event:** I revised the propulsion model and fixed a numerical error in it (a block update setting that held the thrust constant between solver stages), cross-checked it with an independent implementation in Python (apogee within 0.03 m), and extended it with a wing model (lift and drag at a fixed trimmed lift coefficient), checked against closed-form results such as the energy balance and the steady glide speed. The results below come from this revised model.

![Overview of the Simulink flight simulation: translational and rotational dynamics, the barometer sensor model, the simulated rocket states and the thrust model inspection.](/portfolio/uploads/skyhawk-simulink-model.webp)

_The Simulink flight simulation._

### Design: from the simulation to a foldable wing

The challenge is that two goals pull in opposite directions: a low-drag rocket climbs high but stays in the air for a short time, and a rocket built for airtime climbs less. The team chose a foldable wing from this trade-off, and I later used the extended simulation to test the alternatives and the deployment point, which confirmed the decision.

**A fixed wing, unfolded from the start.** The wing is large and lifts sideways while the rocket is still climbing almost vertically, so the lift pushes the rocket nearly horizontally and the rocket flips over. In the simulation, a wing unfolded at launch, or while the climb is still steep (below about 30 m), mostly sends the rocket backwards, and the wing load reaches 13 g. The apogee is not higher either, because the wing adds drag during the climb. The result also changes from run to run with small changes, so it cannot be relied on.

**A large wing is also sensitive to the wind.** In a two-dimensional simulation with an along-track wind, the landing point of a rocket with the wing out from the start moves by hundreds of metres for a wind change of a few metres per second, and even a wing unfolded at the apogee moves the landing point by about 35 m for each m/s of tailwind. A rocket with folded wings moves by only about 2 m per m/s.

**The best moment to unfold the wing is the apogee.** The rocket is slowest there (about 2.6 m/s), the wing load is lowest (about 1.9 g) and the lift points forward, so the rocket glides. Unfolding later, on the way down, gives up the height the glide needs: 250 m at 75% of the apogee height, but only 120 m at 25%.

![Landing point, peak wing load and flight paths of the light rocket for wings unfolded at different points of the flight.](/portfolio/uploads/skyhawk-sim-deploy-point.webp)

_Wings unfolded at different points: backwards flight (red) when unfolded too early, the longest glide at the apogee._

These results led to the **foldable wing**: folded during the climb, so the rocket reaches a greater height with low drag and little sensitivity to the wind, and unfolded at the apogee to glide. The sloshing of the water, the stability and the wing mechanism were handled by my teammates.

| Wing unfolded at | Distance from the launch pad | Peak wing load |
|---|---|---|
| launch | rocket flies backwards (223 m) | 13 g |
| 30 m up | unreliable (4 m or 284 m, the two implementations disagree) | 4 g |
| 40 m up | 301 m | 2.1 g |
| **apogee** | **308 m** | **1.9 g** |
| 25% of the apogee height, on the way down | 119 m | 7.3 g |

### Expected performance

For a light variant of the rocket, the simulation gives the following. The rocket as documented in the design report is much heavier (4.24 kg at take-off, because of the slosh tank and the wing mechanism), so it is shown next to it.

| | Light variant (illustrative) | As documented |
|---|---|---|
| Bottle volume | 2 L | 2 L |
| Water for propulsion | 0.7 L (35%) | 0.5 L |
| Launch pressure | 8 bar | 6 bar |
| Nozzle diameter | 10 mm | 10 mm |
| Mass without propulsion water | 0.4 kg | 3.74 kg |
| Wing area (assumed 0.12 m chord, 1.14 m span) | 0.125 m² | 0.125 m² |
| Apogee | 41.8 m | 0.3 m |
| Distance from the pad | **308 m** | 0.2 m |
| Time in the air | **41 s** | 0.7 s |

With the wings folded, the light variant lands 15 m from the pad after 6 s. The benefit of the wing depends strongly on the mass: the distance falls from 375 m at 0.3 kg to 72 m at 0.8 kg and 12 m at 1 kg, so the rocket has to be light, and the heavier documented design cannot reach an altitude from which it can glide. A sensitivity study of the wing assumptions (zero-lift drag, lift coefficient, chord, efficiency) changes the distance of the light variant between about 160 and 340 m, and a pessimistic low-Reynolds-number wing gives about 160 m. These values come from assumptions and are not validated with flight data.

![Animation of the glide for the light variant.](/portfolio/uploads/skyhawk-sim-glide-vs-noglide.mp4)

_Demo: the light variant with the wings unfolded at the apogee, compared with folded wings (dashed)._

![Thrust, inner air pressure, water mass and air mass over time, coloured by flight phase.](/portfolio/uploads/skyhawk-sim-propulsion.webp)

_Propulsion over the first 0.7 s (test case of the design report: 2 L, 667 ml of water, 6 bar, 10 mm nozzle)._

![Trajectory of the light rocket with the wings folded (dashed) and unfolded at the apogee (green), with altitude and speed.](/portfolio/uploads/skyhawk-sim-glide.webp)

_Wings folded and unfolded at the apogee._

### Flight computer and wing deployment

The wing has to unfold at the apogee, so the rocket needs to detect it. The flight computer, which I designed, does this:

1. The **pressure sensor** measures the atmospheric pressure, and the microcontroller converts it into the altitude.
2. The **inertial sensor** records the acceleration and the angular rate for the flight analysis.
3. At the deployment altitude, set near the apogee, the microcontroller sends a signal to the **servo motor**.
4. The servo releases the **rubber band** that holds the wings folded, and the **tension springs** unfold them against the air. A **pin puller** then locks each wing in the unfolded position.
5. The board also logs the flight data on a memory card, and has indicators (LED and buzzer) for the development and the launch.

The board has a microcontroller, an inertial sensor, a pressure sensor, a memory card, indicators and three servo outputs, one for the wing deployment and two as backup. The deployment logic was designed with the simulation, with a barometer model that includes sensor noise.

![The flight computer board with its main components labelled: Arduino Nano, BME280 pressure sensor, MPU6050 inertial sensor, memory card holder, buzzer, LED, power switch and digital pins.](/portfolio/uploads/skyhawk-flight-computer-pcb.webp)

_The flight computer board._

### The rocket

The rocket has a body made from PET bottles with a sharp nose cone, four swept fins, two foldable wings, and the slosh tank mounted on the body. My teammates designed the structure, the wing and the mechanism.

![The rocket with the wings folded for the climb.](/portfolio/uploads/skyhawk-rocket-folded.webp)

_Wings folded during the climb._

![The rocket with the wings unfolded at the apogee.](/portfolio/uploads/skyhawk-rocket-unfolded.webp)

_Wings unfolded at the apogee._

![The wing mechanism with its parts labelled: servo motor, rubber band, tension springs, pin puller, wing housings and mount.](/portfolio/uploads/skyhawk-wing-mechanism.webp)

_The wing deployment mechanism._

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

### Future work

- Validate the flight simulation against measured flight data
- Add the rotational dynamics and the gyroscope to the flight logic

Unfortunately, we could not launch the rocket at the event because of a technical problem. However, the team placed 3rd for the technical content, the engineering and the presentation.

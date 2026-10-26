---
title: "Airbus Sloshing Rocket"
demo: ""
tools: ""
skills: ""
---

### Competition overview

- **Competition:** the Airbus Sloshing Rocket Workshop, organised by EUROAVIA with Airbus. Student teams design a low-cost water rocket and present it at the workshop in Portugal. The 2024 edition was my team's entry.
- **Challenge:** a rocket whose flight is disturbed by the sloshing of water in an unpressurised tank, which the design has to manage, passively (for example with baffles) or actively (for example with control surfaces).
- **Judged on:** the distance covered, the altitude reached, the total flight time and the payload, together with the technical report and the presentation.
- **Main rules:** at most 1.5 m long, 2.25 m wingspan and 5 kg at take-off, launched at 85° with a pressure below 10 atmospheres. The unpressurised slosh tank holds at least 500 ml of water, half full, and the propulsion water must not weigh more than the water in the slosh tank. Water is the only propellant, and air the only gas.
- **Team:** four TU Berlin master's students, each leading one subsystem and supporting another.

### Approach

To fly as high and as far as possible, the first question was how much water to put in the propulsion tank. Without a slosh tank, about 35% of the bottle is roughly the optimum. The rules change this: the water in the slosh tank must be at least as heavy as the propulsion water, so the slosh tank grows with the propulsion water and its mass counts against the take-off limit. This coupling cannot be settled by hand, so I simulated it. With the wings folded, the best fill was about 12.5% (0.5 L), reaching 14.3 m, against 11.6 m at 35% (the tank masses are estimates). The second question was the wing. A wing would give a longer descent, but a fixed wing was a problem: it could flip the rocket backwards during the climb, and its large area would make a near-vertical rocket sensitive to wind. This led to a deployable wing, folded during the climb and unfolded in flight. To choose when to unfold it, I extended the simulation with a wing model. Deploying near the apogee gives the rocket the best chance to glide far.

### Simulation

Both questions were answered with a flight simulation of the rocket in Simulink, which I built so that design options could be tested before anything was built.

- **States:** the position and velocity in an Earth-fixed frame, and the masses of water and air in the bottle, integrated with a fixed-step Runge-Kutta solver (1 ms).
- **Forces:** point-mass gravity, aerodynamic drag in an exponential atmosphere, and thrust along the flight direction, for a launch at 85°.
- **Thrust model:** in the water phase, the air in the bottle expands adiabatically and pushes the water out as a jet (Bernoulli), including the area ratio between nozzle and bottle and the pressure of the water column under the thrust acceleration. Once the water is gone, the remaining air blows down isentropically through the nozzle, first choked and then subsonic, with the pressure thrust of the exhaust.
- **Sensors:** a barometer model turns the simulated altitude into a noisy pressure signal, so the flight logic can be developed without flying.
- **After the event:** I revised the propulsion model, fixed a numerical error in it (a block update setting that held the thrust constant between solver stages) and a double-counted launch impulse at the start, cross-checked it with an independent Python implementation (apogee within 0.03 m), and extended it with a wing model (lift and drag at a fixed trimmed lift coefficient) checked against closed-form results such as the energy balance and the steady glide speed. The results below come from this revised model.

![Overview of the Simulink flight simulation: the translational dynamics, the barometer sensor model, the simulated rocket states and the thrust model inspection.](/portfolio/uploads/skyhawk-simulink-model.webp)

_The Simulink flight simulation._

### Design of the rocket

The team chose a foldable wing to combine a low-drag climb with a longer descent. The wings stay folded during the powered climb and unfold at the apogee. In the simulation, deploying during the steep climb produces large sideways forces, while deploying late on the descent gives up the height needed to accelerate into a glide. The sloshing analysis, stability work and wing mechanism were handled by my teammates.

![CAD model of the Airbus Sloshing Rocket, designed by a teammate.](/portfolio/uploads/Screenshot%202026-10-17%20034430.webp)

_The rocket (CAD model by a teammate)._

The rocket has a body made from PET bottles with a sharp nose cone, four swept fins, two foldable wings, and the slosh tank mounted on the body. My teammates designed the structure, the wing and the mechanism.

![The rocket with the wings folded for the climb.](/portfolio/uploads/skyhawk-rocket-folded.webp)

_Wings folded during the climb._

![The rocket with the wings unfolded at the apogee.](/portfolio/uploads/skyhawk-rocket-unfolded.webp)

_Wings unfolded at the apogee._

![The wing mechanism with its parts labelled: servo motor, rubber band, tension springs, pin puller, wing housings and mount.](/portfolio/uploads/skyhawk-wing-mechanism.webp)

_The wing deployment mechanism._

### Flight computer and wing deployment

The wing has to unfold at the apogee, so the rocket needs to detect it, and the flight needs to be recorded. I designed this flight computer in KiCad to operate the wing and to collect the flight data:

![KiCad 3D model of the flight computer, front and back, with its main components labelled: Arduino Nano, BME280 pressure sensor, MPU6050 inertial sensor, memory card holder, buzzer, LED, power switch and digital pins.](/portfolio/uploads/skyhawk-flight-computer-pcb.webp)

_The flight computer in KiCad (front and back)._

It works as follows:

1. The **pressure sensor** measures the atmospheric pressure, and the microcontroller converts it into the altitude.
2. The **inertial sensor** records the acceleration and the angular rate for the flight analysis.
3. At the deployment altitude, set near the apogee, the microcontroller sends a signal to the **servo motor**.
4. The servo releases the **rubber band** that holds the wings folded, and the **tension springs** unfold them against the air. A **pin puller** then locks each wing in the unfolded position.
5. The board also logs the flight data on a memory card, and has indicators (LED and buzzer) for the development and the launch.

The board has a microcontroller, an inertial sensor, a pressure sensor, a memory card, indicators and three servo outputs, one for the wing deployment and two as backup. The deployment logic was designed with the simulation, with a barometer model that includes sensor noise.

### Results: expected performance

The design report lists a structure mass of 3.24 kg before adding the water. With the revised model I explored a lighter redesign that keeps the slosh tank and the deployable wing: a **1.1 kg structure target**, including the wing, mechanism and electronics, with a 4 L propulsion tank, a 15 mm nozzle, a launch pressure of 10 bar absolute (9.87 atm, just under the limit) and 0.5 L each of propulsion and slosh water. The wing follows the CAD dimensions, enlarged to about 1.37 m span and 0.27 m mean chord so the panels still fold along the 0.8 m body tube. This is an unbuilt target: earlier component estimates totalled 1.2 kg, and the last 100 g have not been allocated to components.

**The model predicts a maximum height of 14.3 m.** With the wings folded, the rocket lands 5.6 m from the pad after 3.5 s. With instant deployment and an idealised trimmed wing, it travels 52.0 m and stays aloft for 7.9 s. Limiting the lift to 1.5 times the weight reduces this to 16.6 m and 4.0 s. The table changes only the structure mass.

| Structure mass, including wing and mechanism | Maximum height | Distance: idealised glide | Distance: 1.5 g pull-up limit |
|---|---:|---:|---:|
| 1.0 kg | 16.0 m | 86.1 m | 24.7 m |
| **1.1 kg** | **14.3 m** | **52.0 m** | **16.6 m** |
| 1.2 kg | 12.8 m | 13.0 m | 12.5 m |

![Native Simulink flight simulation of the 1.1 kg structure, wings folded and unfolded.](/portfolio/uploads/skyhawk-sim-balanced-1p1-flight.mp4)

_Native Simulink, 1.1 kg structure and 15 mm nozzle. Solid: wings unfolded; dashed: wings folded._

![Trajectory and altitude over time for the 1.1 kg structure study.](/portfolio/uploads/skyhawk-sim-balanced-1p1-trajectory.png)

_The same rocket with the wings folded and unfolded at apogee._

Limits of these results:

- **Flight model:** translational dynamics with a trimmed wing at a fixed lift coefficient of 0.8; no stall, pitch dynamics or deployment delay. The glide distances are upper bounds, and the large gap between the two glide columns shows how sensitive the range is to the pull-up.
- **Verification:** the propulsion and glide models were cross-checked between Python and Simulink and against analytical checks. The 1.1 kg figures use native Simulink runs with a 1 ms step; the 1.5 g limit uses the Python replica.
- **Validation:** none of these numbers has been compared with flight measurements. They are needed, especially for the wing aerodynamics and the transition from a near-vertical climb into a glide.

Unfortunately, we could not launch the rocket at the event because of a technical problem. However, the team placed 3rd for the technical content, the engineering and the presentation.

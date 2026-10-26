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

The team chose a foldable wing to combine a low-drag climb with a longer descent. The wings stay folded during the powered climb and unfold near the apogee. I later extended the simulation to study that choice: deploying during the steep climb produces large sideways forces, while deploying late on the descent gives up the height needed to accelerate into a glide. The actual pitch-over and deployment transient still need a coupled attitude model.

The sloshing analysis, stability work and wing mechanism were handled by my teammates. My later simulation study concerns the flight performance of the combined design.

### How much propulsion water?

A published study of simple water rockets reports an optimum water fraction of about [30–40% for maximum flight distance](https://www.jstage.jst.go.jp/article/jsmemecjo/2000.4/0/2000.4_517/_article/-char/en). That is a reference, rather than a universal optimum. Our design carries an unpressurised slosh tank, and the competition rule requires its water to weigh at least as much as the propulsion water.

I swept the propulsion-water fill from **10% to 50% in 2.5 percentage-point steps**, using the native Simulink model with **the wings folded throughout**. The propulsion tank is 4 L, launch pressure is 10 bar absolute and the nozzle diameter is 15 mm. The baseline structure is 1.1 kg with 0.5 kg of slosh water. When more propulsion water requires more slosh water, the estimated tank hardware mass also increases with tank volume to the power of two-thirds. A fixed-payload comparison relaxes this coupling to show its effect.

**The highest feasible sampled flight used 12.5% water (0.50 L), reaching 14.3 m.** At 35% fill (1.4 L), the predicted maximum height was 11.6 m. Extra propulsion water requires additional slosh water and a larger tank, offsetting the extra propellant. This identifies the best sampled fill for the stated design assumptions; a finer sweep and flight data would be needed to establish a precise optimum.

![Maximum height, distance and payload share for water fills from 10% to 50%.](/portfolio/uploads/skyhawk-water-fill-sweep.png)

_Native Simulink sweep, wings folded. The fixed-payload curve relaxes the water-mass rule. Red crosses mark cases above the 5 kg take-off limit; these are excluded when selecting the best feasible fill._

![3D trajectories, altitude and speed for selected water fills, with the wings folded.](/portfolio/uploads/skyhawk-water-fill-trajectories.png)

_Selected fills: 10%, 12.5%, 35% and 50%. The 50% case exceeds the take-off mass limit and is shown for comparison._

![3D flight animation comparing the selected water fills with the wings folded.](/portfolio/uploads/skyhawk-water-fill-flight.mp4)

_The same native simulations, shown in the East–North–Up frame. There is no glide phase in this study._

The comparison concerns flight performance. More water increases the payload share of take-off mass, so the best competition score also depends on the scoring weights. Tank masses remain estimates, and the trajectories have not been validated against flight measurements.


### Expected performance

The design report lists a structure mass of 3.24 kg before adding the water. I used the revised model to explore a lighter redesign that keeps the slosh tank and deployable wing. The current study uses a **1.1 kg structure target**, including the wing, mechanism and electronics, with a 4 L propulsion tank, a 15 mm nozzle and 10 bar absolute launch pressure. Both the propulsion water and the slosh water are 0.5 L. This is an unbuilt design target; the parts have not been weighed at this mass.

The wing is based on the CAD dimensions and enlarged to about 1.37 m span and 0.27 m mean chord, so the panels can still fold along the 0.8 m body tube. Earlier component estimates totalled a 1.2 kg structure. Reaching 1.1 kg requires another 100 g reduction, which has not yet been allocated to individual components.

**The corrected model predicts a maximum height of 14.3 m.** With the wings folded, the rocket lands 5.6 m from the pad after 3.5 s. With instant deployment and an idealised trimmed wing, it travels 52.0 m and stays aloft for 7.9 s. That glide is an upper bound: limiting lift to 1.5 times the rocket's weight reduces the distance to 16.6 m and the flight time to 4.0 s. The load limit is a sensitivity study, not a validated prediction of the real transition into a glide.

The following comparison keeps the tank, nozzle, water, wing and launch pressure the same; only the structure mass changes.

| Structure mass, including wing and mechanism | Maximum height | Distance: idealised glide | Distance: 1.5 g pull-up limit |
|---|---:|---:|---:|
| 1.0 kg | 16.0 m | 86.1 m | 24.7 m |
| **1.1 kg** | **14.3 m** | **52.0 m** | **16.6 m** |
| 1.2 kg | 12.8 m | 13.0 m | 12.5 m |

The 1.1 kg case leaves more mass allowance than the 1.0 kg target and improves the predicted range over 1.2 kg. The large difference between the two glide assumptions shows how sensitive the predicted range is to the pull-up. Deployment and pitch-over dynamics still need to be modelled. None of these distances has been validated against flight measurements.

![Native Simulink flight simulation of the 1.1 kg structure, wings folded and unfolded.](/portfolio/uploads/skyhawk-sim-balanced-1p1-flight.mp4)

_Native Simulink, 1.1 kg structure and 15 mm nozzle. Solid: wings unfolded; dashed: wings folded. The glide is an idealised upper bound._

![Trajectory and altitude over time for the corrected 1.1 kg structure study.](/portfolio/uploads/skyhawk-sim-balanced-1p1-trajectory.png)

_The same rocket with the wings folded and unfolded at apogee. Both runs use the native Simulink model._

All cases use the corrected launch initialisation, which avoids adding thrust impulse twice at the start. The mass comparison uses a 15 mm nozzle throughout.

Assumptions and checks:

- **Flight model:** translational dynamics with a trimmed wing at a fixed lift coefficient of 0.8; no stall, pitch dynamics or deployment delay. The rocket is assumed to adopt its glide attitude immediately when the wing unfolds.
- **Verification:** the earlier propulsion and glide implementations were cross-checked between Python and Simulink and against analytical checks, including energy balance and steady glide. The current 1.1 kg figures and animation use native Simulink runs, with a 1 ms integration step. The separate 1.5 g sensitivity numbers use the Python replica.
- **Validation:** measured flight data are still needed, especially for the wing aerodynamics and the transition from a near-vertical climb into a glide.

![Thrust, inner air pressure, water mass and air mass over time, coloured by flight phase.](/portfolio/uploads/skyhawk-sim-propulsion.png)

_Propulsion reference case from the design report: 2 L, 667 ml of water, 6 bar and a 10 mm nozzle. This is a separate case from the 1.1 kg study._

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

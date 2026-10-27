---
title: "Airbus Sloshing Rocket"
demo: ""
tools: ""
skills: ""
---

This project was developed by my team, Skyhawk Squadron, led by me, for the Airbus Sloshing Water Rocket Workshop 2024 in Lisbon, Portugal.

### Competition overview

- **Competition:** Airbus Sloshing Rocket Workshop 2024, organised by EUROAVIA with Airbus. Student teams design a low-cost water rocket and present it in Lisbon.
- **Challenge:** manage the sloshing of the water in an unpressurised tank, passively or actively.
- **Scoring:** distance, altitude, flight time and payload, together with the technical report and the presentation.
- **Rules:** limits on length, wingspan and take-off mass (5 kg). The slosh tank must hold at least 500 ml of water, and the propulsion water must not weigh more than the slosh water.
- **Team:** four TU Berlin master's students.

### Approach

To fly as high and as far as possible, the first question was how much water to put in the propulsion tank. The rules require the water in the slosh tank to be at least as heavy as the propulsion water, so the slosh tank grows with the propulsion water and its mass counts against the take-off limit. This coupling cannot be settled by hand, so I simulated it. The second question was the wing. A wing gives a longer descent, but a fixed wing is a problem: during the vertical climb its lift could flip the rocket over, and the glide would be lost. A deployable wing avoids this.

#### CAD model

The rocket carries two foldable wings. The CAD model, the mechanism, the wing and fin profile (NACA 0012) and the stability analysis were done by teammates.

![CAD model of the Airbus Sloshing Rocket, designed by a teammate.](/portfolio/uploads/Screenshot%202026-10-17%20034430.webp)

_The rocket (CAD model by a teammate)._

#### Simulation

The flight simulation was built in Simulink as a point-mass model with gravity, drag and thrust. The thrust model covers the water phase, with adiabatic expansion of the air and a Bernoulli jet, and the following air blow-down. The wing is modelled with lift and drag at a fixed trimmed lift coefficient. The model was refined after the event and verified against an independent Python implementation and closed-form results.

![The Simulink flight simulation: the mass, gravity, drag and thrust blocks and the equations of motion.](/portfolio/uploads/skyhawk-simulink-model.webp)

_The Simulink flight simulation._

**Propulsion water.** The fill was varied with the wings folded, with the slosh water and the tank mass increasing with the propellant. The height is nearly flat between 0.5 and 0.8 L, so the lightest, 0.5 L, was used. The tank masses are estimates.

![Maximum height against propulsion water fill.](/portfolio/uploads/skyhawk-water-fill-height.png)

_Maximum height against water fill, wings folded._

**Deployment point.** Varying the deployment point shows that the apogee is the best choice: the glide is far longer than for deployment during the climb or the descent. With the wing open during the vertical climb, the simulated lift pushes the rocket backwards. In flight this would flip the rocket over and lose the glide.

![Trajectories for wing deployment at different points of the flight.](/portfolio/uploads/skyhawk-deploy-trajectories.png)

_Trajectories for different deployment points._

**Simulated flight.** The design study has a lift-off mass of about 2.1 kg and a glide mass of about 1.6 kg. The model predicts an apogee of roughly 15 m, and deploying the wing at the apogee gives a glide of roughly 50 m in the idealised case.

![Simulink flight simulation with the wings folded and unfolded.](/portfolio/uploads/skyhawk-sim-balanced-1p1-flight.mp4)

_Simulink flight simulation. Solid: wings unfolded; dashed: wings folded._

**Limitations.** A constant lift coefficient and the absence of stall, pitch dynamics and deployment delay make the glide distances upper bounds. None of the results has been compared with flight data.

#### Flight computer

I designed a flight computer in KiCad to deploy the wing and record the flight data. The pressure sensor gives the altitude, and near the apogee the microcontroller commands the servo, which releases a rubber band; tension springs then unfold the wings and a pin puller locks them. An inertial sensor records the acceleration and the angular rate, and a memory card stores the data. An LED and a buzzer indicate the status.

![KiCad 3D model of the flight computer, front and back, with its main components labelled: Arduino Nano, BME280 pressure sensor, MPU6050 inertial sensor, memory card holder, buzzer, LED, power switch and digital pins.](/portfolio/uploads/skyhawk-flight-computer-pcb.webp)

_The flight computer in KiCad (front and back)._

### Results

The team was selected as a finalist and invited to the workshop in Lisbon. Unfortunately, we could not launch the rocket at the event because of a technical problem. However, the team placed 3rd for the technical content, the engineering and the presentation.

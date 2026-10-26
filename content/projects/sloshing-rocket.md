---
title: "Airbus Sloshing Rocket"
demo: ""
tools: ""
skills: ""
---

### Competition overview

- **Competition:** Airbus Sloshing Rocket Workshop 2024, organised by EUROAVIA with Airbus. Student teams design a low-cost water rocket and present it in Lisbon.
- **Challenge:** manage the sloshing of the water in an unpressurised tank, passively or actively.
- **Scoring:** distance, altitude, flight time and payload, together with the technical report and the presentation.
- **Rules:** length up to 1.5 m, wingspan up to 2.25 m, take-off mass up to 5 kg, launch angle 85°, pressure below 10 atm. The slosh tank holds at least 500 ml of water at half fill, and the propulsion water must not weigh more than the slosh water. Water is the only propellant.
- **Team:** four TU Berlin master's students.

### Objective

- Maximise the altitude and the distance of the flight
- Manage the sloshing of the liquid in the tank

### Methodology

The design followed two questions. The first was the propulsion water: without a slosh tank the optimum fill is roughly 35% of the tank volume, but the rules require the slosh water to weigh at least as much as the propulsion water, so the slosh tank grows with the propellant and its mass counts against the take-off limit. This trade-off was evaluated by simulation. The second was the wing: a fixed wing risks flipping the rocket during the climb and, through its area, makes the near-vertical flight sensitive to wind. A deployable wing, folded during the climb and unfolded in flight, avoids both, and the simulation was used to select the deployment point.

#### CAD model

The rocket carries two foldable wings, released by a rubber band, tension springs and a pin puller. The CAD model and the mechanism were designed by teammates.

![CAD model of the Airbus Sloshing Rocket, designed by a teammate.](/portfolio/uploads/Screenshot%202026-10-17%20034430.webp)

_The rocket (CAD model by a teammate)._

#### Simulation

The flight simulation was built in Simulink as a point-mass model. Its states are the position, the velocity and the masses of water and air in the bottle, integrated with a fixed-step Runge-Kutta solver (1 ms). The forces are gravity, drag in an exponential atmosphere and thrust along the flight direction. The thrust model covers the water phase, with adiabatic expansion of the air and a Bernoulli jet, and the following air blow-down through the nozzle, first choked and then subsonic. The wing is modelled with lift and drag at a fixed trimmed lift coefficient. The model was refined after the event and verified against an independent Python implementation and closed-form results (energy balance, steady glide speed).

![Overview of the Simulink flight simulation: the translational dynamics, the simulated rocket states and the thrust model inspection.](/portfolio/uploads/skyhawk-simulink-model.webp)

_The Simulink flight simulation._

**Propulsion water.** The fill of the 4 L tank was varied from 10% to 50% with the wings folded (10 bar absolute, 1.1 kg structure), with the slosh water and the tank mass increasing with the propellant. With the 22 mm nozzle the height peaks at 15.0 m for fills of 12.5% to 20% and falls to 13.0 m at 35%; the 10 mm nozzle reaches 12.7 m at best. The 12.5% fill (0.5 L) is within 0.1 m of the maximum and was used. The tank masses are estimates.

![Maximum height against propulsion water fill for the 10 mm and 22 mm nozzles.](/portfolio/uploads/skyhawk-water-fill-height.png)

_Maximum height against water fill, wings folded. Crosses mark take-off masses above 5 kg._

**Deployment point.** Varying the deployment point from launch to the descent shows that the apogee is the best choice: it gives 53 m for the idealised glide and 17 m with a 1.5 g lift limit, against 6 to 14 m for deployment during the climb or the descent. Early deployment can push the rocket backwards, an effect of the model having no attitude.

![Trajectories for wing deployment at different points of the flight, with the landing distance in the legend.](/portfolio/uploads/skyhawk-deploy-trajectories-22mm.png)

_Trajectories for different deployment points, 22 mm nozzle._

**Expected performance.** The design target is a 1.1 kg structure including wing, mechanism and electronics (design report: 3.24 kg), with a 4 L tank, a 22 mm nozzle, 10 bar absolute (9.87 atm) and 0.5 L each of propulsion and slosh water. The wing spans 1.37 m with a 0.27 m chord and folds along the 0.8 m body. The target is unbuilt; the component estimates total 1.2 kg.

The model predicts an apogee of 14.9 m. With the wings folded the rocket lands 6.0 m from the pad after 3.5 s. With deployment at the apogee, an idealised glide gives 53 m and 8.0 s, and a 1.5 g lift limit gives 17 m and 4.0 s. The 1.2 kg structure no longer glides, which sets the mass target.

| Structure mass | Apogee | Distance, idealised glide | Distance, 1.5 g limit |
|---|---:|---:|---:|
| 1.0 kg | 16.7 m | 87.8 m | 27.1 m |
| **1.1 kg** | **14.9 m** | **53.3 m** | **17.4 m** |
| 1.2 kg | 13.4 m | 13.9 m | 13.0 m |

![Simulink flight simulation of the 1.1 kg structure with the wings folded and unfolded.](/portfolio/uploads/skyhawk-sim-balanced-1p1-flight.mp4)

_Simulink, 1.1 kg structure, 22 mm nozzle. Solid: wings unfolded; dashed: wings folded._

**Limitations.** A constant lift coefficient of 0.8 and the absence of stall, pitch dynamics and deployment delay make the glide distances upper bounds. None of the results has been compared with flight data.

#### Wing analysis

The wing analysis was carried out by teammates. A symmetric NACA 0012 airfoil was chosen for the wing and fins because of its low effective area, with four fins and two wings to offset the water shedding from the wings. The airfoil was analysed in XFLR5 (polars and pressure distribution), and the stability of a 1:10 scale model was checked in OpenRocket: with the flight computer and a parachute placed near the nose cone, the static margin reaches 1.73 calibres.

![XFLR5 polars of the NACA 0012 airfoil for Reynolds numbers from 30,000 to 3,000,000: lift, drag, moment and lift-to-drag against angle of attack.](/portfolio/uploads/skyhawk-xflr5-polars.webp)

_XFLR5 polars of the NACA 0012 (Reynolds numbers 30,000 to 3,000,000)._

![XFLR5 pressure coefficient along the NACA 0012 chord at a Reynolds number of 30,000.](/portfolio/uploads/skyhawk-xflr5-cp.webp)

_Pressure coefficient along the chord, Reynolds number 30,000._

#### Flight computer

I designed a flight computer in KiCad to deploy the wing and record the flight data. The pressure sensor gives the altitude, and near the apogee the microcontroller commands the servo, which releases a rubber band; tension springs then unfold the wings and a pin puller locks them. An inertial sensor records the acceleration and the angular rate, and a memory card stores the data. An LED and a buzzer indicate the status. Three servo outputs are provided, one for the deployment and two as backup.

![KiCad 3D model of the flight computer, front and back, with its main components labelled: Arduino Nano, BME280 pressure sensor, MPU6050 inertial sensor, memory card holder, buzzer, LED, power switch and digital pins.](/portfolio/uploads/skyhawk-flight-computer-pcb.webp)

_The flight computer in KiCad (front and back)._

### Results

The team was selected as a finalist and invited to the workshop in Lisbon. Unfortunately, we could not launch the rocket at the event because of a technical problem. However, the team placed 3rd for the technical content, the engineering and the presentation.

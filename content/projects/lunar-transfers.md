---
title: "Cislunar collision risk assessment"
demo: ""
tools: "ESA MASTER debris model, CCSDS OEM"
skills: "Collision risk assessment, Mission design, Test trajectory generation, Software verification"
---

### The problem

Lunar and interplanetary missions leave Earth through the low Earth orbit region, where the debris population keeps growing. The crossing is fast and brief, so the chance of a collision is small, but at these speeds an impact is far more likely to be catastrophic. Existing collision-risk tools are built for spacecraft that stay in orbit and are described by a single set of Keplerian elements. ESA's compliance guidelines state that no fully dedicated tool exists for assessing collision risk outside Earth orbits.

### What I built

A collision-risk assessment tool that takes a mission trajectory directly as an Orbit Ephemeris Message (OEM) state history, so it can handle any trajectory, including hyperbolic segments. It was developed as a module of an ESA-funded space-safety software suite and was the subject of my master's thesis at Technische Universität Berlin.

![Block diagram of the collision-risk assessment pipeline: OEM state history, locally Keplerian arcs, grid-cell passages, debris flux from ESA MASTER with a cache, and risk metrics.](/portfolio/uploads/crl-pipeline.svg)

*The pipeline, from a trajectory file to risk metrics per cell and per mission.*

The tool reports three metrics: the **collision probability**, the **catastrophic fraction** (the share of collisions energetic enough to destroy the spacecraft), and the **unmitigable catastrophic fraction** (the share caused by debris of 10 cm or smaller, which is too small to be tracked and avoided).

### Test cases

I designed three lunar transfers from scratch to demonstrate the tool, and compared them with four resident Earth-orbit baselines (ISS-like, Starlink-like, sun-synchronous and GTO-like). All cases use a 1000 kg spacecraft with a 1 m² cross-section, the same epoch and the same debris model.

- **Free-return transfer:** a ballistic round trip around the Moon, computed in the circular restricted three-body problem.
- **Phasing loop:** a sequence of Earth-centred two-body arcs connected by impulsive manoeuvres to meet a lunar arrival epoch.
- **Low-thrust spiral:** a transfer from a GTO-like orbit to an Earth–Moon L1 halo orbit, in three phases: a tangential-thrust spiral, an optimised bridge arc (direct shooting solved with SLSQP), and a coast along the stable manifold.

![The three lunar transfer cases in an Earth-centred inertial frame: free-return, low-thrust spiral with its bridge, manifold coast and halo orbit, and phasing loop.](/portfolio/uploads/crl-cases.webp)

*The three demonstration trajectories, in an inertial frame.*

I verified the pipeline in two ways. The mission designs were checked against their own physics (the Jacobi constant stays constant for the free-return and the manifold, the loop count times the orbital period matches the phasing-loop duration, and the mass history of the low-thrust arc matches the rocket equation). The collision probability was compared with ESA MASTER's target-orbit mode on four circular-orbit cases.

### Results

**Exposure is brief.** The transfers spend a very short time in the protected LEO region: 0.33 hours for the free-return (two passages), 7.76 hours for the phasing loop and 5.06 hours for the low-thrust transfer, compared with roughly 8,800 hours for a circular LEO baseline over a year. Their hourly collision accumulation is nearly identical, so residence time explains most of the differences in probability between them.

**Probability and severity do not coincide.** The maps below show where each transfer collects collision probability (top) and where its collisions are most likely to be catastrophic (bottom). The two peak in different places, so a region with low probability can still carry the most severe encounters.

![Cell-level collision probability and catastrophic fraction for the free-return, phasing-loop and low-thrust transfers, by right ascension and altitude.](/portfolio/uploads/crl-cells-transfer.webp)

*Collision probability (top) and catastrophic fraction (bottom) per grid cell for the three transfers.*

**Risk is concentrated.** For the transfers, the most active 5% of cells carry 36–46% of the catastrophic contribution. For the circular resident baselines, the same share is only 11–16%.

**A meaningful share cannot be screened.** Of the catastrophic contribution, 19–25% comes from debris of 10 cm or smaller, a larger share than for the ISS-like and Starlink-like baselines.

![Collision probability and catastrophic fraction per altitude bin for the three transfers, with the unmitigable part highlighted.](/portfolio/uploads/crl-altitude-profiles.webp)

*Risk by altitude. Blue is all collisions, red is the part caused by debris of 10 cm or smaller.*

### My role

I developed the collision-risk assessment tool, designed the three demonstration trajectories, and carried out the verification and the analysis, as part of an ESA-funded project.

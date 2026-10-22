---
title: "6-DOF Spacecraft Simulator"
demo: "![](../uploads/adcs-attitude-control-simulation.mp4)"
tools: "MATLAB/Simulink, ROS 2, Python"
skills: "6-DOF attitude–orbit simulation, Attitude determination (TRIAD), Detumbling control (B-dot), Actuator sizing, Power budget, Sensor calibration and fusion, Hardware integration and testing"
---

A six-degree-of-freedom orbit and attitude simulator, developed from scratch in MATLAB. It includes sensor and actuator models and is configurable, so that different estimation and control algorithms can be evaluated on different hardware configurations.

### Objective

- Develop an in-depth understanding of spacecraft attitude determination and control through implementation
- Evaluate attitude estimation algorithms, such as TRIAD
- Evaluate control algorithms with different actuator configurations
- Simulate both attitude and orbit manoeuvres
- Support the ADCS design of a student CubeSat

### Methodology

The simulator was developed incrementally, and each stage was verified before the next was added:

1. Orbit propagation as a point mass
2. Atmospheric drag and J2 perturbation
3. Attitude dynamics
4. Magnetic field model and disturbance torques
5. Magnetorquers with B-dot detumbling control
6. Julian date and sun position
7. Sensor models (sun sensor, magnetometer, gyro) with TRIAD attitude determination
8. Reaction wheel with nadir-pointing control

### Application: student-led CubeSat project

A student-led CubeSat project with teammates from TU Berlin, aimed at measuring thermal neutral density and proton flux. I was responsible for attitude determination and control, and used the simulator to support the ADCS design.

### Contribution

- Defined the ADCS requirements and developed the concept and architecture
- Compared sensors, magnetorquers and drivers in a trade-off analysis
- Estimated detumbling time and sized the actuators using the simulator

### Future work

- Implement and compare further attitude estimation algorithms, such as QUEST and a multiplicative extended Kalman filter (MEKF)
- Test the algorithms on different sensor and actuator configurations
- Extend the simulator to support the design of a wider range of missions, including very low Earth orbit (VLEO)
- Move from simulation towards hardware implementation and testing

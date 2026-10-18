---
title: "European Rover Challenge"
demo: "/portfolio/uploads/rover-flat-yard-nav2.webm"
tools: "ROS 2, Nav2, slam_toolbox, robot_localization, Gazebo, RViz, LiDAR, stereo camera, ArUco"
skills: "Mobile robotics, mapping, localization, sensor fusion, navigation, simulation"
---

I led development of the rover navigation subsystem for the European Rover Challenge. The work had two separate stages: autonomous navigation in a flat simulation world, and a later Mars Yard localization test for rough, uneven terrain.

## Autonomous navigation in simulation

On a flat simulated surface, I used `slam_toolbox` to build a 2D occupancy-grid map from LiDAR scans. I then saved the map for Nav2 navigation. Nav2 plans routes and controls the rover; localization is a separate part of the system. In a conventional map-based setup, AMCL uses the saved map and live laser scans to estimate the rover's pose. During mapping, SLAM Toolbox can instead provide the map and the map-to-odometry transform while Nav2 runs.

The video shows a later simulation run in the flat test world, where I used Nav2 goals to drive the rover along a route. This demonstrated the navigation stack in simulation, but did not establish autonomous operation on the rough Mars Yard terrain.

## Why localization needed another approach

Wheel encoders estimate motion by counting wheel rotation, so their estimate can drift when the wheels slip or the terrain changes how the rover moves. An IMU adds fast measurements of angular rate and acceleration, but integrating those measurements also accumulates error. An Extended Kalman Filter (EKF) predicts the rover's next state from the motion model and encoder/IMU data, then corrects that prediction when a new measurement arrives, weighting each source by its uncertainty.

In the Mars Yard simulation, uneven ground and changing rover attitude made our planar LiDAR-map matching setup less dependable. This was a limitation of our setup, rather than a claim that LiDAR localization cannot work on rough terrain. The yard's surveyed ArUco markers offered an external reference: when the camera recognized a known marker, its measured pose could correct the drifting motion estimate. Between marker observations, the filter continued predicting from wheel and IMU data.

In a follow-up manual-drive simulation, the 3D EKF fused wheel velocity, IMU measurements, and accepted surveyed-marker poses. Across a 44-second forward/reverse/turn/stop test, including an eight-second gap in marker updates, the estimated position had 3.6 cm RMS error and 5.8 cm maximum error against Gazebo ground truth. These results describe that short simulated test; they are not a field-validated accuracy guarantee. The RViz view below shows the Mars Yard scene, rover pose axes, and a visible marker detection.

![Mars Yard localization test in Gazebo and RViz, showing the rover pose axes and an ArUco marker detection](/portfolio/uploads/rover-mars-yard-localization.png)

## Operating context and next step

During remote competition tasks, the operators worked from a control station without a direct view of the rover or Mars Yard. The rover therefore had to be driven from camera and telemetry feedback. A useful pose estimate displayed against the yard map would help operators understand where the rover was and guide manual teleoperation toward a target.

I demonstrated Nav2 autonomous navigation in the flat simulation and, in later work, marker-aided localization with manual driving in the Mars Yard simulation. I did not complete an integrated autonomous-navigation system for the rough yard. Combining reliable terrain-aware localization with mapping, planning, and control remains the next step.

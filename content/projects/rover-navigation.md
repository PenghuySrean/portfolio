---
title: "European Rover Challenge"
demo: "/portfolio/uploads/rover-flat-yard-nav2.webm"
tools: "ROS 2, Nav2, slam_toolbox, robot_localization, Gazebo, RViz, LiDAR, stereo camera, ArUco"
skills: "Mobile robotics, mapping, localization, sensor fusion, navigation, simulation"
---

I led the navigation subsystem of our European Rover Challenge rover in 2023: localisation, mapping and navigation in ROS 2. We could not test on the real rover while it was being built, so I developed everything first in simulation, in Gazebo and RViz, from the rover's CAD model.

## At the competition (2023)

The rover had to work on an artificial Mars yard without GPS, and we operated it from a remote room without a direct view of it. Our navigation worked on flat ground in simulation, but on rough ground 2D LiDAR matching was not reliable, so I used wheel odometry and the IMU as the internal source, corrected by ArUco markers as the external reference, fused with an EKF. I tested this localisation and it worked. Nav2 plans on a 2D map, and turning the 3D terrain into a usable 2.5D map needed more time than we had, so we made localisation the priority and drove the rover manually. The team qualified for the finals.

## Flat test world (simulation)

I used SLAM Toolbox to make a 2D LiDAR map, then ran Nav2 in Gazebo to drive between goals. The video is from the flat test world; autonomous navigation was not working in the Mars Yard.

## After the competition (2026, simulation)

On rough ground, wheel odometry can slip and IMU errors build up. I tested a 3D EKF that predicts motion from wheel and IMU data, then corrects it when the camera sees a known ArUco marker. In a 44-second manual simulation, including 8 seconds without marker updates, position error was 3.6 cm RMS against Gazebo ground truth. This was a short simulation test, not a competition result.

![Mars Yard rover and ArUco detection in Gazebo and RViz](/portfolio/uploads/rover-mars-yard-localization.png)

I got flat-world autonomous driving and Mars Yard localisation working separately, but did not combine them.

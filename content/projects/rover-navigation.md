---
title: "European Rover Challenge"
demo: "/portfolio/uploads/rover-flat-yard-nav2.webm"
tools: "ROS 2, Nav2, slam_toolbox, robot_localization, Gazebo, RViz, LiDAR, stereo camera, ArUco"
skills: "Mobile robotics, mapping, localization, sensor fusion, navigation, simulation"
---

I worked on navigation and localization for our European Rover Challenge rover.

## Flat test world

I used SLAM Toolbox to make a 2D LiDAR map, then ran Nav2 in Gazebo to drive between goals. The video is from the flat test world; we didn’t get autonomous navigation working in the Mars Yard.

## Mars Yard localization

On rough ground, wheel odometry can slip and IMU errors build up. Our 2D LiDAR matching wasn’t reliable enough, so I tested a 3D EKF that predicts motion from wheel and IMU data, then corrects it when the camera sees a known ArUco marker.

In a 44-second manual simulation, including 8 seconds without marker updates, position error was 3.6 cm RMS against Gazebo ground truth. This was a short simulation test.

![Mars Yard rover and ArUco detection in Gazebo and RViz](/portfolio/uploads/rover-mars-yard-localization.png)

At the competition, we drove manually from a remote room without a direct view of the rover. The localization display was meant to help us see where it was and steer it remotely. I got the flat-world autonomous driving and Mars Yard localization working separately, but didn’t have time to combine them.

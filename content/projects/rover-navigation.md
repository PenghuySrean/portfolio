---
title: "European Rover Challenge"
demo: "/portfolio/uploads/rover-flat-yard-nav2.webm"
tools: "ROS 2, Nav2, SLAM Toolbox, AMCL, Gazebo, RViz, LiDAR, IMU, ArUco"
skills: "Rover kinematics, mapping, localisation, sensor fusion, autonomous navigation"
---

I worked on our ERC rover: Nav2 autonomy in a flat simulation, then localisation in the GNSS-denied Mars Yard.

## Flat world

I set up the URDF and Gazebo model. `ros2_control` drove the joints; I wrote the four-wheel-steering kinematics and encoder odometry. I teleoperated while SLAM Toolbox built a 2D LiDAR map and localised the rover from scans and odometry. SLAM does both, so mapping needed no separate localiser.

With the map saved, I configured Nav2’s planner, controller, costmaps, footprint and motion limits. AMCL matched scans to the map; SLAM Toolbox localisation was another option. My controller converted Nav2 commands to wheel and steering commands.

## Mars Yard

Wheel slip and uneven terrain made odometry drift and our 2D LiDAR matching unreliable. A 3D EKF predicted from wheel and IMU data, then corrected with known ArUco marker poses. In a 44-second test with an eight-second marker gap, position error was 3.6 cm RMS.

We drove manually from a control room without a direct view. I didn’t finish Mars Yard autonomy. Next: build a 2.5D traversability map for terrain-aware Nav2 planning.

![Mars Yard rover and ArUco detection in Gazebo and RViz](/portfolio/uploads/rover-mars-yard-localization.png)

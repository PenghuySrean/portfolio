---
title: "European Rover Challenge"
demo: "/portfolio/uploads/rover-flat-yard-nav2.webm"
tools: "ROS 2, Nav2, SLAM Toolbox, AMCL, Gazebo, RViz, LiDAR, IMU, ArUco"
skills: "Rover kinematics, mapping, localisation, sensor fusion, autonomous navigation"
---

I worked on our ERC rover: Nav2 autonomy in a flat simulation, then localisation in the GNSS-denied Mars Yard.

## Flat world

I built the URDF and Gazebo setup. `ros2_control` drove the simulated joints; I wrote the rover-specific four-wheel-steering controller and encoder odometry. Nav2 sends a body-velocity command `(vₓ, vᵧ, ω)`. For each wheel at `(xᵢ, yᵢ)`, its velocity is `vᵢ = (vₓ − ωyᵢ, vᵧ + ωxᵢ)`. I set its steering angle to `atan2(vᵢy, vᵢx)` and wheel speed to `|vᵢ| / r`. I limited steering angle, steering rate and acceleration, reduced turn commands the steering could not follow, and slowed the wheels until steering caught up. `ros2_control` applies position PID to steering joints and velocity PID to wheel joints. For odometry, I solve for the body motion that best fits all four measured wheel turns and steering angles, then integrate it over time.

I used `pointcloud_to_laserscan` to convert the 3D LiDAR data to a 2D scan. While I drove with keyboard teleop, SLAM Toolbox used scan matching and wheel odometry to build the map and estimate the rover pose together; a separate AMCL wasn’t needed during mapping. After saving the map, I configured Nav2’s NavFn planner, DWB controller with rotation shim, obstacle and inflation costmaps, rover footprint and motion limits. For saved-map localisation, `map_server` loaded the occupancy grid and AMCL estimated pose by matching scans to it. SLAM Toolbox also has a localisation-only mode that loads its saved pose graph; our Nav2 launch used AMCL with the saved 2D map.

## Mars Yard

Wheel slip and uneven terrain made odometry drift and our 2D LiDAR matching unreliable. I wrote a 3D EKF that predicts motion from wheel and IMU data, then corrects the pose when the camera sees a surveyed ArUco marker. In a 44-second simulation with an eight-second marker outage, position error was 3.6 cm RMS against Gazebo ground truth.

We drove manually from a control room without a direct view. I didn’t finish Mars Yard autonomy. Next: build a 2.5D traversability map and add terrain-aware costmap/planning support to Nav2.

![Mars Yard rover and ArUco detection in Gazebo and RViz](/portfolio/uploads/rover-mars-yard-localization.png)

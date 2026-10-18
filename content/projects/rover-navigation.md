---
title: "European Rover Challenge"
demo: "/portfolio/uploads/rover-flat-yard-nav2.webm"
tools: "ROS 2, Nav2, SLAM Toolbox, AMCL, Gazebo, RViz, LiDAR, IMU, ArUco"
skills: "Rover kinematics, mapping, localisation, sensor fusion, autonomous navigation"
---

I worked on our ERC rover. I got Nav2 driving in a flat simulation, then built a separate localisation test for the rough Mars Yard, where GNSS wasn’t allowed.

## Flat world

I set up the rover model in URDF and Gazebo. `ros2_control` drove the simulated joints; I wrote the four-wheel-steering kinematics and encoder odometry. Nav2 sends a body-velocity command `(vₓ, vᵧ, ω)`. For a wheel at `(x, y)`, I calculate its required velocity as `(vₓ − ωy, vᵧ + ωx)`. That gives the steering direction and wheel speed. I added steering and acceleration limits, and slowed the wheels while steering caught up.

I drove with keyboard teleop while SLAM Toolbox built a 2D LiDAR map and localised the rover at the same time, using wheel odometry as its motion estimate. After saving the map, I configured Nav2’s planner, controller, costmaps and rover footprint. For saved-map localisation, our setup used AMCL, which matches LiDAR scans to the map. SLAM Toolbox has a localisation-only mode too.

## Mars Yard

Wheel slip and uneven ground made odometry drift, and our 2D LiDAR matching struggled on the terrain. I wrote a 3D EKF that predicts motion from wheel and IMU data, then corrects it when the camera sees a known ArUco marker. In a 44-second simulation with an eight-second marker gap, position error was 3.6 cm RMS.

We drove manually from a control room without a direct view of the rover. I didn’t finish Mars Yard autonomy. Next, I wanted to build a 2.5D traversability map and use it for terrain-aware Nav2 planning.

![Mars Yard rover and ArUco detection in Gazebo and RViz](/portfolio/uploads/rover-mars-yard-localization.png)

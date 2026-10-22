---
title: "European Rover Challenge"
demo: ""
tools: "ROS 2, Nav2, slam_toolbox, robot_localization, Gazebo, RViz, LiDAR, stereo camera, ArUco"
skills: "Mobile robotics, mapping, localization, sensor fusion, navigation, simulation"
---

I led the navigation subsystem of our European Rover Challenge rover in 2023: localisation, mapping and navigation in ROS 2. We could not test on the real rover while it was being built, so I developed everything first in simulation, in Gazebo and RViz, from the rover's CAD model.

### Mission overview

- **Competition:** the European Rover Challenge, an international competition in which student teams build Mars rovers and operate them on an artificial Mars yard. Our team, BEARS from TU Berlin, had about 30 members.
- **Task:** drive the rover across the Mars yard to points given by the jury, ideally autonomously
- **Constraints:** no GPS, and the operators work from a remote room without a direct view of the rover
- **Rover:** an onboard computer running ROS 2, with a 3D LiDAR, a stereo camera with an IMU, and wheel odometry

### Objective

- Build a simulation of the rover and the competition field, so that the navigation software could be developed before the hardware existed
- Localise the rover on the Mars yard without GPS
- Build a map that the planner can use
- Drive the rover autonomously between goals

### Methodology

**Simulation**
- Built the rover model from the CAD design and loaded it into Gazebo and RViz, with the LiDAR, the camera, the IMU and the drive controllers through ros2_control, in a flat test world and in a Mars yard with ArUco markers at surveyed positions.

**1. Localisation**
- An extended Kalman filter fuses wheel odometry and the IMU as the internal motion estimate. The gyro bias is calibrated while the rover is parked.
- When the camera sees ArUco markers at known positions, the rover's pose is computed from them and fused as an external correction. Several visible markers are fitted together, and a fix is only used if it is close enough and consistent with the current estimate.
- In the flat world, LiDAR scan matching on the saved map is fused as an additional correction.

**2. Mapping**
- Built a 2D LiDAR map of the flat test world with SLAM Toolbox (scan matching with loop closure, 5 cm resolution), then reused it for localisation and planning.

**3. Navigation**
- **Framework:** Nav2, with its behaviour tree that replans the path regularly and runs recovery behaviours (spin, back up, wait) when the rover gets stuck.
- **Global planner:** NavFn, a grid search over the global costmap built from the saved SLAM map.
- **Local controller:** DWB samples velocity commands (up to 0.5 m/s and 1 rad/s), simulates each one 1.7 s ahead, and scores the trajectories by how well they follow the path, approach the goal and avoid obstacles. A rotation shim first turns the rover towards the path when its heading is off by more than 0.35 rad.
- **Costmaps:** a global costmap (static map, LiDAR obstacles and a 0.75 m inflation layer) and a local 5 × 5 m rolling window at 5 cm resolution. The rover's footprint is a polygon that covers the wheels over their full steering range.
- **Drive:** a four-wheel-steering node turns Nav2's velocity commands into steering angles and wheel speeds.
- **Goals:** sent from RViz. A goal counts as reached within 0.25 m and 0.1 rad.

### My contribution

- Led the navigation subsystem: localisation, mapping and navigation
- Built the rover simulation in Gazebo and RViz from the CAD model, as the platform for developing the navigation software
- Developed the localisation: wheel odometry and IMU fused in an EKF, corrected by ArUco markers
- Made the LiDAR map with SLAM Toolbox and set up Nav2 for autonomous navigation in the flat test world

Teammates helped with the simulation (rover model fixes, teleoperation and the competition field) and developed the rover's mechanical design, electronics and other subsystems.

### Results

I used SLAM Toolbox to make a 2D LiDAR map, then ran Nav2 in Gazebo to drive between goals. The video is from the flat test world; autonomous navigation was not working in the Mars Yard.

![Autonomous navigation with Nav2 in the flat test world](/portfolio/uploads/rover-flat-yard-nav2.webm)

_Autonomous navigation between goals in the flat test world._

On a recorded drive in the flat world, the fused localisation stayed within about 7 cm (RMS) and 2° of the true pose.

On rough ground, wheel odometry can slip and IMU errors build up. I tested a 3D EKF that predicts motion from wheel and IMU data, then corrects it when the camera sees a known ArUco marker. In a 44-second manual simulation, including 8 seconds without marker updates, position error was 3.6 cm RMS against Gazebo ground truth.

I got flat-world autonomous driving and Mars Yard localisation working separately, but did not combine them.

### At the competition (2023)

The rover had to work on an artificial Mars yard without GPS, and we operated it from a remote room without a direct view of it. Our navigation worked on flat ground in simulation, but on rough ground 2D LiDAR matching was not reliable, so I used wheel odometry and the IMU as the internal source, corrected by ArUco markers as the external reference, fused with an EKF. I tested this localisation and it worked. Nav2 plans on a 2D map, and turning the 3D terrain into a usable 2.5D map needed more time than we had, so we made localisation the priority and drove the rover manually. The team qualified for the finals.

![Mars Yard rover and ArUco detection in Gazebo and RViz](/portfolio/uploads/rover-mars-yard-localization.png)

### After the competition (2026, simulation)

I then worked on integrating the Mars yard into my autonomous navigation simulation, to make the rover navigate autonomously on the Mars yard. The approach combines a traversability map built from the yard's height map (slopes and steps the rover cannot cross), the ArUco-corrected localisation, and Nav2 with a controller for the rover's four-wheel steering. A demo will be added.

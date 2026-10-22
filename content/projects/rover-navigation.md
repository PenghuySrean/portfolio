---
title: "European Rover Challenge"
demo: ""
tools: "ROS 2, Nav2, slam_toolbox, robot_localization, Gazebo, RViz, LiDAR, stereo camera, ArUco"
skills: "Mobile robotics, mapping, localization, sensor fusion, navigation, simulation"
---

I led the navigation subsystem of our European Rover Challenge rover in 2023: localisation, mapping and navigation in ROS 2.

### Mission overview

- **Competition:** the European Rover Challenge, an international competition in which student teams build Mars rovers and operate them on an artificial Mars yard. Our team, BEARS from TU Berlin, had about 30 members.
- **Task:** drive the rover across the Mars yard to points given by the jury, ideally autonomously
- **Constraints:** no GPS, and the operators work from a remote room without a direct view of the rover
- **Rover:** an onboard computer running ROS 2, with a 3D LiDAR, a stereo camera with an IMU, and wheel odometry

### Objective

- Build a simulation of the rover and the competition field
- Localise the rover on the Mars yard without GPS
- Build a map that the planner can use
- Drive the rover autonomously between goals

### Methodology

**Approach**
- While the rover was being developed, a simulation model was built using the ROS 2 framework, with Gazebo as the simulation environment and RViz for visualisation, so that the navigation software could be developed and verified before deployment on the hardware.
- The rover model was derived from the CAD design and includes the LiDAR, camera and IMU sensors and the drive controllers (ros2_control). It was used in a flat test world and in a Mars yard with ArUco markers at surveyed positions.

**1. Localisation**
- An extended Kalman filter fuses wheel odometry and the IMU as the internal motion estimate. The gyro bias is calibrated while the rover is parked.
- When the camera sees ArUco markers at known positions, the rover's pose is computed from them and fused as an external correction. Several visible markers are fitted together, and a fix is only used if it is close enough and consistent with the current estimate.
- In the flat world, LiDAR scan matching on the saved map is fused as an additional correction.

**2. Mapping**
- Built a 2D LiDAR map of the flat test world with SLAM Toolbox (scan matching with loop closure, 5 cm resolution).
- To build it, I drove the rover slowly and carefully around the field by teleoperation, with the motion estimate from wheel odometry and the IMU, while SLAM Toolbox matched the LiDAR scans into the map.
- The saved map is the reference for the LiDAR scan-matching localisation and for the navigation planning.

**3. Navigation**
- **Framework:** Nav2, with its behaviour tree that replans the path regularly and runs recovery behaviours (spin, back up, wait) when the rover gets stuck.
- **Global planner:** NavFn, a grid search over the global costmap built from the saved SLAM map.
- **Local controller:** DWB samples velocity commands (up to 0.5 m/s and 1 rad/s), simulates each one 1.7 s ahead, and scores the trajectories by how well they follow the path, approach the goal and avoid obstacles. A rotation shim first turns the rover towards the path when its heading is off by more than 0.35 rad.
- **Costmaps:** a global costmap (static map, LiDAR obstacles and a 0.75 m inflation layer) and a local 5 × 5 m rolling window at 5 cm resolution. The rover's footprint is a polygon that covers the wheels over their full steering range.
- **Drive:** a four-wheel-steering node turns Nav2's velocity commands into steering angles and wheel speeds.
- **Goals:** sent from RViz. A goal counts as reached within 0.25 m and 0.1 rad.

### My contribution

- Led the navigation subsystem: localisation, mapping and navigation
- Built the rover simulation
- Developed the localisation
- Built the map and set up Nav2 for autonomous navigation

The rover's mechanical design, electronics and the other subsystems were developed by my teammates.

### Results

![Autonomous navigation with Nav2 in the flat test world](/portfolio/uploads/rover-flat-yard-nav2.webm)

_Demo: the rover plans and drives autonomously between goals with Nav2 on the SLAM map in the flat test world._

On a recorded drive in the flat world, the fused localisation stayed within about 7 cm (RMS) and 2° of the true pose.

This autonomous driving was simulated on flat ground, while the real competition field was a rough Mars yard. Because of the time limit and the technical difficulties at the time, we made a strategic change to manual operation instead of autonomous driving.

### At the competition (2023)

Since the rover was operated manually from an isolated room, good localisation was very important: it shows the rover's position on the map in RViz, so the operators can see where the rover is and drive it. I therefore put the focus on improving the localisation.

In the simulation, I loaded the Mars yard and worked on the localisation for rough ground, where 2D LiDAR matching was not reliable, using the EKF with ArUco corrections described above. In a 44-second manual drive, including 8 seconds without marker updates, the position error was 3.6 cm RMS against the Gazebo ground truth.

The team qualified for the finals.

![Mars Yard rover and ArUco detection in Gazebo and RViz](/portfolio/uploads/rover-mars-yard-localization.png)

### After the competition (2026, simulation)

After the competition, I attempted to integrate everything together to drive the rover autonomously on the Mars yard. To do this, I:

- built a traversability map from the yard's height map, marking the slopes and steps the rover cannot cross, so that Nav2 can plan on it
- used the ArUco-corrected localisation on the rough ground
- adapted Nav2 to the rover's four-wheel steering, with a controller that keeps the commanded motion within the steering limits and checks it against the rover's footprint

A demo will be added.

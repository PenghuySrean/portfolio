---
title: "TUBIN imagery user segment"
demo: ""
tools: "Python, NumPy, pandas, sgp4"
skills: "Metadata processing, Algorithm development, Image retrieval tool"
---

### What I built

In a team of four, I worked on the backend, and a teammate built the user interface. The backend works from each image's time, orbit and attitude. It traces the camera direction onto the Earth ellipsoid to find the scene centre, then computes the sun's elevation and azimuth, a day/night flag, local solar time, and the moon phase and illuminated fraction. It marks images where the attitude data is invalid or the camera looked at space, and exports the enriched metadata. A catalogue tool lets users retrieve images by these conditions.

### Result

The project was graded 1.0. The code is on the [TU Berlin GitLab](https://git.tu-berlin.de/penghuy/tubin-user-segment).

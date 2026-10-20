---
title: "APSARA-1 CubeSat project"
demo: ""
tools: ""
skills: "Mission concept definition, Orbital simulation, Orbital decay and lifetime prediction, C&DH subsystem design"
---

### The mission

APSARA-1 is Cambodia's first CubeSat, developed by the Institute of Technology of Cambodia together with the University of Tokyo. I worked on it as an intern from December 2020 to June 2021.

### What I did

I helped define the mission objective and concept, and I designed the command and data handling subsystem. For the orbit, I wrote an in-house orbital simulator to predict how long the satellite would stay in orbit.

### Orbital simulator

The satellite was planned for launch in 2024 and release from the ISS, when solar activity is near its peak. The denser upper atmosphere then shortens the orbital lifetime, so the lifetime had to be predicted for operations planning and for international space regulations.

The simulator includes gravity, the J2 perturbation and aerodynamic drag. I verified it against a publicly available orbit tool, and the predicted decay times differ by less than 8%. It predicts that the satellite stays in orbit for between 75 and 255 days, depending on solar activity and the release altitude, and about 140 days in the nominal case.

I published the work as first author: ["Development of Orbital Simulator for Cambodian CubeSat Mission in LEO"](https://www.researchgate.net/publication/360318005_Development_of_Orbital_Simulator_for_Cambodian_CubeSat_Mission_in_LEO), Techno-Science Research Journal 9(2), 2021. The simulator is modular, and I extended it later to six degrees of freedom (see ADCS development).

[Certificate of participation in the UT-ITC Cube Satellite Design Challenge, December 2020 to June 2021](/portfolio/uploads/certificates/ut-itc-cube-2021-participation.pdf)

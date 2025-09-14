"use client";
import React from "react";
import Prism from "./Prism";


const MemoPrism = React.memo(() => (
  <Prism
    animationType="3drotate"
    timeScale={0.5}
    height={2.5}
    baseWidth={4.5}
    scale={3.2}
    hueShift={220}
    colorFrequency={0.1}
    noise={0}
    glow={0.5}
  />
));

export default MemoPrism;

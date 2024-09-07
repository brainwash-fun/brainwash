"use client";

import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { darkTheme } from "@/styles/theme";

export default function NoiseEffect() {
  return (
    <Canvas
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    >
      <color attach="background" args={[darkTheme.backgroundColor]} />
      <EffectComposer>
        <Noise opacity={0.15} />
      </EffectComposer>
    </Canvas>
  );
}

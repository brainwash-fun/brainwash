"use client";

import Title from "@/components/Title";
import ProjectCard from "@/components/ProjectCard";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Noise } from "@react-three/postprocessing";

export default function Home() {
  return (
    <main className="container mx-auto px-4 w-[90%] relative">
      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <EffectComposer>
          <Noise opacity={0.5} />
        </EffectComposer>
      </Canvas>
      <Title />
      <div className="flex flex-wrap justify-center gap-10">
        <ProjectCard
          title="Stance"
          imageSrc="/stance_card.png"
          link="/stance"
        />
        <ProjectCard
          title="Temp1"
          imageSrc="https://m.media-amazon.com/images/I/81AYOKoD+yL._AC_UF894,1000_QL80_.jpg"
          link="/temp1"
        />
        <ProjectCard
          title="Temp2"
          imageSrc="https://www.shutterstock.com/image-photo/abstract-hypnotic-circle-screen-optical-600nw-2366976867.jpg"
          link="/temp2"
        />
        {/* Add more ProjectCards here as needed */}
      </div>
    </main>
  );
}

"use client";

import NoiseEffect from "@/components/NoiseEffect";
import { darkTheme } from "@/styles/theme";
import Title from "@/components/Title";
import ProjectCard from "@/components/ProjectCard";

export default function Home() {
  return (
    <div
      className="relative min-h-screen w-full"
      style={{
        backgroundColor: darkTheme.backgroundColor,
        color: darkTheme.textColor,
      }}
    >
      <NoiseEffect />
      <main className="relative z-10 container mx-auto px-4 w-[90%]">
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
    </div>
  );
}

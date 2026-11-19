import { Hero } from "@/components/sections/Hero";
import { Showreel } from "@/components/sections/Showreel";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { About } from "@/components/sections/About";
import { Timeline } from "@/components/sections/Timeline";
import { Contact } from "@/components/sections/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Showreel />
      <ProjectGrid />
      <About />
      <Timeline />
      <Contact />
    </>
  );
}

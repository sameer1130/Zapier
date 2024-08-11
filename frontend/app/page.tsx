import { Appbar } from "@/components/Appbar"
import { Hero } from "@/components/Hero";
import { HeroVideo } from "@/components/HeroVideo";
import Image from "next/image";

export default function Home() {
  return (
    <main className="pb-48">
      <Appbar />
      <Hero />
      <HeroVideo />
      
    </main>
  );
}

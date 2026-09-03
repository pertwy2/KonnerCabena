import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import Hero from "@/components/Hero/Hero";
import Nav from "@/components/Nav/Nav";
import ShowReel from "@/components/ShowReel/ShowReel";
// import Testimonials from "@/components/Testimonials/Testimonials";
import VoiceReels from "@/components/VoiceReels/VoiceReels";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <VoiceReels />
        <About />
        <ShowReel />
        {/* <Testimonials /> */}
        <Contact />
      </main>
    </>
  );
}

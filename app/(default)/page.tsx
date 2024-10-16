// export const metadata = {
//   title: "Home - Open PRO",
//   description: "Page description",
// };

// import PageIllustration from "@/components/page-illustration";
// import Hero from "@/components/hero-home";
// import Workflows from "@/components/workflows";
// import Features from "@/components/features";
// import Testimonials from "@/components/testimonials";
// import Cta from "@/components/cta";

// export default function Home() {
//   return (
//     <>
//       <PageIllustration />
//       <Hero />
//       <Workflows />
//       <Features />
//       <Testimonials />
//       <Cta />
//     </>
//   );
// }

export const metadata = {
  title: "Resale Price Lookup",
  description: "Lookup resale prices easily using our tool.",
};

// Import only the HeroHome component
import HeroHome from "@/components/hero-home";

export default function Home() {
  return (
    <>
      <HeroHome />
    </>
  );
}

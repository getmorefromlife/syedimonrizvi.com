import { useEffect } from "react";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";

const AboutPage = () => {
  useEffect(() => {
    document.title = "About — Syed Imon Rizvi | PMP, Agile Coach & SAP Consultant";
  }, []);

  return (
    <>
      <AboutSection />
      <ServicesSection />
    </>
  );
};

export default AboutPage;

import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";

const HomePage = () => {
  useEffect(() => {
    document.title = "Syed Imon Rizvi — PMP, Agile Coach, Author & Creator of the Aligile Ethos";
  }, []);

  return <HeroSection />;
};

export default HomePage;

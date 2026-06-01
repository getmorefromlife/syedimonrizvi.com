import { useEffect } from "react";
import AligileSection from "@/components/AligileSection";

const AligilePage = () => {
  useEffect(() => {
    document.title = "The Aligile Ethos — Agility with Wisdom, Justice & Integrity | Syed Imon Rizvi";
  }, []);

  return <AligileSection />;
};

export default AligilePage;

import { useEffect } from "react";
import StudioSection from "@/components/StudioSection";

const StudioPage = () => {
  useEffect(() => {
    document.title = "Audio Studio — Syed Imon Rizvi | Music & Nasheed";
  }, []);

  return <StudioSection />;
};

export default StudioPage;

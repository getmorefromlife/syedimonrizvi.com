import { useEffect } from "react";
import PortfolioSection from "@/components/PortfolioSection";

const PortfolioPage = () => {
  useEffect(() => {
    document.title = "Portfolio — Syed Imon Rizvi | Creative & Design Works";
  }, []);

  return <PortfolioSection />;
};

export default PortfolioPage;

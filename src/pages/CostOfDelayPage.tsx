import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CostOfDelayCalculator from "@/tools/CostOfDelayCalculator";

const CostOfDelayPage = () => (
  <>
    <Navbar />
    <CostOfDelayCalculator />
    <Footer />
  </>
);

export default CostOfDelayPage;

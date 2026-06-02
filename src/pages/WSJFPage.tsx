import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WSJFCalculator from "@/tools/WSJFCalculator";

const WSJFPage = () => (
  <>
    <Navbar />
    <WSJFCalculator />
    <Footer />
  </>
);

export default WSJFPage;

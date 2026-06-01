import { useEffect } from "react";
import ContactSection from "@/components/ContactSection";

const ContactPage = () => {
  useEffect(() => {
    document.title = "Contact — Syed Imon Rizvi";
  }, []);

  return <ContactSection />;
};

export default ContactPage;

import { useEffect } from "react";
import BooksSection from "@/components/BooksSection";

const BooksPage = () => {
  useEffect(() => {
    document.title = "Books — Syed Imon Rizvi | Author & KDP Publisher";
  }, []);

  return <BooksSection />;
};

export default BooksPage;

import React from "react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import WebContentReader from "../components/web-reader/WebContentReader";

/**
 * Props accepted by {@link LayoutMARATON}.
 */
interface LayoutMARATONProps {
  /**
   * The page content to render between the shared Navbar and Footer.
   */
  children: React.ReactNode;
}

/**
 * Shared application layout that renders a global navigation bar at the top,
 * the current page content in a `<main>` region, and a footer at the bottom.
 *
 * @component
 * @param {LayoutMARATON} props - Component properties.
 * @param {React.ReactNode} props.children - Page content to render.
 * @returns {JSX.Element} The layout wrapper for app pages.
 */
const LayoutMARATON: React.FC<LayoutMARATONProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className="container-page">{children}</main>
      <Footer />
      <WebContentReader />
    </>
  );
};

export default LayoutMARATON;

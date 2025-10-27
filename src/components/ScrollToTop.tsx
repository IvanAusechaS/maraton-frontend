import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component
 * Scrolls to top of the page on route change
 * Excludes home and about pages
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Don't scroll to top on home and about pages
    if (pathname === "/" || pathname === "/sobre-nosotros") {
      return;
    }

    // Scroll to top smoothly for other pages
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use instant for immediate scroll
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;

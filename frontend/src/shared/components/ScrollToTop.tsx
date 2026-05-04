import { scrollToTop } from "@shared/utils/scrollUtils";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn lên top mỗi khi pathname thay đổi
    scrollToTop();
  }, [pathname]);

  return null; // Không render gì
};

export default ScrollToTop;



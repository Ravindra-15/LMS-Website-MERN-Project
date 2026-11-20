import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

// Floating "back to top" button that appears after scrolling down a bit.
const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 h-11 w-11 rounded-full flex items-center justify-center
        bg-blue-600 text-white shadow-lg hover:bg-blue-700
        dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200
        transition-all duration-300 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default ScrollToTopButton;

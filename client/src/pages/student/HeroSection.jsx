import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Search, Rocket, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [animatedText, setAnimatedText] = useState("You");
  const navigate = useNavigate();

  // Typing animation effect
  useEffect(() => {
    const words = ["You", "You"];
    let currentWordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const currentWord = words[currentWordIndex];

      if (isDeleting) {
        setAnimatedText(currentWord.substring(0, charIndex - 1));
        charIndex--;
        typingSpeed = 100;
      } else {
        setAnimatedText(currentWord.substring(0, charIndex + 1));
        charIndex++;
        typingSpeed = 150;
      }

      if (!isDeleting && charIndex === currentWord.length) {
        typingSpeed = 2000; // Pause at end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % words.length;
        typingSpeed = 500;
      }

      timer = setTimeout(type, typingSpeed);
    };

    // Keep the latest timeout id so the whole loop stops on unmount
    let timer = setTimeout(type, 1000); // Start after 1 second
    return () => clearTimeout(timer);
  }, []);

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 px-4 text-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full filter blur-3xl -translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full filter blur-3xl translate-x-1/4 translate-y-1/4"></div>
      </div>

      <motion.div
        className="max-w-4xl mx-auto relative z-10 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Rocket Icon with animation */}
        <div className="w-16 h-16 mx-auto rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-lg animate-bounce">
          <Rocket className="text-blue-600 dark:text-white" size={28} />
        </div>

        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight"
          variants={itemVariants}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-200">
            Find
          </span>{" "}
          the Best Courses for{" "}
          <span className="relative inline-block">
            <span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400 rounded-full"></span>
            <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-200">
              {animatedText}
            </span>
            <span className="animate-pulse">|</span> {/* Cursor effect */}
          </span>
        </motion.h1>

        <motion.p
          className="text-gray-200/90 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Discover, learn and upskill with our wide range of curated courses.
        </motion.p>

        {/* Enhanced Search bar */}
        <motion.form
          onSubmit={searchHandler}
          className="flex items-center max-w-2xl mx-auto bg-white/10 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div
            className={`pl-5 pr-3 py-3 text-white transition-all duration-300 ${
              isSearchFocused ? "scale-110" : ""
            }`}
            title="Search"
          >
            <Search size={24} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholder="Search courses..."
            className="flex-grow px-4 py-4 text-white placeholder-white/70 bg-transparent focus:outline-none focus:ring-0 text-lg"
          />
          <button
            type="submit"
            className="px-6 py-[22px] bg-white/20 hover:bg-white/30 text-white font-medium transition-all duration-300 flex items-center gap-2"
          >
            <ArrowRight size={18} />
          </button>
        </motion.form>

        {/* Enhanced Explore Button */}
        <motion.div variants={itemVariants}>
          <Button
            onClick={() => navigate(`/course/search?query`)}
            className="mt-6 px-8 py-4 bg-white !text-blue-800 hover:bg-transparent hover:!text-white hover:shadow-lg
              dark:bg-white dark:hover:bg-transparent dark:text-gray-900 dark:hover:text-white
              rounded-full transition-all duration-300 flex items-center gap-3 text-lg font-semibold
              border-2 border-transparent hover:border-white relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative z-10 flex items-center gap-2">
              <BookOpen size={20} className="group-hover:animate-pulse" />
              Explore All Courses
            </span>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

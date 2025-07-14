import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };
  return (
    <div className="relative bg-gradient-to-r from-blue-500 to bg-indigo-600 dark:from-gray-800 dark:to-gray-900 py-24 px-4 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-white text-4xl font-bold mb-4 ">
          Find the Best Courses for You
        </h1>
        <p className="text-gray-200 dark:text-gray-400 mb-8">
          Discover, Learn and Upskill with our wide range of courses
        </p>
        <form
          onSubmit={searchHandler}
          className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-lg overflow-hidden max-w-xl mx-auto mb-6"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="flex-grow border-none focus-visible:ring-0 focus:outline-none px-6 py-3
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-300
    bg-white dark:bg-gray-800"
          />

          <Button
            type="submit"
            className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-4 h-full !rounded-none hover:bg-blue-700 dark:hover:bg-blue-800 focus:outline-none focus-visible:ring-0"
          >
            Search
          </Button>
        </form>
        <Button
          onClick={() => navigate(`/course/search?query`)}
          className="!bg-white !text-blue-800 hover:!bg-gray-800 hover:!text-white 
    dark:!bg-gray-800 dark:!text-white dark:hover:!bg-gray-700
    !rounded-full px-6 py-2 transition-colors duration-200"
        >
          Explore Courses
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;

// Single source of truth for course categories and levels.
// The admin forms save these exact strings, and the search filter sends them
// back to the server, so they must stay in sync — always import from here.

export const COURSE_CATEGORIES = [
  "Next JS",
  "Data Science",
  "Frontend Development",
  "Backend Development",
  "Fullstack Development",
  "MERN Stack Development",
  "Javascript",
  "Python",
  "Docker",
  "MongoDB",
  "HTML",
];

export const COURSE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const PRICE_OPTIONS = [
  { value: "", label: "All prices" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "popular", label: "Most popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "title", label: "Title: A to Z" },
];

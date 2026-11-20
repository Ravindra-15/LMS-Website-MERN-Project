import { useEffect, useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { SORT_OPTIONS } from "@/lib/courseOptions";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, Search, SlidersHorizontal, X } from "lucide-react";

const splitList = (value) => (value ? value.split(",").filter(Boolean) : []);

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false); // mobile only

  // All filter state is read from the URL so it survives refresh / back / sharing
  const filters = {
    query: searchParams.get("query") || "",
    categories: splitList(searchParams.get("categories")),
    levels: splitList(searchParams.get("levels")),
    price: searchParams.get("price") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "newest",
  };

  const [searchInput, setSearchInput] = useState(filters.query);
  useEffect(() => setSearchInput(filters.query), [filters.query]);

  const { data, isFetching, isError } = useGetSearchCourseQuery({
    searchQuery: filters.query,
    categories: filters.categories,
    levels: filters.levels,
    price: filters.price,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sortBy: filters.sortBy,
  });

  const courses = data?.courses ?? [];

  const updateFilters = (patch) => {
    const next = { ...filters, ...patch };
    const params = new URLSearchParams();
    params.set("query", next.query);
    if (next.categories.length) params.set("categories", next.categories.join(","));
    if (next.levels.length) params.set("levels", next.levels.join(","));
    if (next.price) params.set("price", next.price);
    if (next.minPrice !== "") params.set("minPrice", next.minPrice);
    if (next.maxPrice !== "") params.set("maxPrice", next.maxPrice);
    if (next.sortBy && next.sortBy !== "newest") params.set("sortBy", next.sortBy);
    // replace + preventScrollReset: toggling a filter shouldn't jump the page
    setSearchParams(params, { replace: true, preventScrollReset: true });
  };

  const clearFilters = () =>
    updateFilters({ categories: [], levels: [], price: "", minPrice: "", maxPrice: "" });

  // Chips for every active filter, each removable on its own
  const chips = [
    ...filters.categories.map((c) => ({
      label: c,
      remove: () => updateFilters({ categories: filters.categories.filter((x) => x !== c) }),
    })),
    ...filters.levels.map((l) => ({
      label: l,
      remove: () => updateFilters({ levels: filters.levels.filter((x) => x !== l) }),
    })),
    ...(filters.price
      ? [{ label: filters.price === "free" ? "Free" : "Paid", remove: () => updateFilters({ price: "" }) }]
      : []),
    ...(filters.minPrice !== "" || filters.maxPrice !== ""
      ? [
          {
            label: `₹${filters.minPrice || 0} – ${filters.maxPrice ? `₹${filters.maxPrice}` : "any"}`,
            remove: () => updateFilters({ minPrice: "", maxPrice: "" }),
          },
        ]
      : []),
  ];

  const submitSearch = (e) => {
    e.preventDefault();
    updateFilters({ query: searchInput.trim() });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 pb-16">
      {/* Heading + search box */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="font-bold text-2xl md:text-3xl">
            {filters.query ? (
              <>
                Results for{" "}
                <span className="text-blue-600 dark:text-blue-400">
                  &ldquo;{filters.query}&rdquo;
                </span>
              </>
            ) : (
              "All courses"
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isFetching
              ? "Searching..."
              : `${courses.length} course${courses.length === 1 ? "" : "s"} found`}
          </p>
        </div>

        <form onSubmit={submitSearch} className="flex gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by title, subtitle or category..."
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters: always visible on desktop, toggled on mobile */}
        <div className="md:w-64 md:shrink-0">
          <Button
            variant="outline"
            className="md:hidden w-full mb-4 justify-center gap-2"
            onClick={() => setShowFilters((v) => !v)}
          >
            <SlidersHorizontal size={16} />
            {showFilters ? "Hide filters" : "Show filters"}
            {chips.length > 0 && ` (${chips.length})`}
          </Button>
          <div
            className={`${showFilters ? "block" : "hidden"} md:block md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto md:pr-2`}
          >
            <Filter
              filters={filters}
              onChange={updateFilters}
              onClear={clearFilters}
              activeCount={chips.length}
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={chip.remove}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium hover:bg-accent transition-colors"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  {chip.label}
                  <X size={12} />
                </button>
              ))}
            </div>

            <Select
              value={filters.sortBy}
              onValueChange={(value) => updateFilters({ sortBy: value })}
            >
              <SelectTrigger className="w-[190px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isFetching ? (
            Array.from({ length: 3 }).map((_, idx) => <CourseSkeleton key={idx} />)
          ) : isError ? (
            <EmptyState
              title="Something went wrong"
              text="We couldn't load courses right now. Please try again."
            />
          ) : courses.length === 0 ? (
            <EmptyState
              title="No courses found"
              text={
                chips.length > 0
                  ? "Try removing some filters or searching for something else."
                  : "Try a different search term."
              }
              action={
                chips.length > 0 || filters.query ? (
                  <Button
                    variant="outline"
                    onClick={() =>
                      updateFilters({
                        query: "",
                        categories: [],
                        levels: [],
                        price: "",
                        minPrice: "",
                        maxPrice: "",
                      })
                    }
                  >
                    Show all courses
                  </Button>
                ) : null
              }
            />
          ) : (
            courses.map((course) => <SearchResult key={course._id} course={course} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const EmptyState = ({ title, text, action }) => (
  <div className="flex flex-col items-center justify-center text-center rounded-lg bg-muted/40 border border-border mt-6 p-10">
    <AlertCircle className="text-red-500 h-14 w-14 mb-4" />
    <h2 className="font-bold text-2xl md:text-3xl mb-2">{title}</h2>
    <p className="text-muted-foreground mb-6">{text}</p>
    {action}
  </div>
);

const CourseSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-4 border-b border-border py-4">
    <Skeleton className="h-40 w-full md:w-56" />
    <div className="flex flex-col gap-2 flex-1">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-20 mt-2" />
    </div>
  </div>
);

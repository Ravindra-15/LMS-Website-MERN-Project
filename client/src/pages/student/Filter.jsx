import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  COURSE_CATEGORIES,
  COURSE_LEVELS,
  PRICE_OPTIONS,
} from "@/lib/courseOptions";
import { useEffect, useState } from "react";

// Turns "Data Science" into a safe DOM id like "cat-data-science"
const toId = (prefix, text) =>
  `${prefix}-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

const FilterSection = ({ title, children }) => (
  <div className="space-y-3">
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </h3>
    {children}
  </div>
);

const CheckboxRow = ({ id, label, checked, onChange }) => (
  <div className="flex items-center gap-2">
    <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
    <Label htmlFor={id} className="text-sm font-normal cursor-pointer">
      {label}
    </Label>
  </div>
);

/**
 * Controlled filter panel. All state lives in the parent (and the URL);
 * this component only renders it and reports changes via onChange(patch).
 */
const Filter = ({ filters, onChange, onClear, activeCount }) => {
  const { categories, levels, price, minPrice, maxPrice } = filters;

  // Price range is typed locally and applied on "Apply"/Enter
  const [range, setRange] = useState({ min: minPrice, max: maxPrice });
  useEffect(() => {
    setRange({ min: minPrice, max: maxPrice });
  }, [minPrice, maxPrice]);

  const toggle = (list, value) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const applyRange = (e) => {
    e.preventDefault();
    let { min, max } = range;
    // Swap if the user typed them the wrong way round
    if (min !== "" && max !== "" && Number(min) > Number(max)) [min, max] = [max, min];
    onChange({ minPrice: min, maxPrice: max, price: price === "free" ? "" : price });
  };

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 inline-flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-blue-600 text-white text-xs">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <Button variant="link" size="sm" className="h-auto p-0" onClick={onClear}>
            Clear all
          </Button>
        )}
      </div>

      <Separator />

      <FilterSection title="Category">
        {COURSE_CATEGORIES.map((category) => (
          <CheckboxRow
            key={category}
            id={toId("cat", category)}
            label={category}
            checked={categories.includes(category)}
            onChange={() => onChange({ categories: toggle(categories, category) })}
          />
        ))}
      </FilterSection>

      <Separator />

      <FilterSection title="Level">
        {COURSE_LEVELS.map((level) => (
          <CheckboxRow
            key={level}
            id={toId("level", level)}
            label={level}
            checked={levels.includes(level)}
            onChange={() => onChange({ levels: toggle(levels, level) })}
          />
        ))}
      </FilterSection>

      <Separator />

      <FilterSection title="Price">
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.value || "all"}
              type="button"
              onClick={() =>
                onChange(
                  opt.value === "free"
                    ? { price: "free", minPrice: "", maxPrice: "" }
                    : { price: opt.value }
                )
              }
              className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
                price === opt.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.value === "" ? "All" : opt.label}
            </button>
          ))}
        </div>

        <form onSubmit={applyRange} className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Min ₹"
              aria-label="Minimum price"
              value={range.min}
              disabled={price === "free"}
              onChange={(e) => setRange({ ...range, min: e.target.value })}
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Max ₹"
              aria-label="Maximum price"
              value={range.max}
              disabled={price === "free"}
              onChange={(e) => setRange({ ...range, max: e.target.value })}
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full"
            disabled={price === "free"}
          >
            Apply price range
          </Button>
        </form>
      </FilterSection>
    </aside>
  );
};

export default Filter;

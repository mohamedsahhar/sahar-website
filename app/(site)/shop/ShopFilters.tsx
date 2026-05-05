"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";

type BrandOption = {
  id: number;
  name: string;
  slug: string;
};

type CategoryOption = {
  id: number;
  name: string;
  slug: string;
  subcategories: {
    id: number;
    name: string;
    slug: string;
    categoryId: number;
  }[];
};

type FilterValues = {
  q: string;
  brand: string;
  category: string;
  subcategory: string;
};

export default function ShopFilters({
  brands,
  categories,
  basePath,
  lockedCategory,
  lockedSubcategory,
  currentFilters,
}: {
  brands: BrandOption[];
  categories: CategoryOption[];
  basePath: string;
  lockedCategory?: string;
  lockedSubcategory?: string;
  currentFilters: FilterValues;
}) {
  const router = useRouter();
  const [filters, setFilters] = useState(currentFilters);

  const availableSubcategories = useMemo(() => {
    if (!filters.category) {
      return categories.flatMap((category) => category.subcategories);
    }

    const selectedCategory = categories.find(
      (category) => category.slug === filters.category
    );

    return selectedCategory?.subcategories || [];
  }, [categories, filters.category]);

  function setFilter(key: keyof FilterValues, value: string) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      ...(key === "category" ? { subcategory: "" } : {}),
    }));
  }

  function applyFilters(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (key === "category" && lockedCategory) return;
      if (key === "subcategory" && lockedSubcategory) return;

      const cleanValue = value.trim();
      if (cleanValue) params.set(key, cleanValue);
    });

    const queryString = params.toString();
    router.push(queryString ? `${basePath}?${queryString}` : basePath);
  }

  return (
    <form
      onSubmit={applyFilters}
      className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-2 text-gray-950">
        <SlidersHorizontal size={18} aria-hidden="true" />
        <p className="font-semibold">Filters</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-3">
        <label className="relative block">
          <span className="sr-only">Search products</span>
          <Search
            size={17}
            aria-hidden="true"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={filters.q}
            onChange={(event) => setFilter("q", event.target.value)}
            placeholder="Search products"
            className="h-11 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-950 outline-none transition focus:border-gray-900"
          />
        </label>

        <label>
          <span className="sr-only">Brand</span>
          <select
            value={filters.brand}
            onChange={(event) => setFilter("brand", event.target.value)}
            className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-gray-900"
          >
            <option value="">All brands</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.slug}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>

        {!lockedCategory && (
          <label>
            <span className="sr-only">Category</span>
            <select
              value={filters.category}
              onChange={(event) => setFilter("category", event.target.value)}
              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-gray-900"
            >
              <option value="">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {!lockedSubcategory && (
          <label>
            <span className="sr-only">Subcategory</span>
            <select
              value={filters.subcategory}
              onChange={(event) => setFilter("subcategory", event.target.value)}
              className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-gray-900"
            >
              <option value="">All subcategories</option>
              {availableSubcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.slug}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-gray-950 px-4 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          <Search size={16} aria-hidden="true" />
          Apply
        </button>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { Menu, Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

type Props = {
  categories: string[];
  searchParams: Record<string, string | string[] | undefined>;
};

export function SearchFilters({ categories, searchParams }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const activeFilters = ["query", "category", "condition", "maxPrice"].filter((key) => {
    const value = searchParams[key];
    return typeof value === "string" && value !== "" && value !== "all";
  }).length;

  return (
    <div className="relative">
      <button
        className="inline-flex h-11 items-center gap-2 rounded-lg bg-[var(--brown)] px-4 text-sm font-bold text-white shadow-sm"
        type="button"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
        Filters
        {activeFilters > 0 && (
          <span className="rounded-full bg-[var(--gold)] px-2 py-0.5 text-xs">{activeFilters}</span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-3 md:absolute md:inset-auto md:right-0 md:top-12 md:w-[720px] md:bg-transparent md:p-0">
          <button className="absolute inset-0 cursor-default md:hidden" type="button" onClick={() => setIsOpen(false)} />
          <form
            className="market-shadow absolute inset-x-3 bottom-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 md:static md:rounded-lg"
            action="/books"
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--gold)] text-white">
                  <SlidersHorizontal className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-black text-[var(--brown)]">Refine books</p>
                  <p className="text-xs text-muted">Filter without leaving the shopping grid</p>
                </div>
              </div>
              <button className="rounded-lg border border-[var(--border)] p-2" type="button" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-1 block text-xs font-bold uppercase text-[var(--brown)]">Search</span>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    name="query"
                    defaultValue={String(searchParams.query ?? "")}
                    className="field pl-10"
                    placeholder="Title, author, category"
                  />
                </div>
              </label>
              <label>
                <span className="mb-1 block text-xs font-bold uppercase text-[var(--brown)]">Category</span>
                <select name="category" className="field" defaultValue={String(searchParams.category ?? "all")}>
                  <option value="all">All categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-1 block text-xs font-bold uppercase text-[var(--brown)]">Condition</span>
                <select name="condition" className="field" defaultValue={String(searchParams.condition ?? "all")}>
                  <option value="all">Any condition</option>
                  <option value="like_new">Like new</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="acceptable">Acceptable</option>
                  <option value="new">New</option>
                </select>
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-xs font-bold uppercase text-[var(--brown)]">Max price</span>
                <input name="maxPrice" type="number" className="field" defaultValue={String(searchParams.maxPrice ?? "")} />
              </label>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="btn-primary flex-1" type="submit">Apply filters</button>
              <Link className="btn-secondary flex-1" href="/books">Reset</Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

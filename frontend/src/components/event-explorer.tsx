"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EventItem } from "../lib/api/types";
import { EventCard } from "./event-card";

export function EventExplorer({
  events,
  city,
  category,
  date,
}: {
  events: EventItem[];
  city: string;
  category: string;
  date: string;
}) {
  const router = useRouter();
  const [cityValue, setCity] = useState(city);
  const [categoryValue, setCategory] = useState(category);
  const [dateValue, setDate] = useState(date);
  const hasFilter = Boolean(city || category || date);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (cityValue) params.set("city", cityValue);
    if (categoryValue) params.set("category", categoryValue);
    if (dateValue) params.set("date", dateValue);
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  return (
    <div>
      <form onSubmit={onSubmit}
        className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-3">

        <label className="grid gap-1 text-sm text-stone-700">
          Cidade
          <input
            value={cityValue}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Recife"
            className="rounded-xl border border-stone-300 px-3 py-2 text-stone-950"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Categoria
          <input
            value={categoryValue}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Música"
            className="rounded-xl border border-stone-300 px-3 py-2 text-stone-950"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Data
          <input
            type="date"
            value={dateValue}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-xl border border-stone-300 px-3 py-2 text-stone-950"
          />
        </label>
        <button
          type="submit"
          className="w-fit rounded-full bg-stone-900 px-4 py-2 text-sm text-stone-50 cursor-pointer"
        >
          Filtrar
        </button>
      </form>

      {events.length === 0 ? (
        <p className="mt-8 text-stone-600">
          {hasFilter ? "Nenhum evento com esses filtros." : "Ainda não há eventos."}
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

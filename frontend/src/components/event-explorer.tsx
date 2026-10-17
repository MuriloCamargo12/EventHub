"use client";

import { useState } from "react";
import type { EventItem } from "../lib/api/types";
import { EventCard } from "./event-card";
import { getEvents } from "@/lib/api/events";

export function EventExplorer({ initialEvents }: { initialEvents: EventItem[] }) {
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState(initialEvents);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = await getEvents({ city, category, date });
    setEvents(data);
  }

  return (
    <div>
      <form onSubmit={onSubmit}
        className="grid gap-3 rounded-2xl border border-stone-200 bg-white p-4 sm:grid-cols-3">

        <label className="grid gap-1 text-sm text-stone-700">
          Cidade
          <input
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Recife"
            className="rounded-xl border border-stone-300 px-3 py-2 text-stone-950"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Categoria
          <input
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            placeholder="Música"
            className="rounded-xl border border-stone-300 px-3 py-2 text-stone-950"
          />
        </label>
        <label className="grid gap-1 text-sm text-stone-700">
          Data
          <input
            type="date"
            value={date}
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
        <p className="mt-8 text-stone-600">Nenhum evento com esses filtros.</p>
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

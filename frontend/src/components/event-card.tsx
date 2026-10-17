import Link from "next/link";
import { formatDate, type EventItem } from "../lib/api/types";

export function EventCard({ event }: { event: EventItem }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3 text-xs font-medium uppercase tracking-wide text-stone-500">
        <span>{event.category}</span>
        {event.soldOut ? (
          <span className="rounded-full bg-stone-900 px-2 py-1 text-stone-50">Esgotado</span>
        ) : (
          <span>
            {event.reservedCount}/{event.capacity}
          </span>
        )}
      </div>
      <h2 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">
        <Link href={`/events/${event.id}`} className="hover:underline">
          {event.title}
        </Link>
      </h2>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-stone-600">{event.description}</p>
      <p className="mt-4 text-sm text-stone-800">{formatDate(event.date)}</p>
      <p className="text-sm text-stone-500">
        {event.location} · {event.city}
      </p>
    </article>
  );
}

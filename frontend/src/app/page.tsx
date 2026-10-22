import { EventExplorer } from "../components/event-explorer";
import { getEvents } from "@/lib/api/events";

type HomeProps = {
  searchParams: Promise<{ city?: string; category?: string; date?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const city = params.city ?? "";
  const category = params.category ?? "";
  const date = params.date ?? "";
  const events = await getEvents({ city, category, date });

  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-stone-500">EventHub</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-950">
        O que está rolando
      </h1>
      <p className="mt-3 max-w-xl text-stone-600">
        Encontre um evento por cidade, categoria ou data.
      </p>
      <div className="mt-8">
        <EventExplorer
          key={`${city}-${category}-${date}`}
          events={events}
          city={city}
          category={category}
          date={date}
        />
      </div>
    </div>
  );
}

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { formatDate } from "../../../lib/api/types";
import { ApiError } from "@/lib/api/client";
import { GetEventsId } from "@/lib/api/events";
import { getMe } from "@/lib/api/users";
import Link from "next/link";
import { ReserveButton } from "@/components/reserve-button";

type EventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  const event = await GetEventsId(Number(id));
  if (!event) {
    notFound();
  }

  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;

  let user = null
  if (session) {
    try {
      user = await getMe(session);
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401) {
        throw error;
      }
    }
  }

  const isOrganizer = user?.id === event.organizerId;

  return (
    <article className="max-w-2xl">
      <Link href="/" className="text-sm text-stone-500 hover:text-stone-800">
        Voltar para os eventos
      </Link>
      <p className="mt-6 text-sm font-medium uppercase tracking-wide text-stone-500">
        {event.category}
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight text-stone-950">{event.title}</h1>
      <p className="mt-4 text-stone-700">{formatDate(event.date)}</p>
      <p className="text-stone-500">
        {event.location} · {event.city}
      </p>
      <p className="mt-6 leading-7 text-stone-700">{event.description}</p>
      <p className="mt-6 text-sm text-stone-700">
        {event.reservedCount} de {event.capacity} lugares ocupados
        {event.soldOut ? " · Esgotado" : ""}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">

        <ReserveButton eventId={event.id} soldOut={event.soldOut} isLoggedIn={Boolean(user)} />

        {isOrganizer ? (
          <>
            <Link
              href={`/events/${event.id}/edit`}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm hover:bg-white"
            >
              Editar
            </Link>
            <Link
              href={`/events/${event.id}/participants`}
              className="rounded-full border border-stone-300 px-4 py-2 text-sm hover:bg-white"
            >
              Participantes
            </Link>
          </>
        ) : null}
      </div>
    </article>
  );
}

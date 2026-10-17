import Link from "next/link";
import { formatDate } from "../../lib/api/types";
import { getMyReservations } from "@/lib/api/reservations";
import { CancelReservationButton } from "@/components/cancel-reservation-button";
import { requireUser } from "@/lib/require-user";

const statusLabel = {
  reserved: "Reservado",
  cancelled: "Cancelado",
};

export default async function ReservationsPage() {
  const { session } = await requireUser();
  const reservations = await getMyReservations(session);
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Minhas reservas</h1>
      <p className="mt-2 text-stone-600">Histórico das suas reservas.</p>
      <ul className="mt-8 grid gap-4">
        {reservations.map((reservation) => (
          <li key={reservation.id} className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold tracking-tight">
                <Link href={`/events/${reservation.event.id}`} className="hover:underline">
                  {reservation.event.title}
                </Link>
              </h2>
              <span className="rounded-full bg-stone-200 px-3 py-1 text-sm text-stone-800">
                {statusLabel[reservation.status]}
              </span>
            </div>
            <p className="mt-2 text-sm text-stone-700">{formatDate(reservation.event.date)}</p>
            <p className="text-sm text-stone-500">
              {reservation.event.location} · {reservation.event.city}
            </p>
            <p className="mt-3 text-sm text-stone-500">
              Reserva feita em {formatDate(reservation.createdAt)}
            </p>
              {reservation.status === "reserved" ? (
                <CancelReservationButton reservationId={reservation.id} />
              ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

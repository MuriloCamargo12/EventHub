import type { ReservationItem } from "@/lib/api/types";
import { api } from "./client";

export async function createReservation(eventId: number) {
    return api(`/reservations`, {
        method: 'POST',
        body: JSON.stringify({ eventId }),
    })
}

export async function getMyReservations(session: string) {
    return api(`/reservations`, {
        headers: { cookie: `session=${session}` },
    }) as Promise<ReservationItem[]>
}

export async function markAttendance(id: number) {
    return api(`/reservations/${id}/attendance`, {
        method: 'PATCH',
    }) as Promise<ReservationItem>
}

export async function cancelReservation(id: number) {
    return api(`/reservations/${id}`, {
        method: 'PATCH',
    }) as Promise<ReservationItem>
}
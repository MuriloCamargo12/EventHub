"use client";

import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { createReservation } from "@/lib/api/reservations";
import { useNotice } from "@/lib/use-notice";
import { CancelReservationButton } from "./cancel-reservation-button";

const buttonClass =
    "rounded-full bg-stone-900 px-4 py-2 text-sm text-stone-50 disabled:cursor-not-allowed disabled:bg-stone-300";

export function ReserveButton({
    eventId,
    soldOut,
    isLoggedIn,
    ended,
    reservationId,
}: {
    eventId: number;
    soldOut: boolean;
    isLoggedIn: boolean;
    ended: boolean;
    reservationId?: number;
}) {
    const router = useRouter();
    const { notice, showError } = useNotice();

    if (reservationId) {
        return (
            <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm text-stone-700">Você reservou</p>
                <CancelReservationButton reservationId={reservationId} className="" />
            </div>
        );
    }

    if (ended) {
        return (
            <button type="button" disabled className={buttonClass}>
                Encerrado
            </button>
        );
    }

    async function onReserve() {
        if (!isLoggedIn) {
            router.push("/cadastro");
            return;
        }

        try {
            await createReservation(eventId);
            router.refresh();
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                router.push("/cadastro");
                return;
            }
            if (error instanceof ApiError && error.status === 409 && error.message === "Você já reservou este evento!") {
                router.refresh();
                return;
            }
            showError("Erro ao fazer reserva");
        }
    }

    return (
        <>
            <button type="button" onClick={onReserve} disabled={soldOut} className={buttonClass}>
                {soldOut ? "Esgotado" : "Reservar"}
            </button>
            {notice ? <p className="text-sm text-stone-600">{notice}</p> : null}
        </>
    );
}

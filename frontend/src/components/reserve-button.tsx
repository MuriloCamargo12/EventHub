"use client";

import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { createReservation } from "@/lib/api/reservations";
import { useNotice } from "@/lib/use-notice";

export function ReserveButton({
    eventId,
    soldOut,
    isLoggedIn,
}: {
    eventId: number;
    soldOut: boolean;
    isLoggedIn: boolean;
}) {
    const router = useRouter();
    const { notice, showNotice, showError } = useNotice();

    async function onReserve() {
        if (!isLoggedIn) {
            router.push("/cadastro");
            return;
        }

        try {
            await createReservation(eventId);
            showNotice("Reserva feita com sucesso!")
        } catch (error) {
            if (error instanceof ApiError && error.status === 401) {
                router.push("/cadastro");
                return;
            }
            if (error instanceof ApiError && error.status === 409 && error.message === "Você já reservou este evento!") {
                showError("Você já reservou este evento.");
                return;
            }
            showError("Erro ao fazer reserva")
        }
    }

    return (
        <>
            <button type="button" onClick={onReserve} disabled={soldOut} className="rounded-full bg-stone-900 px-4 py-2 text-sm text-stone-50 disabled:cursor-not-allowed disabled:bg-stone-300">
                {soldOut ? "esgotados" : "Reservar"}
            </button>
            {notice ? <p className="text-sm text-stone-600">{notice}</p> : null}
        </>
    )
}
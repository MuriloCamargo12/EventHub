"use client";

import { useRouter } from "next/navigation";
import { ApiError } from "@/lib/api/client";
import { cancelReservation } from "@/lib/api/reservations";
import { useNotice } from "@/lib/use-notice";

export function CancelReservationButton({ reservationId }: { reservationId: number }) {
  const router = useRouter();
  const { notice, showError } = useNotice();
  async function onCancel() {
    try {
      await cancelReservation(reservationId);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push("/cadastro");
        return;
      }
      showError("Não foi possível cancelar.");
    }
  }
  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-full border border-stone-300 px-3 py-1.5 text-sm hover:bg-stone-100"
      >
        Cancelar reserva
      </button>
      {notice ? <p className="mt-2 text-sm text-stone-600">{notice}</p> : null}
    </div>
  );
}
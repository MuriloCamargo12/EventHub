"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, type ParticipantItem } from "../lib/api/types";
import { ApiError } from "@/lib/api/client";
import { markAttendance } from "@/lib/api/reservations";

export function ParticipantList({ participants }: { participants: ParticipantItem[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(participants);
  const [notice, setNotice] = useState("");

  async function markAttended(id: number) {
    try {
      await markAttendance(id);
      setRows((current) =>
        current.map((row) => (row.id === id ? { ...row, attended: true } : row)),
      );
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.push("/cadastro");
        return;
      }
      setNotice("Não foi possível marcar a presença.");
    }
  }

  if (rows.length === 0) {
    return <p className="text-stone-600">Nenhuma reserva ativa neste evento.</p>;
  }

  return (
    <>
      {notice ? <p className="mb-3 text-sm text-stone-600">{notice}</p> : null}

      <ul className="grid gap-3">
        {rows.map((row) => (
          <li
            key={row.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3"
          >
            <div>
              <p className="font-medium text-stone-950">{row.user.name}</p>
              <p className="text-sm text-stone-500">{row.user.email}</p>
              <p className="text-sm text-stone-500">Reservou em {formatDate(row.createdAt)}</p>
            </div>
            {row.attended ? (
              <span className="rounded-full bg-stone-200 px-3 py-1 text-sm text-stone-800">
                Presente
              </span>
            ) : (
              <button
                type="button"
                onClick={() => markAttended(row.id)}
                className="rounded-full bg-stone-900 px-3 py-1.5 text-sm text-stone-50 hover:bg-stone-700"
              >
                Marcar presença
              </button>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

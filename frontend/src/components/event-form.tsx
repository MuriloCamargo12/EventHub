"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toDateTimeLocal, type EventItem } from "../lib/api/types";
import { ApiError } from "@/lib/api/client";
import { createEvent, updateEvent } from "@/lib/api/events";

const inputClass = "rounded-xl border border-stone-300 px-3 py-2 text-stone-950";

export function EventForm({ event }: { event?: EventItem }) {
  const router = useRouter();
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(formEvent: React.FormEvent<HTMLFormElement>) {

    formEvent.preventDefault();
    if (pending) return;
    setPending(true);
    setNotice("");

    const formData = new FormData(formEvent.currentTarget);

    const body = {
      title: String(formData.get("title")),
      description: String(formData.get("description")),
      date: String(formData.get("date")),
      city: String(formData.get("city")),
      location: String(formData.get("location")),
      category: String(formData.get("category")),
      capacity: Number(formData.get("capacity")),
    };
    try {
      if (event) {
        const updated = await updateEvent(event.id, body);
        setNotice(`Evento atualizado: ${updated.id}`);
        setPending(false);
        return;
      }
      const created = await createEvent(body);
      router.push(`/events/${created.id}`);
    } catch (error) {
      setPending(false);
      if (error instanceof ApiError && error.status === 401) {
        router.push("/cadastro");
        return;
      }
      setNotice("Não foi possível salvar o evento.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid max-w-xl gap-4">
      <label className="grid gap-1 text-sm text-stone-700">
        Título
        <input name="title" required defaultValue={event?.title} className={inputClass} />
      </label>
      <label className="grid gap-1 text-sm text-stone-700">
        Descrição
        <textarea
          name="description"
          required
          defaultValue={event?.description}
          rows={4}
          className={inputClass}
        />
      </label>
      <label className="grid gap-1 text-sm text-stone-700">
        Data
        <input
          name="date"
          type="datetime-local"
          required
          defaultValue={event ? toDateTimeLocal(event.date) : undefined}
          className={inputClass}
        />
      </label>
      <label className="grid gap-1 text-sm text-stone-700">
        Cidade
        <input name="city" required defaultValue={event?.city} className={inputClass} />
      </label>
      <label className="grid gap-1 text-sm text-stone-700">
        Local
        <input name="location" required defaultValue={event?.location} className={inputClass} />
      </label>
      <label className="grid gap-1 text-sm text-stone-700">
        Categoria
        <input name="category" required defaultValue={event?.category} className={inputClass} />
      </label>
      <label className="grid gap-1 text-sm text-stone-700">
        Capacidade
        <input
          name="capacity"
          type="number"
          min={1}
          required
          defaultValue={event?.capacity}
          className={inputClass}
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="w-fit rounded-full bg-stone-900 px-4 py-2 text-sm text-stone-50 hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {pending ? "Salvando..." : event ? "Salvar alterações" : "Criar evento"}
      </button>
      {notice ? <p className="text-sm text-stone-600">{notice}</p> : null}
    </form>
  );
}

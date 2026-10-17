import Link from "next/link";
import { notFound } from "next/navigation";
import { EventForm } from "../../../../components/event-form";
import { GetEventsId } from "@/lib/api/events";
import { requireUser } from "@/lib/require-user";

type EditEventPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { id } = await params;
  await requireUser();
  const event = await GetEventsId(Number(id));
  if (!event) {
    notFound();
  }

  return (
    <div>
      <Link href={`/events/${event.id}`} className="text-sm text-stone-500 hover:text-stone-800">
        Voltar para o evento
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Editar evento</h1>
      <p className="mt-2 text-stone-600">Altere os dados e salve.</p>
      <div className="mt-8">
        <EventForm event={event} />
      </div>
    </div>
  );
}

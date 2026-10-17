import Link from "next/link";
import { notFound } from "next/navigation";
import { ParticipantList } from "../../../../components/participant-list";
import { GetEventsId, getParticipants } from "@/lib/api/events";
import { requireUser } from "@/lib/require-user";

type ParticipantsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ParticipantsPage({ params }: ParticipantsPageProps) {
  const { id } = await params;
  const { session } = await requireUser();
  const event = await GetEventsId(Number(id));
  if (!event) {
    notFound();
  }

  const participants = await getParticipants(event.id, session);


  return (
    <div>
      <Link href={`/events/${event.id}`} className="text-sm text-stone-500 hover:text-stone-800">
        Voltar para o evento
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight">Participantes</h1>
      <p className="mt-2 text-stone-600">{event.title}</p>
      <div className="mt-8">
        <ParticipantList participants={participants} />
      </div>
    </div>
  );
}

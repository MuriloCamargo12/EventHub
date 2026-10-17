import { EventForm } from "../../../components/event-form";
import { requireUser } from "@/lib/require-user";

export default async function NewEventPage() {
  await requireUser();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Criar evento</h1>
      <p className="mt-2 text-stone-600">
        Os campos seguem o que a API pede: título, descrição, data, cidade, local, categoria e
        capacidade.
      </p>
      <div className="mt-8">
        <EventForm />
      </div>
    </div>
  );
}

export type EventItem = {
  id: number;
  title: string;
  description: string;
  date: string;
  city: string;
  location: string;
  category: string;
  capacity: number;
  organizerId: number;
  reservedCount: number;
  soldOut: boolean;
};

export type ReservationItem = {
  id: number;
  status: "reserved" | "cancelled";
  attended: boolean;
  createdAt: string;
  event: Pick<EventItem, "id" | "title" | "date" | "city" | "location" | "category">;
};

export type ParticipantItem = {
  id: number;
  status: "reserved";
  attended: boolean;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};


export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(value));
}

export function toDateTimeLocal(value: string) {
  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

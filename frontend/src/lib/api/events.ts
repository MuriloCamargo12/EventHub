import type { EventItem, ParticipantItem } from "@/lib/api/types";
import { ApiError, api } from "./client";

type EventFilters = {
    city?: string;
    category?: string;
    date?: string;
}

type createEventBody = {
    title: string;
    description: string;
    date: string;
    city: string;
    location: string;
    category: string;
    capacity: number;
}

export async function createEvent(body: createEventBody) {
    return api('/events', {
        method: 'POST',
        body: JSON.stringify(body),
    }) as Promise<EventItem>
}

export async function updateEvent(id: number, body: createEventBody)  {
    return api(`/events/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
    }) as Promise<EventItem>
}

export async function getEvents(filters: EventFilters = {}) {
    const params = new URLSearchParams();

    if(filters.city) params.set('city', filters.city);
    if(filters.category) params.set('category', filters.category);
    if(filters.date) params.set('date', filters.date);

    return api(`/events?${params}`) as Promise<EventItem[]>

    
}

export async function GetEventsId(id: number) {
    try {
        return (await api(`/events/${id}`)) as EventItem;
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return null;
        }
        throw error;
    }
}

export async function getParticipants(id: number, session: string) {
    return api(`/events/${id}/participants`, {
        headers: { cookie: `session=${session}` },
    }) as Promise<ParticipantItem[]>
}
import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from "../lib/prisma.js";
import { CreateEventDto } from './dto/create-event.dto.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { FilterEventsDto } from './dto/filter-events.dto.js';

@Injectable()
export class EventsService {
    async findAll(filters: FilterEventsDto) {
        const events = await prisma.event.findMany({
            where: {
                city: filters.city ? { contains: filters.city } : undefined,
                category: filters.category ? { contains: filters.category } : undefined,
                date: filters.date ? this.dayRange(filters.date) : undefined,
            },
            orderBy: { date: "asc" },
            include: {
                _count: {
                    select: {
                        reservations: {
                            where: { status: 'reserved' },
                        },
                    },
                },
            },
        });
        return events.map((event) => this.withAvailability(event));
    }

    async findOne(id: number) {
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        reservations: {
                            where: { status: 'reserved' }
                        }
                    }
                }
            }
        })
        if (!event) {
            throw new NotFoundException("Evento não encontrado!");
        }

        return this.withAvailability(event);
    }

    async create(data: CreateEventDto, organizerId: number) {
        return await prisma.event.create({
            data: {
                ...data,
                date: new Date(data.date),
                organizerId: organizerId,
            }
        })
    }

    async update(id: number, userId: number, data: UpdateEventDto) {
        const event = await prisma.event.findUnique({
            where: { id },
        })

        if (!event) {
            throw new NotFoundException("Evento não encontrado!")
        }

        if (event.organizerId !== userId) {
            throw new ForbiddenException("Você não organiza este evento!")
        }

        if (data.capacity !== undefined) {
            const reservedCount = await prisma.reservation.count({
                where: {
                    eventId: id,
                    status: 'reserved',
                }
            })

            if (data.capacity < reservedCount) {
                throw new ConflictException("A capacidade não pode ser menor que as reservas ativas!")
            }
        }

        return prisma.event.update({
            where: { id },
            data: {
                ...data,
                date: data.date ? new Date(data.date) : undefined,
            }
        })
    }

    private withAvailability<T extends { capacity: number; _count: { reservations: number } }>(event: T) {
        const { _count, ...data } = event;
        return {
            ...data,
            reservedCount: _count.reservations,
            soldOut: _count.reservations >= event.capacity,
        };
    }


    private dayRange(date: string) {
        const start = new Date(`${date}T00:00:00.000Z`);
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 1);
        return {
            gte: start,
            lt: end,
        };
    }
}

import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';

@Injectable()
export class ReservationsService {
    async create(eventId: number, userId: number) {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        })

        if(!event) {
            throw new NotFoundException("Evento não encontrado!")
        }

        const existing = await prisma.reservation.findUnique({
            where: {
                userId_eventId: {userId, eventId },
            }
        })

        if(existing?.status === 'reserved') {
            throw new ConflictException("Você já reservou este evento!")
        }

        const reservedCount = await prisma.reservation.count({
            where: {
                eventId,
                status: 'reserved',
            }
        })

        if(reservedCount >= event.capacity) {
            throw new ConflictException("Evento lotado!")
        }

        if(existing) {
            return prisma.reservation.update({
                where: { id: existing.id },
                data: {
                    status: 'reserved',
                    attended: false,
                },
            })
        }

        return prisma.reservation.create({
            data: {
                userId,
                eventId,
                status: 'reserved',
            }
        })

    }

    async cancel(id: number, userId: number) {
        const reservation = await prisma.reservation.findUnique({
            where: { id },
        });
        if(!reservation) {
            throw new NotFoundException("Reserva não encontrada!")
        }
        if(reservation.userId !== userId) {
            throw new ForbiddenException("Você não pode cancelar esta reserva!")
        }
        if(reservation.status === 'cancelled') {
            throw new ConflictException("Reserva já cancelada!")
        }

        return prisma.reservation.update({
            where: { id },
            data: {
                status: 'cancelled',
            }
        })
    }

    async findMine(userId: number) {
        return prisma.reservation.findMany({
            where: { userId },
            include: {
                event: {
                    select: {
                        id: true,
                        title: true,
                        date: true,
                        city: true,
                        location: true,
                        category: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })
    }

    async findParticipants(eventId: number, userId: number) {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        })

        if(!event) {
            throw new NotFoundException("Evento não encontrado!")
        }

        if(event.organizerId !== userId) {
            throw new ForbiddenException("Você não organiza este evento!")
        }

        return prisma.reservation.findMany({
            where: {
                eventId,
                status: 'reserved',
            },
            select: {
                id: true,
                status: true,
                attended: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    }
    async markAttendance(id: number, userId: number) {
        const reservation = await prisma.reservation.findUnique({
          where: { id },
          include: {
            event: {
              select: { organizerId: true },
            },
          },
        });
        if (!reservation) {
          throw new NotFoundException('Reserva não encontrada!');
        }
        if (reservation.event.organizerId !== userId) {
          throw new ForbiddenException('Você não organiza este evento!');
        }
        if (reservation.status === 'cancelled') {
          throw new ConflictException('Reserva cancelada não pode ter presença!');
        }
        if (reservation.attended) {
          throw new ConflictException('Presença já marcada!');
        }
        return prisma.reservation.update({
          where: { id },
          data: { attended: true },
        });
      }
}

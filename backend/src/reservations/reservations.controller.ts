import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ReservationsService } from './reservations.service.js';
import { type AuthenticatedRequest, AuthGuard } from '../session/auth/auth.guard.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { CurrentUser } from '../session/auth/current.user.decorator.js';

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() data: CreateReservationDto,
        @CurrentUser() user: AuthenticatedRequest['user']
    ) {
        return this.reservationsService.create(data.eventId, user.id)
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    async cancel(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedRequest['user']) {
        return this.reservationsService.cancel(id, user.id)
    }

    @Patch(':id/attendance')
    @UseGuards(AuthGuard)
    async markAttendance(
        @Param('id', ParseIntPipe) id: number,
        @CurrentUser() user: AuthenticatedRequest['user'],
    ) {
        return this.reservationsService.markAttendance(id, user.id);
    }

    @Get()
    @UseGuards(AuthGuard)
    async findMine(@CurrentUser() user: AuthenticatedRequest['user']) {
        return this.reservationsService.findMine(user.id)
    }
}

import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { CreateEventDto } from './dto/create-event.dto.js';
import { type AuthenticatedRequest, AuthGuard } from '../session/auth/auth.guard.js';
import { CurrentUser } from '../session/auth/current.user.decorator.js';
import { ReservationsService } from '../reservations/reservations.service.js';
import { UpdateEventDto } from './dto/update-event.dto.js';
import { FilterEventsDto } from './dto/filter-events.dto.js';

@Controller('events')
export class EventsController {
    constructor(
        private readonly eventsService: EventsService,
        private readonly reservationsService: ReservationsService,
    ) {}

    @Get()
    async findAll(@Query() filters: FilterEventsDto) {
        return await this.eventsService.findAll(filters);
    }

    @Get(':id/participants')
    @UseGuards(AuthGuard)
    async findParticipants(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthenticatedRequest['user']) {
        return this.reservationsService.findParticipants(id, user.id);
    }

    @Get(':id')
    async findOne(@Param('id') id: number) {
        return await this.eventsService.findOne(+id);
    }

    @Post()
    @UseGuards(AuthGuard)
    async create(
        @Body() data: CreateEventDto,
        @CurrentUser() user: AuthenticatedRequest['user']
    ) {
        return await this.eventsService.create(data, user.id);
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateEventDto,
        @CurrentUser() user: AuthenticatedRequest['user'],
    ) {
        return this.eventsService.update(id, user.id, data);
    }

}

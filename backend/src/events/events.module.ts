import { Module } from '@nestjs/common';
import { EventsController } from './events.controller.js';
import { EventsService } from './events.service.js';
import { SessionModule } from '../session/session.module.js';
import { ReservationsModule } from '../reservations/reservations.module.js';

@Module({
  imports: [SessionModule, ReservationsModule],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}

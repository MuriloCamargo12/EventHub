import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service.js';
import { ReservationsController } from './reservations.controller.js';
import { SessionModule } from '../session/session.module.js';

@Module({
  imports: [SessionModule],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService]
})
export class ReservationsModule {}

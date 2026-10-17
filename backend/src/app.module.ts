import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EventsModule } from './events/events.module.js';
import { UsersModule } from './users/users.module.js';
import { SessionModule } from './session/session.module.js';
import { ReservationsModule } from './reservations/reservations.module.js';

@Module({
  imports: [EventsModule, UsersModule, SessionModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { AuthGuard } from './auth/auth.guard.js';

@Module({
  providers: [SessionService, AuthGuard],
  exports: [SessionService, AuthGuard]
})
export class SessionModule {}

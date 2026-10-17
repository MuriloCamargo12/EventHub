import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Request } from 'express';
import { SessionService } from '../session.service.js';

export type AuthenticatedRequest = Request & {
  user: {
    id: number;
    name: string;
    email: string;
  };
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const token = request.cookies?.session as string | undefined;

    request.user = await this.sessionService.getUserFromSession(token);

    return true;
  }
}

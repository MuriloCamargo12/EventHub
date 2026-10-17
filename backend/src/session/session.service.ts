import { Injectable, UnauthorizedException } from '@nestjs/common';
import { prisma } from '../lib/prisma.js';

@Injectable()
export class SessionService {
    async getUserFromSession(token?: string) {
        if(!token) {
            throw new UnauthorizedException('Não autenticado!');
        }
        const sessions = await prisma.session.findUnique({
            where: { token },
            include: {
                user: true
            }
        })

        if(!sessions || sessions.expiresAt < new Date()) {
            throw new UnauthorizedException('Sessão expirada!');
        }
        return {
            id: sessions.user.id,
            name: sessions.user.name,
            email: sessions.user.email,
        }
    }

    async logout(token: string) {
        await prisma.session.delete({
            where: { token },
        })
    }
}

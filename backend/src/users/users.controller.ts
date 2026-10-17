import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUsersDto } from './dto/create-users.dto.js';
import { LoginUsersDto } from './dto/login-users.dto.js';
import type { Request, Response } from 'express';
import { type AuthenticatedRequest, AuthGuard } from '../session/auth/auth.guard.js';
import { CurrentUser } from '../session/auth/current.user.decorator.js';
import { SessionService } from '../session/session.service.js';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly sessionService: SessionService,
    ) { }

    @Post()
    async create(@Body() data: CreateUsersDto) {
        return await this.usersService.createUser(data);
    }

    @Get('me')
    @UseGuards(AuthGuard)
    async me(@CurrentUser() user: AuthenticatedRequest['user']) {
        return user;
    }

    @Post('login')
    async login(
        @Body() data: LoginUsersDto,
        @Res({ passthrough: true }) response: Response
    ) {
        const result = await this.usersService.loginUser(data);

        response.cookie('session', result.token, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7,
        })
        return result.user;
    }

    @Post('logout')
    async logout(
        @Req() request: Request,
        @Res({ passthrough: true }) response: Response,
    ) {
        const token = request.cookies?.session as string | undefined;
        if (token) {
            await this.sessionService.logout(token);
        }
        response.clearCookie('session', {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
        });

        return {ok: true}
    }
    

}

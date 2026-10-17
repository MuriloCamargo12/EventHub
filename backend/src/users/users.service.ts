import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUsersDto } from './dto/create-users.dto.js';
import { prisma } from '../lib/prisma.js';
import bcrypt from 'bcryptjs';
import { LoginUsersDto } from './dto/login-users.dto.js';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
    async createUser(data: CreateUsersDto) {
        const existing = await prisma.user.findUnique({
            where: {
                email: data.email,
            }
        });

        if (existing) {
            throw new ConflictException('Email já cadastrado!');
        }

        const hashPassword = await bcrypt.hash(data.password, 10)

        try {
            return await prisma.user.create({
                data: {
                    ...data,
                    password: hashPassword
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            })
        } catch (error) {
            throw new InternalServerErrorException('Erro ao criar usuário');
        }
    }

    async loginUser(data: LoginUsersDto) {
        const user = await prisma.user.findUnique({
            where: {
                email: data.email,
            }
        })
        if (!user) {
            throw new UnauthorizedException('E-mail ou senha inválidos');
        }

        const passwordMatch = await bcrypt.compare(data.password, user.password)

        if (!passwordMatch) {
            throw new UnauthorizedException('E-mail ou senha inválidos');
        }

        const token = randomBytes(32).toString('hex');

        await prisma.session.create({
            data: {
                token,
                userId: user.id,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),

            }
        })

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        }
    }
}

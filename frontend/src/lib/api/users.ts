import { api } from "./client";

type UserBody = {
    email: string;
    password: string;
}

type AuthUser = {
    id: number;
    name: string;
    email: string
}

type RegisterBody = {
    name: string;
    email: string;
    password: string;
}

export async function registerUser(data: RegisterBody) {
    return api('/users', {
        method: 'POST',
        body: JSON.stringify(data),
    }) as Promise<AuthUser>
}

export async function loginUser(data: UserBody) {
    return api('/users/login', {
        method: 'POST',
        body: JSON.stringify(data),
    }) as Promise<AuthUser>
}

export async function getMe(session: string) {
    return api('/users/me', {
        headers: session ? { cookie: `session=${session}` } : {},
    }) as Promise<AuthUser>
}

export async function logoutUser() {
    return api('/users/logout', {
        method: 'POST',
    })
}
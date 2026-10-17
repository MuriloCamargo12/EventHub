const API_URL = process.env.API_URL || 'http://localhost:4000'

export class ApiError extends Error {
    status: number;

    constructor(status: number, message = "Falha na API") {
        super(message);
        this.status = status;
    }
}

export async function api(path: string, options?: RequestInit) {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        }
    },
)
    if (!response.ok) {
        let message = "Falha na API";
        try {
            const body = await response.json();
            if (typeof body?.message === "string") {
                message = body.message;
            }
        } catch {
            // a resposta de erro pode vir sem JSON
        }
        throw new ApiError(response.status, message);
    }

    return response.json()
};

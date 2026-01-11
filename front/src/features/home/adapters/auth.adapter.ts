import { AuthResponseDTO } from '@/types/dtos';

export const authAdapter = {
    authenticate: async (
        username: string,
        password: string,
    ): Promise<AuthResponseDTO> => {
        const body = { username, password };

        const response: Response = await fetch('http://localhost:8080/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        return await response.json();
    },
    verifyToken: async (token: string): Promise<boolean> => {
        const body = { token };

        const response: Response = await fetch(
            'http://localhost:8080/auth/verify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            },
        );

        if (!response.ok) {
            throw new Error('Unauthorized');
        }

        const responseData: { result: boolean } = await response.json();
        return responseData.result;
    },
};

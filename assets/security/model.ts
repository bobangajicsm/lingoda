export interface LoginRequest {
    email: string;
    password: string;
}

export interface User {
    id: number;
    email: string;
}

export interface LoginProps {
    location: {
        state: {
            from: string;
        };
    };
}

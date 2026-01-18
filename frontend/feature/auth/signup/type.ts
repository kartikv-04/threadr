export type SignupPayload = {
    username: string,
    name: string
    email: string,
    password: string
}

export type SignupResponse = {
    data: {
        user: {
            id: string; 
            username: string;
            name: string;
            email: string;
            accessToken: string;
        },
        
        server: {
            serverId: string;
            roomId: string;
            serverName: string;
            roomName: string;
        },
        refreshToken: string;
    }
}
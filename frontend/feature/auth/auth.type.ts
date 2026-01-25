export type SignInPayload = {
    email: string,
    password: string
}

export type SignInResponse = {
    data: {
        refreshToken: string,
        user : {
            id: string,
            accessToken : string,
            email  :string,
            name : string,
            username : string
        }
    }
}

export type SignupPayload = {
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
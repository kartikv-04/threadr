export type SignupPayload = {
    username : string,
    name : string
    email: string,
    password: string
}

export type SignupResponse = {
    user: {
        userId: string,
        username: string,
        name: string,
        email: string,
        accessToken: string,
    }
}
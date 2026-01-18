export type SignInPayload = {
    email: string,
    password: string
}

export type SignInResponse = {
    data: {
        refreshToken: string,
        user : {
            accessToken : string,
            email  :string,
            name : string,
            username : string
        }
    }
}
export const SignInTypes = {
    EmailPassword: "EmailPassword",
} as const;

export type SignInType = typeof SignInTypes[keyof typeof SignInTypes];

export type SignInMethod = {
    authenticate(): Promise<boolean>;
}

export interface EmailPasswordSignIn extends SignInMethod {
    email: string,
};

export class EmailPassword implements EmailPasswordSignIn {
    public email: string;
    private password: string;
    private static endpoint: string = "/auth";
    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }

    async authenticate(): Promise<boolean> {
        let url = window.location.origin + EmailPassword.endpoint;
        let data = { email: this.email, password: this.password };
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            console.log(res);
            return false;
        }
        console.log(res);
        let r = await res.json() as boolean;
        return r;
    }
}

export class Auth<T extends SignInMethod> {
    constructor(private type: SignInType, private data: T) { }

    public async auth(): Promise<boolean> {
        console.log(this.type);
        return await this.data.authenticate();
    }
}

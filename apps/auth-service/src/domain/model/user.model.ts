export class User {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly passwordHash: string,
        public readonly role: 'a' | 's',
        public readonly fullName: string,
        public readonly isActive: boolean = true,
    ) {}

    isAdmin(): boolean {
        return this.role === 'a';
    }

    canLogin(): boolean {
        return this.isActive;
    }
}
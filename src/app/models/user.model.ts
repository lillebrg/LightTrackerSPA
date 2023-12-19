export interface User{
    Id: string | null;
    ProductId: string;
    UserName: string | null;
    Password: string | null;
    isAdmin: boolean | null;
}
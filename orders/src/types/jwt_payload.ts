export interface UserPayload {
  id: string; // UUID
  email: string;
  role: string;
  sub: string;
  iat: number;
  exp: number;
}

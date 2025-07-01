export interface JwtUserPayload {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  iat?: number;
  exp?: number;
}

export interface JwtResponse {
  token: string;
  expiresIn: number;
}

export interface AuthError {
  message: string;
  statusCode: number;
}

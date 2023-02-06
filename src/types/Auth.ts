export interface Auth {
  token: string;
  issuedAt: number;
  expiresAt: number;
  serverTime: number;
}
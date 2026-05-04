import { userProps } from "./user";

export interface sessionProps extends userProps {
  user: userProps,
  credentials: Token
}

export interface Token {
  access_token: string
  token_type: string
  expires_in: number
}
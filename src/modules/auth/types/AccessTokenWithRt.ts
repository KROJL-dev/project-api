import { AccessTokenPayload } from './AccessTokenPayload'

export type AccessTokenWithRt = AccessTokenPayload & { refreshToken: string }

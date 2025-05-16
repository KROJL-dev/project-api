import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { ForbiddenException, Injectable } from '@nestjs/common'
import { AccessTokenPayload } from '../types/AccessTokenPayload'
import { Request } from 'express'
import { AccessTokenWithRt } from '../types/AccessTokenWithRt'

@Injectable()
export class JwtRtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    const jwtSecret = config.get<string>('JWT_SECRET')
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in the configuration')
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
      passReqToCallback: true,
    })
  }
  validate(req: Request, payload: AccessTokenPayload): AccessTokenWithRt {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim()

    if (!refreshToken) throw new ForbiddenException('Refresh token malformed')

    return {
      ...payload,
      refreshToken,
    }
  }
}

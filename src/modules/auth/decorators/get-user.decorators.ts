import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common'
import { isArray } from 'class-validator'

export const JWTUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest()
  const user = req.user

  if (!user) throw new InternalServerErrorException('Missed user')

  if (data) {
    if (isArray(data)) {
      const userData = {}
      data.forEach(param => {
        userData[param] = user[param]
      })
      return userData
    }
    return user[data]
  }

  return user
})

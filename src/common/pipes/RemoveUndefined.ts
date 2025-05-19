import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common'

@Injectable()
export class RemoveUndefinedPipe implements PipeTransform {
  transform(value: any, _metadata: ArgumentMetadata) {
    if (typeof value !== 'object' || value === null) return value
    return Object.fromEntries(Object.entries(value).filter(([_, v]) => v !== undefined))
  }
}

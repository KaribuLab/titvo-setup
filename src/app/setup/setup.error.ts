import { AppError } from '@titvo/shared'

export class UserNotFoundError extends AppError {
  constructor (message: string) {
    super('invalid-api-key', message)
  }
}

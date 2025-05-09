export class SetupInputDto {
  apiKey?: string
  source?: string
  userId: string
}

export class SetupOutputDto {
  message: string
  taskEndpoint: string
  encryptedApiKey: string
}

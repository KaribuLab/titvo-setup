import { Injectable, Logger } from '@nestjs/common'
import { SetupInputDto, SetupOutputDto } from '@setup/app/setup/setup.dto'
import { ValidateApiKeyUseCase } from '@titvo/auth'
import { ConfigService, AesService } from '@titvo/shared'
import { UserNotFoundError } from './setup.error'
@Injectable()
export class SetupUseCase {
  private readonly logger = new Logger(SetupUseCase.name)

  constructor (
    private readonly validateApiKeyUseCase: ValidateApiKeyUseCase,
    private readonly configService: ConfigService,
    private readonly aesService: AesService
  ) {}

  /**
   * Validates the API key and user ID
   * @param input The input data
   * @returns The output data
   */
  async execute (input: SetupInputDto): Promise<SetupOutputDto> {
    this.logger.log(`Starting setup process ${input.userId}`)
    // Validate the API key and user ID
    const apiKey = await this.validateApiKeyUseCase.execute(input.apiKey)
    if (apiKey.user.id !== input.userId) {
      throw new UserNotFoundError('Invalid API key')
    }
    this.logger.debug(`API key validated ${input.userId}`)
    const taskEndpoint = await this.configService.get('task_endpoint')
    this.logger.debug(`Task endpoint retrieved ${input.userId} ${taskEndpoint}`)
    const encryptedApiKey = await this.aesService.encrypt(input.apiKey as string)
    this.logger.debug(`API key encrypted ${input.userId}`)
    this.logger.log(`Setup process completed ${input.userId} ${taskEndpoint}`)
    return {
      message: 'success',
      taskEndpoint,
      encryptedApiKey
    }
  }
}

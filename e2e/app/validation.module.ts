import { LoggingModule } from "@neomaventures/logging"
import { RequestContextModule } from "@neomaventures/request-context"
import { Controller, Get, Module, Query } from "@nestjs/common"
import { Transform } from "class-transformer"
import { IsInt, Min } from "class-validator"

import { ExceptionHandlerModule } from "@neomaventures/exceptions"

class CountQuery {
  @Transform(({ value }: { value: unknown }) => Number(value))
  @IsInt({ message: "Count must be a whole number" })
  @Min(1, { message: "Count must be at least 1" })
  public count!: number
}

@Controller()
class ValidationController {
  /**
   * Echoes what the handler received for its query.
   *
   * @param query - The validated query.
   *
   * @returns Whether it arrived as the DTO, and its count.
   */
  @Get("count")
  public count(@Query() query: CountQuery): {
    dto: boolean
    count: unknown
  } {
    return { dto: query instanceof CountQuery, count: query.count }
  }
}

@Module({
  imports: [
    RequestContextModule.forRoot(),
    LoggingModule.forRoot(),
    ExceptionHandlerModule.forRoot({}),
  ],
  controllers: [ValidationController],
})
export class ValidationModule {}

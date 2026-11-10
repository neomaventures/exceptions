import { managedAppInstance } from "@neomaventures/managed-app"
import { HttpStatus } from "@nestjs/common"
import request from "supertest"
import { type App } from "supertest/types"

describe("Validation", () => {
  let app: Awaited<ReturnType<typeof managedAppInstance<App>>>

  beforeEach(async () => {
    app = await managedAppInstance<App>({
      module: "e2e/app/validation.module.ts#ValidationModule",
    })
  })

  describe("Given a route's input is valid", () => {
    it("should hand the route its DTO, with the values the DTO transforms them to", async () => {
      await request(app.getHttpServer())
        .get("/count?count=2")
        .expect(HttpStatus.OK)
        .expect({ dto: true, count: 2 })
    })
  })

  describe("Given a route's input is invalid", () => {
    it(`should respond with a HTTP ${HttpStatus.BAD_REQUEST} and field-keyed validation errors`, async () => {
      await request(app.getHttpServer())
        .get("/count?count=0")
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          count: { value: 0, error: "Count must be at least 1" },
        })
    })
  })
})

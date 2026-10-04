/**
 * Options for {@link ExceptionHandlerModule}.
 *
 * Currently the only option is `errorTemplates` — a global fallback map
 * consulted by {@link NeomaExceptionFilter} when no route-level
 * `@ErrorTemplate` metadata is reachable.
 */
export interface ExceptionHandlerOptions {
  /**
   * Global fallback error templates rendered when no route-level
   * `@ErrorTemplate` is reachable (middleware-thrown exceptions, unmatched
   * routes, or guards that throw before the internal metadata bridge runs).
   *
   * Keys can be either HTTP status codes (e.g. `404`, `500`) or exception
   * class names (e.g. `"NotFoundException"`, `"BadRequestException"`).
   * `default` is required when this option is provided. Within this layer,
   * the filter resolves most-specific-first: exception-name match → status
   * match → `default`. Values starting with `/` trigger a 303 See Other
   * redirect.
   *
   * @example
   * ```typescript
   * ExceptionHandlerModule.forRoot({
   *   errorTemplates: {
   *     default: "errors/generic",
   *     NotFoundException: "errors/not-found",
   *     500: "errors/server",
   *   },
   * })
   * ```
   */
  errorTemplates?: {
    default: string
    [statusOrName: string]: string
  }

  /**
   * Resolver invoked once per error template render to inject cross-cutting
   * data into the render context.
   *
   * The filter merges the returned object into the render arguments alongside
   * `res.locals` and `exception`, letting templates reference domain data
   * (e.g. the current account) that is otherwise unavailable when the
   * exception path bypasses the controller's explicit view-model return.
   *
   * Precedence (last-wins for key collisions):
   *   1. `res.locals` — framework-scoped state (CSRF, version, etc.)
   *   2. `errorContext()` — consumer-supplied cross-cutting data
   *   3. `exception` — the exception's `getResponse()` payload (always wins)
   *
   * @example
   * ```typescript
   * ExceptionHandlerModule.forRoot({
   *   errorTemplates: { default: "error" },
   *   errorContext: () => ({ account: getAccount<Account>() }),
   * })
   * ```
   */
  errorContext?: () => Record<string, unknown>
}

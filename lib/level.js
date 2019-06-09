const LEVELS = [ 'trace', 'debug', 'info', 'warn', 'error', 'fatal', 'off' ]
  
class LogLevelPlugin {

  constructor() {
    this.original = null
  }

  async env(ctx, next) {
    this.setLogLevel(ctx)
    return await next()
  }

  async start(ctx, next) {
    this.setLogLevel(ctx)
    return await next()
  }

  async request(ctx, next) {
    this.setLogLevel(ctx)
    await next()
    this.restoreLogLevel(ctx)
    return
  }

  async error(ctx, next) {
    this.setLogLevel(ctx)
    await next()
    this.restoreLogLevel(ctx)
    return
  }

  setLogLevel(ctx) {
    let original = ctx.logger.level()
    let level = getDynamicLogLevel(ctx)
    if (isValidLevel(level) && level != original) {
      ctx.logger.level(level)
      ctx.logger.debug(`Set log level to '${level}' from '${original}'`)
      this.original = original
    }
  }

  restoreLogLevel(ctx) {
    if (this.original && this.original != ctx.logger.level()) {
      ctx.logger.debug(`Restored log level to '${this.original}' from '${ctx.logger.level()}'`)
      ctx.logger.level(this.original)
    }
  }
}

function getDynamicLogLevel(ctx) {
  let level = ctx.event && ctx.event.headers 
    && (ctx.event.headers['X-Log-Level'] 
      || ctx.event.headers['x-log-level'] 
      || ctx.event.headers['X-Correlation-Log-Level'] 
      || ctx.event.headers['x-correlation-log-level'])
  return level && level.toLowerCase() || null
}

function isValidLevel(level) {
  return level && LEVELS.includes(level)
}

module.exports = LogLevelPlugin




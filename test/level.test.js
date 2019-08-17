const LogLevelPlugin = require('../lib/level')
const { LoggerWrapper } = require('@funcmaticjs/funcmatic')

describe('LogLevelPlugin', () => {
  let ctx = { }
  let plugin = null
  let noop = () => { }
  beforeEach(() => {
    ctx = {
      event: {
        headers: { }
      },
      context: { },
      state: { },
      env: { LOG_LEVEL: 'info' },
      logger: new LoggerWrapper()
    }
    plugin = new LogLevelPlugin()
  })
  it ('should set and restore debug log level', async () => {
    ctx.event.headers['X-Log-Level'] = 'debug'
    await plugin.request(ctx, async () => {
      expect(ctx.logger.level()).toEqual('debug')
      expect(ctx.env.LOG_LEVEL).toEqual('debug')
    })
    expect(ctx.logger.level()).toEqual('info')
    expect(ctx.env.LOG_LEVEL).toEqual('info')
  })
  it ('should also support x-correlation-log-level', async () => {
    ctx.event.headers['x-correlation-log-level'] = 'debug'
    await plugin.request(ctx, async () => {
      expect(ctx.logger.level()).toEqual('debug')
      expect(ctx.env.LOG_LEVEL).toEqual('debug')
    })
    expect(ctx.logger.level()).toEqual('info')
    expect(ctx.env.LOG_LEVEL).toEqual('info')
  })
  it ('should noop if set to same level', async () => {
    ctx.event.headers['X-Log-Level'] = 'info'
    await plugin.request(ctx, async () => {
      expect(ctx.logger.level()).toEqual('info')
      expect(ctx.env.LOG_LEVEL).toEqual('info')
    })
    expect(ctx.logger.level()).toEqual('info')
    expect(ctx.env.LOG_LEVEL).toEqual('info')
  })
  it ('should set level if level is uppercase', async () => {
    ctx.event.headers['X-Log-Level'] = 'DEBUG'
    await plugin.request(ctx, async () => {
      expect(ctx.logger.level()).toEqual('debug')
      expect(ctx.env.LOG_LEVEL).toEqual('debug')
    })
    expect(ctx.logger.level()).toEqual('info')
    expect(ctx.env.LOG_LEVEL).toEqual('info')
  })
  it ('should noop if no headers set', async () => {
    ctx.event.headers['X-Log-Level'] = 'info'
    await plugin.request(ctx, async () => {
      expect(ctx.logger.level()).toEqual('info')
      expect(ctx.env.LOG_LEVEL).toEqual('info')
    })
    expect(plugin.original).toBe(null)
    expect(ctx.env.LOG_LEVEL).toEqual('info')
  })
  it ('should not set level if level is null', async () => {
    ctx.event.headers['X-Log-Level'] = ''
    await plugin.request(ctx, noop)
    expect(plugin.original).toBe(null)
    expect(ctx.env.LOG_LEVEL).toEqual('info')
  })
  it ('should not set level if level is invalid', async () => {
    ctx.event.headers['X-Log-Level'] = 'invalid'
    await plugin.request(ctx, noop)
    expect(plugin.original).toBe(null)
    expect(ctx.env.LOG_LEVEL).toEqual('info')
  })
})
const LogLevelPlugin = require('../lib/level')
const { ConsoleLogger } = require('@funcmaticjs/funcmatic')

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
      logger: new ConsoleLogger()
    }
    plugin = new LogLevelPlugin()
  })
  it ('should set and restore debug log level', async () => {
    ctx.event.headers['X-Log-Level'] = 'debug'
    await plugin.request(ctx, async () => {
      expect(ctx.logger.level()).toEqual('debug')
    })
    expect(ctx.logger.level()).toEqual('info')
  })
  it ('should also support x-correlation-log-level', async () => {
    ctx.event.headers['x-correlation-log-level'] = 'debug'
    await plugin.request(ctx, async () => {
      expect(ctx.logger.level()).toEqual('debug')
    })
    expect(ctx.logger.level()).toEqual('info')
  })
  it ('should noop if set to same level', async () => {
    ctx.event.headers['X-Log-Level'] = 'info'
    await plugin.request(ctx, async () => {
      expect(ctx.logger.level()).toEqual('info')
    })
    expect(ctx.logger.level()).toEqual('info')
  })
  it ('should noop if no headers set', async () => {
    ctx.event.headers['X-Log-Level'] = 'info'
    await plugin.request(ctx, async () => {
      expect(ctx.logger.level()).toEqual('info')
    })
    expect(ctx.logger.level()).toEqual('info')
  })
})
const { register } = require('ts-node')

register({
  project: 'tsconfig.json',
  transpileOnly: true,
})

jasmine.DEFAULT_TIMEOUT_INTERVAL = process.env.DEBUG ? 60*60*1000 : 5*1000;
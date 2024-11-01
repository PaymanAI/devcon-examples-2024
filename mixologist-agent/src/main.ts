import { server } from './server'
import { startup } from './storage'

server.listen(Bun.env.PORT || 3000, () =>
  console.log('Starting server on port 3000'),
)
startup()
console.log('Storage engine started')

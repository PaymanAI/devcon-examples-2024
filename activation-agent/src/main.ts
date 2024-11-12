import { server } from './server'
import { startup } from './storage'

server.listen(Bun.env.PORT || 3000, () => {})
startup()

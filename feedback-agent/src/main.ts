import { recomputeAnalysis, server } from './server'
import { startup } from './storage'

server.listen(3000, () => console.log('Starting server on port 3000'))
startup()
console.log('Storage engine started')
await recomputeAnalysis()
console.log('Analysis recomputed')

import Paymanai from 'paymanai/index.mjs'

export const payman = new Paymanai({
  xPaymanAPISecret: Bun.env.PAYMAN_API_SECRET,
  baseURL: Bun.env.PAYMAN_API_BASE,
  environment: Bun.env.PAYMAN_API_BASE ? undefined : 'sandbox',
})

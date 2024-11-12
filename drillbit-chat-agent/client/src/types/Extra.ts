import type { Drink } from './Drink'
import type { Talent } from './Talent'

export interface Extra {
  msg: string
  status?: string
  checkoutUrl?: string
  isDrinking?: boolean
  paidDrink?: Drink
  talentReq?: Talent
  talents: Talent[]
  alcoholicDrinks: Drink[]
  soberingDrinks: Drink[]
}

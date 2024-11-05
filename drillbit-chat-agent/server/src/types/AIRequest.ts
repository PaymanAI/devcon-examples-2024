import type { Drink } from './Drink'
import type { Talent } from './Talent'

export interface AIRequest {
  message?: string
  drink?: Drink
  talent_request?: Talent
  user_id: string
  thread_id: string
}

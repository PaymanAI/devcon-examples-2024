import { tool } from '@langchain/core/tools'
import type { LangGraphRunnableConfig } from '@langchain/langgraph'
import { z } from 'zod'
import { drinks } from './drinks'
import { addOrder, getOrderByThreadsId } from './storage'

export const createCustomerDeposit = async ({
  thread_id,
  amount,
}: {
  thread_id: string
  amount: number
}) => {
  const order = await getOrderByThreadsId(thread_id)

  if (!order) {
    throw new Error('Order not found')
  }

  const payload = {
    amountDecimal: amount,
    customerId: `order-${order.thread_id}`,
    walletId: Bun.env.TIP_WALLET,
    metadata: {
      thread_id,
    },
  }

  try {
    const result = await fetch(
      `${Bun.env.PAYMAN_API_BASE}/payments/initiate-customer-deposit`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'x-payman-api-secret': Bun.env.PAYMAN_API_SECRET ?? '',
          'Content-Type': 'application/json',
        },
      },
    )

    const response = await result.json()

    if (response.checkoutUrl) {
      return response.checkoutUrl
    }
  } catch (e) {
    console.log('Failed to create tip', e)
  }

  throw new Error('Failed to create tip link')
}

export const generateTools = () => {
  const createDrinksOrder = tool(
    async (input, config: LangGraphRunnableConfig) => {
      const drink = drinks.find(d => d.name === input.drink_name)

      if (!drink) {
        throw new Error('Drink not found')
      }

      const order = await addOrder(
        config.configurable?.thread_id ?? '',
        drink.name,
        drink.instructions,
      )

      return {
        message: `Order created successfully: ${drink.name}`,
        order_id: order,
        drink: drink.name,
      }
    },
    {
      name: 'createDrinksOrder',
      description: 'Create a drinks order and send it to the bartender.',
      schema: z.object({
        drink_name: z
          .string()
          .describe('The name of the drink you want the bartender to make'),
      }),
    },
  )
  return [createDrinksOrder]
}

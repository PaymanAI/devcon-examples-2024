import Paymanai from 'paymanai'

const payman = new Paymanai({
  xPaymanAPISecret: Bun.env.PAYMAN_API_SECRET,
  baseURL: Bun.env.PAYMAN_API_BASE,
})

export const createFundRequest = async (
  user_id: string,
  thread_id: string,
  amount: number,
  paidDrink: any
) => {

  const body = {
    customerId: user_id,
    walletId: Bun.env.WALLET_ID,
    amountDecimal: amount,
    currencyCode: paidDrink.currency,
    metadata: {
      thread_id: thread_id,
      drinkName: paidDrink.name,
      drinkCurrency: paidDrink.currency,
      drinkAlcoholContent: paidDrink.alcoholContent,
      drinkSoberEffect: paidDrink.soberEffect
    },
  }

  const result = await payman.payments.initiateCustomerDeposit(body)
  return result
}

export const createTask = async (
  email: string,
  thread_id: string,
  task: string,
) => {
  const result = await payman.tasks.createTask({
    title: "Answer this user's question",
    description: `Please provide some feedback on the product by answering the following question:\n\n ${task}`,
    payoutDecimal: 10.0,
    category: 'OTHER',
    metadata: {
      thread_id,
    },
    inviteEmails: [email],
  })

  return result
}

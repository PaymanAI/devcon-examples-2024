import Paymanai from 'paymanai'

const payman = new Paymanai({
  xPaymanAPISecret: Bun.env.PAYMAN_API_SECRET,
  baseURL: Bun.env.PAYMAN_API_BASE,
})

export const createFundRequest = async (
  user_id: string,
  thread_id: string,
  amount: number,
) => {
  const body = {
    customerId: user_id,
    amountDecimal: amount,
    currencyCode: "USD",
    metadata: {
      thread_id: thread_id,
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

import { Database } from 'bun:sqlite'

const db = new Database('feedback.sqlite')

class Feedback {
  threadId: string
  feedback: string
  email: string
  quality: string
  sentiment: string

  constructor(
    threadId: string,
    feedback: string,
    email: string,
    quality: string,
    sentiment: string,
  ) {
    this.threadId = threadId
    this.feedback = feedback
    this.email = email
    this.quality = quality
    this.sentiment = sentiment
  }
}

class CountResult {
  count: number

  constructor(count: number) {
    this.count = count
  }
}

class DistributionResult {
  qualifier: string
  count: number

  constructor(count: number, qualifier: string) {
    this.count = count
    this.qualifier = qualifier
  }
}

export const getFeedback = async () => {
  const feedback = await db
    .query('SELECT feedback, email FROM feedback')
    .as(Feedback)
    .all()
  return feedback
}

export const addFeedback = async (
  threadId: string,
  feedback: string,
  email: string,
  quality: 'low' | 'medium' | 'high',
  sentiment: 'negative' | 'positive' | 'neutral',
) => {
  await db
    .query(
      `INSERT INTO feedback (thread_id, feedback, email, quality, sentiment, paid) 
			VALUES ($threadId, $feedback, $email, $quality, $sentiment, 0)`,
    )
    .run({
      $threadId: threadId,
      $feedback: feedback,
      $email: email,
      $quality: quality,
      $sentiment: sentiment,
    })
}

export const recordPayment = async (threadId: string, amount: number) => {
  console.log('Recording payment for thread', threadId, 'amount', amount)
  await db
    .query('UPDATE feedback SET paid = $amount WHERE thread_id = $threadId')
    .run({ $amount: amount, $threadId: threadId })
}

export const getTotalPayments = async () => {
  const result = await db
    .query('SELECT SUM(paid) as count FROM feedback')
    .as(CountResult)
    .get()

  return result?.count
}

export const hasUserSubmittedFeedback = async (email: string) => {
  const feedbackCount = await db
    .query('SELECT COUNT(*) as count FROM feedback WHERE email = $email')
    .as(CountResult)
    .get({ $email: email })
  return (feedbackCount?.count ?? 0) > 0
}

export const getFeedbackCount = async () => {
  const feedbackCount = await db
    .query('SELECT COUNT(*) as count FROM feedback')
    .as(CountResult)
    .get()
  return feedbackCount?.count
}

export const getSentimentDistribution = async (): Promise<
  DistributionResult[]
> => {
  const distribution = await db
    .query(
      'SELECT sentiment as qualifier, COUNT(*) as count FROM feedback GROUP BY sentiment',
    )
    .all()
  return distribution as DistributionResult[]
}

export const getQualityDistribution = async (): Promise<
  DistributionResult[]
> => {
  const distribution = await db
    .query(
      'SELECT quality as qualifier, COUNT(*) as count FROM feedback GROUP BY quality',
    )
    .all()
  return distribution as DistributionResult[]
}

export const getAveragePayout = async () => {
  const avg = await db
    .query('SELECT AVG(paid) as count FROM feedback')
    .as(CountResult)
    .get()
  return avg?.count
}

export const getAverageFeedbackLength = async () => {
  const avg = await db
    .query('SELECT AVG(length(feedback)) as count FROM feedback')
    .as(CountResult)
    .get()
  return avg?.count
}

export const startup = async () => {
  await db
    .query(
      `CREATE TABLE IF NOT EXISTS feedback (
				thread_id TEXT NOT NULL PRIMARY KEY, 
				feedback TEXT, 
				email TEXT,
				quality TEXT,
				sentiment TEXT, 
				paid REAL, 
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			)`,
    )
    .run()
}

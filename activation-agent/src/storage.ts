import { Database } from 'bun:sqlite'

const db = new Database('tweetrequest.sqlite')

enum TweetRequestStatus {
  pending = 0,
  verified = 1,
  completed = 2,
}

export class TweetRequest {
  id: number
  thread_id: string
  handle: string
  email: string
  payout: number
  timestamp: Date
  text: string
  status: TweetRequestStatus

  constructor(
    id: number,
    thread_id: string,
    handle: string,
    email: string,
    payout: number,
    timestamp: Date,
    text: string,
    status: TweetRequestStatus,
  ) {
    this.id = id
    this.thread_id = thread_id
    this.handle = handle
    this.email = email
    this.payout = payout
    this.timestamp = timestamp
    this.text = text
    this.status = status
  }
}

class CountResult {
  count: number

  constructor(count: number) {
    this.count = count
  }
}

export const addRequest = async (
  threadId: string,
  handle: string,
  email: string,
  payout: number,
  text: string,
) => {
  return await db
    .query(
      `INSERT INTO tweet_requests (thread_id, handle, email, payout, timestamp, text, status) 
			VALUES ($threadId, $handle, $email, $payout, CURRENT_TIMESTAMP, $text, $status)`,
    )
    .run({
      $threadId: threadId,
      $handle: handle,
      $email: email,
      $payout: payout,
      $text: text,
      $status: TweetRequestStatus[TweetRequestStatus.pending],
    }).lastInsertRowid
}

export const getRequest = async (id: number) => {
  const requests = await db
    .query('SELECT * FROM tweet_requests WHERE id = $id')
    .as(TweetRequest)
    .all({ $id: id })
  return requests[0]
}

export const completeRequest = async (id: number) => {
  await db
    .query('UPDATE tweet_requests SET status = $status WHERE id = $id')
    .run({ $id: id, $status: TweetRequestStatus[TweetRequestStatus.completed] })
}

export const verifyRequest = async (id: number) => {
  await db
    .query('UPDATE tweet_requests SET status = $status WHERE id = $id')
    .run({ $id: id, $status: TweetRequestStatus[TweetRequestStatus.verified] })
}

export const getOpenRequests = async () => {
  const requests = await db
    .query('SELECT * FROM tweet_requests WHERE status <> $status')
    .as(TweetRequest)
    .all({ $status: TweetRequestStatus[TweetRequestStatus.completed] })
  return requests
}

export const getCompletedRequests = async () => {
  const requests = await db
    .query('SELECT * FROM tweet_requests WHERE status = $status')
    .as(TweetRequest)
    .all({ $status: TweetRequestStatus[TweetRequestStatus.completed] })
  return requests
}

export const getTotalRequests = async () => {
  const result = await db
    .query('SELECT COUNT(*) as count FROM tweet_requests')
    .as(CountResult)
    .get()

  return result?.count
}

export const getTotalPayout = async () => {
  const result = await db
    .query(
      'SELECT SUM(payout) as total FROM tweet_requests WHERE status = $status',
    )
    .as(CountResult)
    .get({ $status: TweetRequestStatus[TweetRequestStatus.completed] })

  return result?.count
}

export const startup = async () => {
  await db
    .query(
      `CREATE TABLE IF NOT EXISTS tweet_requests 
				(id INTEGER PRIMARY KEY, thread_id TEXT, handle TEXT, email TEXT, 
				payout REAL, timestamp DATETIME, text TEXT, status TEXT)`,
    )
    .run()
}

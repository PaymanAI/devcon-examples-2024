import { Database } from 'bun:sqlite'

const db = new Database('bartender.sqlite')

export class DrinkOrder {
  id: number
  thread_id: string
  drink_name: string
  instructions: string
  tip: number
  tip_status?: string
  link?: string
  timestamp: Date
  completed: boolean

  constructor(
    id: number,
    thread_id: string,
    drink_name: string,
    instructions: string,
    tip: number,
    tip_status: string,
    link: string,
    timestamp: Date,
    completed: boolean,
  ) {
    this.id = id
    this.thread_id = thread_id
    this.drink_name = drink_name
    this.instructions = instructions
    this.tip = tip
    this.tip_status = tip_status
    this.timestamp = timestamp
    this.completed = completed
    this.link = link
  }
}

class CountResult {
  count: number

  constructor(count: number) {
    this.count = count
  }
}

export const getAllOpenOrders = async () => {
  const orders = await db
    .query('SELECT * FROM drink_orders WHERE completed = 0')
    .as(DrinkOrder)
    .all()
  return orders
}

export const addOrder = async (
  threadId: string,
  drinkName: string,
  instructions: string,
) => {
  return await db
    .query(
      `INSERT INTO drink_orders (thread_id, drink_name, instructions, timestamp, completed) 
			VALUES ($threadId, $drinkName, $instructions, CURRENT_TIMESTAMP, 0)`,
    )
    .run({
      $threadId: threadId,
      $drinkName: drinkName,
      $instructions: instructions,
      $completed: false,
    }).lastInsertRowid
}

export const completeOrder = async (id: number) => {
  await db
    .query('UPDATE drink_orders SET completed = 1 WHERE id = $id')
    .run({ $id: id })
}

export const updateTipAmount = async (
  id: number,
  tip: number,
  link: string,
) => {
  await db
    .query('UPDATE drink_orders SET tip = $tip, link = $link WHERE id = $id')
    .run({ $id: id, $tip: tip, $link: link })
}

export const updateTipStatus = async (id: number, status: string) => {
  await db
    .query('UPDATE drink_orders SET tip_status = $status WHERE id = $id')
    .run({ $id: id, $status: status })
}

export const getOrder = async (id: number): Promise<DrinkOrder> => {
  const orders = await db
    .query('SELECT * FROM drink_orders WHERE id = $id')
    .as(DrinkOrder)
    .all({ $id: id })
  return orders[0]
}

export const getTotalPaid = async () => {
  const result = await db
    .query(
      'SELECT SUM(tip) as count FROM drink_orders where tip_status = $success',
    )
    .as(CountResult)
    .get({ $success: 'success' })

  return result?.count ?? 0
}

export const getOrderByThreadsId = async (id: string): Promise<DrinkOrder> => {
  const orders = await db
    .query('SELECT * FROM drink_orders WHERE thread_id = $id')
    .as(DrinkOrder)
    .all({ $id: id })
  return orders[0]
}

export const getTotalDrinkOrders = async () => {
  const result = await db
    .query('SELECT COUNT(*) as count FROM drink_orders')
    .as(CountResult)
    .get()

  return result?.count
}

export const startup = async () => {
  await db
    .query(
      `CREATE TABLE IF NOT EXISTS drink_orders 
				(id INTEGER PRIMARY KEY, thread_id TEXT, drink_name TEXT, instructions TEXT, 
				tip REAL, tip_status TEXT, link TEXT, timestamp DATETIME, completed BOOLEAN)`,
    )
    .run()
}

export interface Message {
  text: string
  sender: 'human' | 'ai'
  isTyping?: boolean
  image?: string
}

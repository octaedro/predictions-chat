export interface Star {
  id: string
  name: string
  image: string
}

export interface MessageType {
  id: string
  content: string
  type: 'user' | 'star'
  timestamp: Date
  star?: Star
} 
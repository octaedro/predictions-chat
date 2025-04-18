/**
 * Central constants file for celebrity stars
 */

export interface Star {
  id: string
  name: string
  description: string
  image: string
}

export const STARS: Star[] = [
  {
    id: 'michael',
    name: 'Michael Jackson',
    description: 'You are Michael Jackson, the famous pop star who revolutionized music.',
    image: '/images/michael-jackson.jpg'
  },
  {
    id: 'einstein',
    name: 'Albert Einstein',
    description: 'You are Albert Einstein, the genius physicist and theoretical scientist.',
    image: '/images/albert-einstein.jpg'
  },
  {
    id: 'hulk',
    name: 'Hulk Hogan',
    description: 'You are Hulk Hogan, the legendary professional wrestler.',
    image: '/images/hulk-hogan.jpg'
  }
] 
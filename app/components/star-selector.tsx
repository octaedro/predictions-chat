'use client'

import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedStarId, setSelectedStarId } from '../store/selected-star'
import { stars } from './constants'
import { combineClassNames } from '@/lib/utils'

export function StarSelector() {
  const dispatch = useDispatch()
  const selectedStarId = useSelector(selectSelectedStarId)

  function handleSelectStar(starId: string) {
    dispatch(setSelectedStarId(starId))
  }

  return (
    <div className="flex gap-4 mb-6">
      {stars.map((star) => (
        <button
          key={star.id}
          type="button"
          onClick={() => handleSelectStar(star.id)}
          className={combineClassNames(
            'relative aspect-square w-24 overflow-hidden rounded-xl border-2 transition-all',
            selectedStarId === star.id
              ? 'border-purple-500 ring-2 ring-purple-500 ring-offset-2'
              : 'border-zinc-200 hover:border-purple-500/50'
          )}
        >
          <Image
            src={star.image}
            alt={star.name}
            fill
            className="object-cover"
            sizes="500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-2 left-2 right-2 text-xs font-medium text-white text-center">
            {star.name}
          </span>
        </button>
      ))}
    </div>
  )
} 
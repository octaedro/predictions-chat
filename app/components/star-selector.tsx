'use client'

import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedStarId } from '../store/selected-star/selectors'
import { setSelectedStarId } from '../store/selected-star/actions'
import { STARS } from './constants'
import { combineClassNames } from '@/lib/utils'

export function StarSelector() {
  const dispatch = useDispatch()
  const selectedStarId = useSelector(selectSelectedStarId)

  function handleSelectStar(starId: string) {
    dispatch(setSelectedStarId(starId))
  }

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4">Choose a celebrity:</h2>
      <div className="flex gap-4 mb-6 flex-wrap">
        {STARS.map((star) => (
          <button
            key={star.id}
            type="button"
            onClick={() => handleSelectStar(star.id)}
            className={combineClassNames(
              'relative aspect-square w-24 overflow-hidden rounded-xl border-2 shadow-lg transition-all duration-200',
              selectedStarId === star.id
                ? 'border-purple-500 ring-2 ring-purple-500 ring-offset-2 ring-offset-zinc-900 scale-105 z-10'
                : 'border-zinc-700/50 hover:border-purple-500/50 hover:scale-105'
            )}
          >
            <Image
              src={star.image}
              alt={star.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80px, 100px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <span className="absolute bottom-2 left-2 right-2 text-xs font-medium text-white text-center">
              {star.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
} 
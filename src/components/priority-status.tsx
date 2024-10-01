'use client'
import React from 'react'

interface PriorityStatusProps {
  priority: number
}

export function PriorityStatusComponent({ priority }: PriorityStatusProps) {
  const normalizedPriority = Math.min(Math.max(priority, 0), 100) / 100
  const radius = 36
  const strokeWidth = 8
  const center = radius + strokeWidth
  const size = (radius + strokeWidth) * 2

  const calculateArcPath = (endAngle: number) => {
    const start = polarToCartesian(center, center, radius, 0)
    const end = polarToCartesian(center, center, radius, endAngle)
    const largeArcFlag = endAngle <= 180 ? 0 : 1
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
  }

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    }
  }

  const arcAngle = normalizedPriority * 360

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#e5e7eb"
        strokeWidth={strokeWidth}
      />
      {/* Priority arc */}
      <path
        d={calculateArcPath(arcAngle)}
        fill="none"
        stroke="#f97316"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="20"
        fontWeight="bold"
        fill="#333"
      >
        {Math.round(priority)}
      </text>
    </svg>
  )
}
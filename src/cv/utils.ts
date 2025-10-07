export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min
  if (value > max) return max
  return value
}

export function movingAverage(prev: number, next: number, alpha: number = 0.9): number {
  return alpha * prev + (1 - alpha) * next
}



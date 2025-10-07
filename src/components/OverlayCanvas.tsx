import React, { useEffect, useRef } from 'react'

type Props = {
  width: number
  height: number
  bitmap?: ImageBitmap
}

export function OverlayCanvas({ width, height, bitmap }: Props): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (bitmap == null) return
    const ctx = canvasRef.current?.getContext('2d')
    if (ctx == null) return
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)
  }, [bitmap, width, height])

  return <canvas ref={canvasRef} width={width} height={height} />
}



import React, { useEffect, useRef, useState } from 'react'

type Props = {
  onStreamReady?: (stream: MediaStream) => void
  width?: number
  height?: number
}

export function CameraView({ onStreamReady, width = 640, height = 480 }: Props): JSX.Element {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [constraints, setConstraints] = useState<{ width: number, height: number }>({ width, height })

  useEffect(() => {
    let active = true
    const start = async (): Promise<void> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: constraints.width, height: constraints.height, facingMode: 'user' },
          audio: false
        })
        if (!active) return
        if (videoRef.current != null) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
        onStreamReady?.(stream)
      } catch (e) {
        setError((e as Error).message)
      }
    }
    void start()
    return () => { active = false }
  }, [constraints.width, constraints.height, onStreamReady])

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
        <label>
          Resolution:
          <select
            aria-label="resolution"
            onChange={e => {
              const [w, h] = e.target.value.split('x').map(Number)
              setConstraints({ width: w, height: h })
            }}
            defaultValue={`${constraints.width}x${constraints.height}`}
          >
            <option value="640x480">640x480</option>
            <option value="1280x720">1280x720</option>
            <option value="1920x1080">1920x1080</option>
          </select>
        </label>
      </div>
      {error != null && <p role="alert" style={{ color: 'crimson' }}>{error}</p>}
      <video ref={videoRef} width={constraints.width} height={constraints.height} playsInline muted />
    </div>
  )
}



import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CameraView } from './components/CameraView'
import { ControlsPanel, type Algorithm } from './components/ControlsPanel'
import { OverlayCanvas } from './components/OverlayCanvas'

type WorkerLike = Worker & { postMessage: (msg: any, transfer?: Transferable[]) => void }

export function App(): JSX.Element {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [algorithm, setAlgorithm] = useState<Algorithm>('grayscale')
  const [params, setParams] = useState<Record<string, number>>({ canny1: 80, canny2: 160, orbN: 500 })
  const [fps, setFps] = useState<number>(0)
  const [size, setSize] = useState<{ width: number, height: number }>({ width: 640, height: 480 })
  const [bitmap, setBitmap] = useState<ImageBitmap | undefined>(undefined)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const workerRef = useRef<WorkerLike | null>(null)
  const lastTsRef = useRef<number>(performance.now())

  const onStreamReady = useCallback((s: MediaStream) => {
    setStream(s)
  }, [])

  useEffect(() => {
    // lazy init worker
    const w = new Worker(new URL('./workers/cv.worker.ts', import.meta.url), { type: 'module' }) as WorkerLike
    workerRef.current = w
    w.onmessage = (e: MessageEvent) => {
      const msg = e.data
      if (msg?.type === 'ready') return
      if (msg?.type === 'bitmap') {
        setBitmap(msg.bitmap as ImageBitmap)
      }
    }
    w.postMessage({ type: 'init', width: size.width, height: size.height })
    return () => { w.terminate() }
  }, [size.width, size.height])

  const loop = useCallback(async () => {
    if (!stream) return
    const videoTrack = stream.getVideoTracks()[0]
    if (!videoTrack) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const imageCapture = new ImageCapture(videoTrack as any)
    try {
      const frame = await imageCapture.grabFrame()
      canvas.width = size.width
      canvas.height = size.height
      ctx.drawImage(frame, 0, 0, size.width, size.height)
      const bmp = await createImageBitmap(canvas)
      workerRef.current?.postMessage({ type: 'frame', bitmap: bmp, params, algorithm }, [bmp as unknown as Transferable])
    } catch {
      // fallback: draw from <video> element via offscreen if ImageCapture unsupported
    }
    const now = performance.now()
    const dt = now - lastTsRef.current
    if (dt > 0) setFps(Math.round(1000 / dt))
    lastTsRef.current = now
    rafRef.current = requestAnimationFrame(() => { void loop() })
  }, [stream, size.width, size.height, params, algorithm])

  useEffect(() => {
    if (!stream) return
    rafRef.current && cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => { void loop() })
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [stream, loop])

  const onParamChange = useCallback((key: string, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }, [])

  return (
    <div className="container py-4">
      <div className="card shadow-lg p-4" style={{ borderRadius: 18 }}>
        <header className="d-flex justify-content-between align-items-center mb-3">
          <h1 className="h3 mb-0 text-primary fw-bold">AR + CV Web <span className="fs-6 text-secondary">(OpenCV.js)</span></h1>
          <span className="badge bg-info text-dark fs-6">FPS: {fps}</span>
        </header>
        <div className="mb-3">
          <ControlsPanel
            algorithm={algorithm}
            onAlgorithmChange={setAlgorithm}
            params={params}
            onParamChange={onParamChange}
          />
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <div className="border rounded-3 p-2 bg-light">
              <CameraView onStreamReady={onStreamReady} width={size.width} height={size.height} />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="border rounded-3 p-2 bg-light">
              <OverlayCanvas width={size.width} height={size.height} bitmap={bitmap} />
            </div>
          </div>
        </div>
        <div className="alert alert-info mt-4 mb-0 text-center">
          <strong>Tip:</strong> Adjust parameters and algorithms to see real-time effects!
        </div>
      </div>
    </div>
  )
}
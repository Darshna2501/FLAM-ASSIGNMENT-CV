// WebWorker entry for CV processing using OpenCV.js

export type WorkerInit = { type: 'init', width: number, height: number }
export type WorkerFrame = { type: 'frame', bitmap: ImageBitmap, params: Record<string, number>, algorithm: string }
export type WorkerMsg = WorkerInit | WorkerFrame

let ready = false

async function ensureOpenCV(): Promise<void> {
  if (ready) return
  // OpenCV is expected to be available via importScripts from the same origin public folder
  if (!(self as any).cv) {
    importScripts('/opencv.js')
  }
  await new Promise<void>((resolve) => {
    const cv = (self as any).cv
    if (cv?.ready) { cv.ready.then(() => resolve()); return }
    if (cv?.onRuntimeInitialized) { cv.onRuntimeInitialized = () => resolve(); return }
    const id = setInterval(() => {
      if ((self as any).cv) { clearInterval(id); resolve() }
    }, 50)
  })
  ready = true
}

let frameWidth = 640
let frameHeight = 480

self.onmessage = async (e: MessageEvent<WorkerMsg>) => {
  const msg = e.data
  if (msg.type === 'init') {
    frameWidth = msg.width
    frameHeight = msg.height
    await ensureOpenCV()
    ;(self as any).postMessage({ type: 'ready' })
    return
  }
  if (msg.type === 'frame') {
    await ensureOpenCV()
    const { bitmap, params, algorithm } = msg
    const off = new OffscreenCanvas(frameWidth, frameHeight)
    const ctx = off.getContext('2d')!
    ctx.drawImage(bitmap, 0, 0, frameWidth, frameHeight)
    const imgData = ctx.getImageData(0, 0, frameWidth, frameHeight)
    const cv = (self as any).cv as typeof import('../types/opencv')
    const src = (self as any).cv.matFromImageData(imgData)
    const dst = new (self as any).cv.Mat(frameHeight, frameWidth, (self as any).cv.CV_8UC1)
    try {
      if (algorithm === 'grayscale') {
        ;(self as any).cv.cvtColor(src, dst, (self as any).cv.COLOR_RGBA2GRAY)
      } else if (algorithm === 'canny') {
        const t1 = params.canny1 ?? 80
        const t2 = params.canny2 ?? 160
        ;(self as any).cv.cvtColor(src, dst, (self as any).cv.COLOR_RGBA2GRAY)
        ;(self as any).cv.Canny(dst, dst, t1, t2)
      } else {
        // passthrough grayscale baseline
        ;(self as any).cv.cvtColor(src, dst, (self as any).cv.COLOR_RGBA2GRAY)
      }
      const outData = new ImageData(new Uint8ClampedArray(dst.data), frameWidth, frameHeight)
      const outCanvas = new OffscreenCanvas(frameWidth, frameHeight)
      const octx = outCanvas.getContext('2d')!
      octx.putImageData(outData, 0, 0)
      const outBitmap = await outCanvas.convertToBlob({ type: 'image/png' })
      ;(self as any).postMessage({ type: 'result' }, [])
      // Instead transfer bitmap for better perf (later commit will switch to ImageBitmap transfer)
      const bmp = await createImageBitmap(await outCanvas.convertToBlob())
      ;(self as any).postMessage({ type: 'bitmap', bitmap: bmp }, [bmp as unknown as Transferable])
    } catch (err) {
      ;(self as any).postMessage({ type: 'error', message: (err as Error).message })
    } finally {
      src.delete?.()
      dst.delete?.()
      bitmap.close?.()
    }
  }
}

export {}



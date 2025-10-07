// Loads OpenCV.js from public/ or CDN and resolves when cv is ready
export async function loadOpenCV(scriptUrl: string = '/opencv.js'): Promise<void> {
  if (typeof (globalThis as any).cv !== 'undefined') {
    await ready()
    return
  }
  await injectScript(scriptUrl)
  await ready()
}

async function injectScript(src: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.async = true
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error(`Failed to load ${src}`))
    document.head.appendChild(s)
  })
}

async function ready(): Promise<void> {
  await new Promise<void>((resolve) => {
    const cv = (globalThis as any).cv
    if (cv?.ready) { cv.ready.then(() => resolve()); return }
    if (cv?.onRuntimeInitialized) {
      cv.onRuntimeInitialized = () => resolve()
      return
    }
    // Fallback: poll
    const id = setInterval(() => {
      if ((globalThis as any).cv) {
        clearInterval(id)
        resolve()
      }
    }, 50)
  })
}



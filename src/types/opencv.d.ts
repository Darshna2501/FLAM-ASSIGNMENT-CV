// Minimal OpenCV global typing for this project usage
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace cv {
    const CV_8UC1: number
    const CV_8UC3: number
    const COLOR_RGBA2GRAY: number
    const NORM_HAMMING: number

    class Mat {
      constructor(rows?: number, cols?: number, type?: number)
      rows: number
      cols: number
      delete(): void
      data: Uint8Array
    }
    class KeyPoint { pt: { x: number, y: number } }
    class DMatch { queryIdx: number; trainIdx: number; distance: number }
    function matFromImageData(imgData: ImageData): Mat
    function cvtColor(src: Mat, dst: Mat, code: number): void
    function Canny(src: Mat, dst: Mat, t1: number, t2: number): void
    function imshow(canvasOrId: HTMLCanvasElement | string, mat: Mat): void
    function circle(img: Mat, center: { x: number, y: number }, radius: number, color: number[], thickness: number): void
    function line(img: Mat, p1: { x: number, y: number }, p2: { x: number, y: number }, color: number[], thickness: number): void
    function ORB_create(n?: number): ORB
    function BFMatcher_create(normType: number, crossCheck?: boolean): BFMatcher
    function findHomography(srcPoints: any, dstPoints: any, method?: number, ransacReprojThreshold?: number): Mat
    function perspectiveTransform(src: any, M: Mat, dst: any): void

    class ORB {
      detectAndCompute(img: Mat, mask: Mat | null, keypoints: any, descriptors: Mat): void
      delete(): void
    }
    class BFMatcher {
      match(desc1: Mat, desc2: Mat): DMatch[]
      knnMatch(desc1: Mat, desc2: Mat, k: number): DMatch[][]
      delete(): void
    }
  }
}
export {}



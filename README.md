# FLAM ASSIGNMENT - AR CV Web (OpenCV.js)

A modern web application for real-time Augmented Reality and Computer Vision demos using OpenCV.js, React, and Web Workers.  
The UI is styled with Bootstrap for a clean, responsive experience.

## Features

- **Live Camera Feed:** Capture and process video from your webcam.
- **Real-time Computer Vision:** Apply algorithms like grayscale, Canny edge detection, and ORB feature detection.
- **Interactive Controls:** Adjust algorithm parameters and see instant results.
- **Performance Display:** Live FPS counter for performance monitoring.
- **Responsive UI:** Clean, mobile-friendly interface using Bootstrap.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

```bash
git clone https://github.com/Darshna2501/FLAM-ASSIGNMENT-CV.git
cd FLAM-ASSIGNMENT-CV
npm install
```

### Running the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
.
├── public/
├── src/
│   ├── components/
│   │   ├── CameraView.tsx
│   │   ├── ControlsPanel.tsx
│   │   └── OverlayCanvas.tsx
│   ├── workers/
│   │   └── cv.worker.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
└── README.md
```

## Technologies Used

- [React](https://react.dev/)
- [OpenCV.js](https://docs.opencv.org/4.x/d5/d10/tutorial_js_root.html)
- [Bootstrap 5](https://getbootstrap.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (for fast development)

---

**Tip:** Adjust parameters and algorithms in the UI to see real-time
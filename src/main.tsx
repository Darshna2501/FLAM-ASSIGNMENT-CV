import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// Add these imports:
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

// Create a custom theme (optional)
const theme = createTheme({
  palette: {
    mode: 'light', // or 'dark'
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
  },
})

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
)
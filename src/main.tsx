import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'

// Adjust panel size when window is resized
function onResize() {
  // Get actual vh on mobile devices
  document.body.style.setProperty('--vh', window.innerHeight + 'px')
}

// Set size on startup
onResize()
// Recalculate on window resize
window.addEventListener('resize', onResize)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

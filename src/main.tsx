import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// 调整窗口大小以缩放面板大小
function onResize() {
  // 在移动设备上获取实际的vh
  document.body.style.setProperty('--vh', window.innerHeight + 'px')
}

// 启动时设置大小
onResize()
// 在窗口调整大小时重新计算
window.addEventListener('resize', onResize)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

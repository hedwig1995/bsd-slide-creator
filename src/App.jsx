import { useState, useRef, useEffect } from 'react'
import './App.css'
import PosterPreview from './components/PosterPreview'
import ControlPanel from './components/ControlPanel'
import { exportPoster } from './exportPoster'

export default function App() {
  const [config, setConfig] = useState({
    theme: 'liquid-glass',
    themeTint: '#ffffff',
    themeShadow: 30,
    headlineInPanel: false,
    memberInPanel: false,
    techBarEnabled: true,
    themeColor: '#007AFF',
    backgroundColor: '#1a1a2e',
    backgroundImage: null,
    backgroundImageOpacity: 1,
    backgroundImageBlur: 0,
    backgroundImageStretch: 'fit',
    backgroundImageScrim: 0,
    eyebrow: '',
    eyebrowSize: 30,
    teamName: 'BSD Team',
    teamLogo: null,
    headerFont: "'Bricolage Grotesque', sans-serif",
    headerFontSize: 96,
    headerAlign: 'center',
    headerShadow: 30,
    headerUnderline: false,
    logoPlacement: 'above',
    logoSize: 96,
    teamMembersCount: 3,
    memberShadow: 28,
    memberFont: "'Inter', sans-serif",
    memberFontSize: 28,
    teamMembers: [
      { id: 1, image: null, name: 'Member 1', role: 'Role 1', shape: 'round' },
      { id: 2, image: null, name: 'Member 2', role: 'Role 2', shape: 'round' },
      { id: 3, image: null, name: 'Member 3', role: 'Role 3', shape: 'round' },
    ],
    techBarHeight: 130,
    techStackCount: 3,
    techStack: [
      { id: 1, image: null, name: 'Tech 1' },
      { id: 2, image: null, name: 'Tech 2' },
      { id: 3, image: null, name: 'Tech 3' },
    ],
  })

  const stageWrapRef = useRef(null)
  const [scale, setScale] = useState(0.35)

  useEffect(() => {
    fitStage()
    window.addEventListener('resize', fitStage)
    return () => window.removeEventListener('resize', fitStage)
  }, [])

  const fitStage = () => {
    if (!stageWrapRef.current) return

    const wrap = stageWrapRef.current
    const pad = 52
    const aw = wrap.clientWidth - pad
    const ah = wrap.clientHeight - pad
    const next = Math.max(0.05, Math.min(aw / 1920, ah / 1080))

    setScale(next)
  }

  const zoom = Math.round(scale * 100)

  const zoomBy = (factor) => {
    setScale((s) => Math.max(0.05, Math.min(3, s * factor)))
  }

  const posterClipRef = useRef(null)
  const [exporting, setExporting] = useState(false)

  const exportImage = async (format) => {
    const node = posterClipRef.current?.querySelector('.poster-canvas')
    if (!node || exporting) return
    setExporting(true)
    try {
      const dataUrl = await exportPoster(node, scale, config, format)
      const a = document.createElement('a')
      const safeName = (config.teamName || 'slide').trim().replace(/\s+/g, '-').toLowerCase()
      a.download = `${safeName || 'slide'}.${format}`
      a.href = dataUrl
      a.click()
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="app-container">
      <ControlPanel config={config} setConfig={setConfig} />

      <div className="work-area">
        <div className="toolbar">
          <span className="toolbar-title">Live preview</span>
          <span className="toolbar-dim">1920 × 1080</span>
          <span className="toolbar-spacer"></span>
          <button
            className="btn export"
            onClick={() => exportImage('png')}
            disabled={exporting}
            title="Export as PNG"
          >
            {exporting ? 'Exporting…' : 'Export PNG'}
          </button>
          <button
            className="btn export"
            onClick={() => exportImage('jpg')}
            disabled={exporting}
            title="Export as JPG"
          >
            Export JPG
          </button>
          <span className="toolbar-divider"></span>
          <button
            className="btn ghost"
            onClick={fitStage}
            style={{cursor: 'pointer'}}
          >
            Fit
          </button>
          <div className="zoom-controls">
            <button
              className="zoom-btn"
              onClick={() => zoomBy(1 / 1.1)}
              title="Zoom out"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="zoom-val">{zoom}%</span>
            <button
              className="zoom-btn"
              onClick={() => zoomBy(1.1)}
              title="Zoom in"
              aria-label="Zoom in"
            >
              +
            </button>
          </div>
        </div>

        <div className="poster-preview" ref={stageWrapRef}>
          <div
            className="poster-clip"
            ref={posterClipRef}
            style={{ width: 1920 * scale, height: 1080 * scale }}
          >
            <PosterPreview config={config} scale={scale} />
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useRef, useEffect, useCallback } from 'react'
import './ImageCropper.css'

// On-screen crop viewport size (px) and the standard exported size (px).
const VIEW = 320
const OUTPUT = 512

export default function ImageCropper({ src, shape = 'round', onCancel, onSave }) {
  const [img, setImg] = useState(null) // loaded HTMLImageElement
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 }) // image top-left vs viewport top-left
  const baseScaleRef = useRef(1) // "cover" scale that makes the image fill the square at zoom 1
  const dragRef = useRef(null)

  // Load the image, compute the cover scale, and center it in the viewport.
  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      const base = VIEW / Math.min(image.naturalWidth, image.naturalHeight)
      baseScaleRef.current = base
      const dispW = image.naturalWidth * base
      const dispH = image.naturalHeight * base
      setImg(image)
      setZoom(1)
      setOffset({ x: (VIEW - dispW) / 2, y: (VIEW - dispH) / 2 })
    }
    image.src = src
  }, [src])

  // Keep the image covering the viewport so no empty gaps can appear.
  const clamp = useCallback(
    (off, z) => {
      if (!img) return off
      const dispW = img.naturalWidth * baseScaleRef.current * z
      const dispH = img.naturalHeight * baseScaleRef.current * z
      return {
        x: Math.min(0, Math.max(VIEW - dispW, off.x)),
        y: Math.min(0, Math.max(VIEW - dispH, off.y)),
      }
    },
    [img]
  )

  // Zoom around the viewport center so the framed subject stays put.
  const applyZoom = (z) => {
    const next = Math.min(3, Math.max(1, parseFloat(z.toFixed(2))))
    setOffset((prev) => {
      const c = VIEW / 2
      const k = next / zoom
      return clamp({ x: c - (c - prev.x) * k, y: c - (c - prev.y) * k }, next)
    })
    setZoom(next)
  }

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: offset.x, oy: offset.y }
  }
  const onPointerMove = (e) => {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.sx
    const dy = e.clientY - dragRef.current.sy
    setOffset(clamp({ x: dragRef.current.ox + dx, y: dragRef.current.oy + dy }, zoom))
  }
  const onPointerUp = () => {
    dragRef.current = null
  }
  const onWheel = (e) => {
    e.preventDefault()
    applyZoom(zoom + (e.deltaY < 0 ? 0.1 : -0.1))
  }

  // Render the framed square to an OUTPUT×OUTPUT canvas and hand back a data URL.
  const handleSave = () => {
    if (!img) return
    const scale = baseScaleRef.current * zoom
    const sSize = VIEW / scale
    const sx = -offset.x / scale
    const sy = -offset.y / scale
    const canvas = document.createElement('canvas')
    canvas.width = OUTPUT
    canvas.height = OUTPUT
    const ctx = canvas.getContext('2d')
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, sx, sy, sSize, sSize, 0, 0, OUTPUT, OUTPUT)
    onSave(canvas.toDataURL('image/jpeg', 0.92))
  }

  const dispW = img ? img.naturalWidth * baseScaleRef.current * zoom : 0
  const dispH = img ? img.naturalHeight * baseScaleRef.current * zoom : 0

  return (
    <div className="cropper-backdrop" onMouseDown={onCancel}>
      <div className="cropper-modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="cropper-title">Crop photo</div>
        <div className="cropper-hint">Drag to reposition · scroll or use the slider to zoom</div>

        <div
          className="cropper-stage"
          style={{ width: VIEW, height: VIEW }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onWheel={onWheel}
        >
          {img && (
            <img
              className="cropper-img"
              src={src}
              alt=""
              draggable={false}
              style={{
                width: dispW,
                height: dispH,
                transform: `translate(${offset.x}px, ${offset.y}px)`,
              }}
            />
          )}
          <div className={`cropper-mask ${shape === 'round' ? 'round' : 'square'}`} />
        </div>

        <div className="cropper-zoom">
          <button type="button" className="cropper-zoom-btn" onClick={() => applyZoom(zoom - 0.1)} aria-label="Zoom out">−</button>
          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(e) => applyZoom(parseFloat(e.target.value))}
          />
          <button type="button" className="cropper-zoom-btn" onClick={() => applyZoom(zoom + 0.1)} aria-label="Zoom in">+</button>
        </div>

        <div className="cropper-actions">
          <button type="button" className="cropper-btn ghost" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="cropper-btn primary" onClick={handleSave} disabled={!img}>
            Save photo
          </button>
        </div>
      </div>
    </div>
  )
}

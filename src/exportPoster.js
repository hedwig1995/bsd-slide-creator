import html2canvas from 'html2canvas-pro'

const W = 1920
const H = 1080

// Export the poster to a data URL that matches the live preview, including
// the backdrop-filter blur/refraction that DOM-to-image libraries can't capture.
// Strategy: composite a manually-blurred backdrop (layer A) under an
// html2canvas render of the content with the glass made transparent (layer B).
export async function exportPoster(canvasNode, scale, config, format) {
  const canvasRect = canvasNode.getBoundingClientRect()

  // ---- Layer A: backdrop (with blur) + per-glass blurred/refracted regions ----
  const A = document.createElement('canvas')
  A.width = W
  A.height = H
  const actx = A.getContext('2d')

  // 1. Solid background colour
  actx.fillStyle = config.backgroundColor || '#000'
  actx.fillRect(0, 0, W, H)

  // 2. Background image (with its blur + opacity + sizing)
  if (config.backgroundImage) {
    const img = await loadImage(config.backgroundImage)
    actx.save()
    actx.filter = `blur(${config.backgroundImageBlur || 0}px)`
    actx.globalAlpha = config.backgroundImageOpacity ?? 1
    drawSized(actx, img, config.backgroundImageStretch)
    actx.restore()
  }

  // 3. Scrim overlay
  if (config.backgroundImageScrim > 0) {
    actx.fillStyle = `rgba(0,0,0,${config.backgroundImageScrim})`
    actx.fillRect(0, 0, W, H)
  }

  // 4. Glass surfaces — drawn ENTIRELY on canvas (html2canvas mis-renders the
  //    glass tint, inset highlights and pseudo sheen). For each surface:
  //    blurred+refracted backdrop → tint fill → top sheen → border stroke.
  const theme = config.theme || 'liquid-glass'
  const tintHex = config.themeTint || '#ffffff'
  const filterInner = themeFilterSVG(theme)
  const filtered = filterInner
    ? await rasterizeSVG(filterSVG(A.toDataURL('image/png'), filterInner))
    : null

  // Only elements that actually carry the theme class are glass surfaces.
  // (A disabled tech bar has no theme class, so it's excluded.)
  const glassEls = [...canvasNode.querySelectorAll('.theme-' + theme)]
  for (const el of glassEls) {
    const { x, y, w, h } = rectOf(el, canvasRect, scale)
    if (w <= 1 || h <= 1) continue // skip unlaid-out / degenerate elements
    const r = radiusOf(el, w, h)

    actx.save()
    roundRectPath(actx, x, y, w, h, r)
    actx.clip()
    if (theme === 'solid-border') {
      actx.fillStyle = tintHex
      actx.fillRect(x, y, w, h)
    } else {
      actx.drawImage(filtered, 0, 0, W, H) // blurred + refracted backdrop
      actx.fillStyle =
        theme === 'frosted-glass' ? hexToRgba(tintHex, 0.16) : 'rgba(255,255,255,0.14)'
      actx.fillRect(x, y, w, h)
      const sheenTop = theme === 'liquid-glass' ? 0.34 : 0.2
      const g = actx.createLinearGradient(0, y, 0, y + h * 0.55)
      g.addColorStop(0, `rgba(255,255,255,${sheenTop})`)
      g.addColorStop(1, 'rgba(255,255,255,0)')
      actx.fillStyle = g
      actx.fillRect(x, y, w, h)
    }
    actx.restore()

    // border
    actx.save()
    roundRectPath(actx, x, y, w, h, r)
    actx.lineWidth = theme === 'solid-border' ? 2 : 1
    actx.strokeStyle =
      theme === 'solid-border' ? '#000' : 'rgba(255,255,255,0.45)'
    actx.stroke()
    actx.restore()
  }

  // ---- Layer B: ONLY foreground content (text, photos, icons) via html2canvas.
  //      All glass surfaces are made transparent so html2canvas draws no glass. ----
  const B = await html2canvas(canvasNode, {
    width: W,
    height: H,
    scale: 1,
    backgroundColor: null,
    useCORS: true,
    logging: false,
    onclone: (doc) => {
      const clone = doc.querySelector('.poster-canvas')
      if (clone) {
        clone.style.transform = 'none'
        clone.style.transformOrigin = 'top left'
        clone.style.background = 'transparent'
      }
      // Background + refraction filter are handled by layer A — remove them
      // entirely (html2canvas can otherwise render the SVG filter as a blob)
      doc.querySelectorAll('.background-image-layer, .background-scrim, .refraction-svg, svg')
        .forEach((n) => { n.remove() })
      // Make every glass surface invisible (keep border width for layout) so
      // html2canvas only paints the text/photos/icons on top.
      const style = doc.createElement('style')
      style.textContent = `
        .theme-liquid-glass, .theme-frosted-glass, .theme-solid-border {
          -webkit-backdrop-filter: none !important;
          backdrop-filter: none !important;
          background: transparent !important;
          border-color: transparent !important;
          box-shadow: none !important;
          /* keep the absolute ::after contained — without backdrop-filter it
             would otherwise escape to the poster origin and render as a blob */
          position: relative !important;
          overflow: hidden !important;
        }
        .theme-liquid-glass::before, .theme-liquid-glass::after,
        .theme-frosted-glass::before {
          display: none !important;
          content: none !important;
          background: none !important;
        }
      `
      doc.head.appendChild(style)
    },
  })

  // ---- Composite A + B at 2× for a crisp, high-quality export ----
  const SS = 2
  const out = document.createElement('canvas')
  out.width = W * SS
  out.height = H * SS
  const octx = out.getContext('2d')
  octx.imageSmoothingQuality = 'high'
  if (format === 'jpg') {
    octx.fillStyle = config.backgroundColor || '#fff'
    octx.fillRect(0, 0, out.width, out.height)
  }
  octx.drawImage(A, 0, 0, out.width, out.height)
  octx.drawImage(B, 0, 0, out.width, out.height)

  const mime = format === 'jpg' ? 'image/jpeg' : 'image/png'
  return out.toDataURL(mime, format === 'jpg' ? 0.95 : 1.0)
}

// SVG filter chain matching each theme's CSS backdrop-filter.
function themeFilterSVG(theme) {
  if (theme === 'liquid-glass') {
    return `
      <feTurbulence type="fractalNoise" baseFrequency="0.006 0.009"
        numOctaves="2" seed="11" stitchTiles="stitch" result="noise"/>
      <feGaussianBlur in="noise" stdDeviation="3" result="sn"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b"/>
      <feColorMatrix in="b" type="saturate" values="1.7" result="s"/>
      <feComponentTransfer in="s" result="br">
        <feFuncR type="linear" slope="1.04"/>
        <feFuncG type="linear" slope="1.04"/>
        <feFuncB type="linear" slope="1.04"/>
      </feComponentTransfer>
      <feDisplacementMap in="br" in2="sn" scale="26"
        xChannelSelector="R" yChannelSelector="G"/>
    `
  }
  if (theme === 'frosted-glass') {
    return `
      <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="b"/>
      <feColorMatrix in="b" type="saturate" values="1.5"/>
    `
  }
  return null // solid theme: opaque tint, no backdrop blur
}

function filterSVG(imageHref, filterInner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <filter id="g" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
        ${filterInner}
      </filter>
    </defs>
    <image href="${imageHref}" x="0" y="0" width="${W}" height="${H}"
      preserveAspectRatio="none" filter="url(#g)"/>
  </svg>`
}

function hexToRgba(hex, a) {
  const h = (hex || '#ffffff').replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function rasterizeSVG(svg) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      resolve(img)
      URL.revokeObjectURL(url)
    }
    img.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    img.src = url
  })
}

function rectOf(el, canvasRect, scale) {
  const r = el.getBoundingClientRect()
  return {
    x: (r.left - canvasRect.left) / scale,
    y: (r.top - canvasRect.top) / scale,
    w: r.width / scale,
    h: r.height / scale,
  }
}

function radiusOf(el, w, h) {
  if (el.classList.contains('member-image')) {
    if (el.classList.contains('round')) return w / 2
    if (el.classList.contains('sharp')) return 0
  }
  const v = getComputedStyle(el).borderTopLeftRadius
  let r
  if (v.endsWith('%')) r = (parseFloat(v) / 100) * Math.min(w, h)
  else r = parseFloat(v) || 0
  return Math.min(r, Math.min(w, h) / 2)
}

function roundRectPath(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function drawSized(ctx, img, mode) {
  const ir = img.width / img.height
  const r = W / H
  let dw, dh, dx, dy
  if (mode === 'fit') {
    // contain
    if (ir > r) { dw = W; dh = W / ir } else { dh = H; dw = H * ir }
  } else {
    // cover (stretch / custom both fill the frame; cover keeps aspect)
    if (ir > r) { dh = H; dw = H * ir } else { dw = W; dh = W / ir }
  }
  dx = (W - dw) / 2
  dy = (H - dh) / 2
  ctx.drawImage(img, dx, dy, dw, dh)
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

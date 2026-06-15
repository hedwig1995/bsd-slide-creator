import { useState, useRef, useLayoutEffect, Fragment } from 'react'

export default function PosterPreview({ config, scale = 1 }) {
  const posterStyle = {
    backgroundColor: config.backgroundColor,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  }

  // Measure the available member area (in unscaled poster px) so tiles auto-fit
  const membersRef = useRef(null)
  const [area, setArea] = useState({ w: 1800, h: 620 })

  useLayoutEffect(() => {
    const el = membersRef.current
    if (!el) return
    const update = () =>
      setArea({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const memberLayout = computeMemberLayout(
    config.teamMembers.length,
    area.w,
    area.h,
    config.memberInPanel
  )

  const techBarHeight = config.techBarHeight ?? 130

  const headerShadow = config.headerShadow ?? 30
  const headlineTextShadow =
    headerShadow > 0
      ? `0 ${(headerShadow * 0.12).toFixed(1)}px ${(headerShadow * 0.5).toFixed(
          1
        )}px rgba(0,0,0,${Math.min(headerShadow / 100, 0.9).toFixed(2)})`
      : 'none'

  const memberShadow = config.memberShadow ?? 28
  const memberBoxShadow =
    memberShadow > 0
      ? `0 ${(memberShadow * 0.4).toFixed(1)}px ${(memberShadow * 1.1).toFixed(
          1
        )}px rgba(0,0,0,${Math.min(memberShadow / 100, 0.85).toFixed(2)})`
      : '0 0 transparent'

  // ===== Theme surface =====
  const theme = config.theme || 'liquid-glass'
  const surfaceClass = `theme-${theme}`
  const tintHex = config.themeTint || '#ffffff'
  const themeShadowVal = config.themeShadow ?? 30
  const themeDrop =
    themeShadowVal > 0
      ? `0 ${(themeShadowVal * 0.5).toFixed(1)}px ${(themeShadowVal * 1.4).toFixed(
          1
        )}px rgba(0,0,0,${Math.min(themeShadowVal / 100, 0.6).toFixed(2)})`
      : '0 0 transparent'

  const lightTint = luminance(tintHex) > 0.6
  const onTint = lightTint ? '#14171c' : '#ffffff'
  const chipBg = lightTint ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.22)'

  const surfaceVars = (dropShadow) => ({
    '--tint': hexToRgba(tintHex, theme === 'solid-border' ? 1 : 0.16),
    '--drop-shadow': dropShadow,
    '--on-tint': onTint,
    '--chip-bg': chipBg,
  })

  return (
    <div className="poster-canvas" style={posterStyle}>
      {/* SVG refraction filter for the liquid-glass theme (Chrome) */}
      <svg
        aria-hidden="true"
        className="refraction-svg"
        style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}
      >
        <filter
          id="liquid-refraction"
          x="-15%"
          y="-15%"
          width="130%"
          height="130%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.009"
            numOctaves="2"
            seed="11"
            stitchTiles="stitch"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="3" result="softNoise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="softNoise"
            scale="26"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* Background image layer */}
      {config.backgroundImage && (
        <div
          className="background-image-layer"
          style={{
            filter: `blur(${config.backgroundImageBlur}px)`,
            opacity: config.backgroundImageOpacity,
          }}
        >
          <img
            src={config.backgroundImage}
            alt="background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: config.backgroundImageStretch === 'fit' ? 'contain' : 'cover',
            }}
          />
        </div>
      )}

      {/* Scrim overlay */}
      {config.backgroundImageScrim > 0 && (
        <div
          className="background-scrim"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${config.backgroundImageScrim})`,
          }}
        ></div>
      )}

      {/* Main content */}
      <div className="poster-content">
        {/* Header Section */}
        {(() => {
          const align = config.headerAlign || 'center'
          const alignItems =
            align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'
          const logo = config.teamLogo && (
            <img
              src={config.teamLogo}
              alt="team logo"
              className="poster-logo"
              style={{ height: (config.logoSize ?? 96) + 'px' }}
            />
          )
          const textBlock = (
            <div className="poster-header-text" style={{ alignItems, textAlign: align }}>
              {config.eyebrow && (
                <div
                  className="poster-eyebrow"
                  style={{ color: config.themeColor, fontSize: (config.eyebrowSize ?? 30) + 'px' }}
                >
                  {config.eyebrow}
                </div>
              )}
              <h1
                className="poster-team-name"
                style={{
                  fontFamily: config.headerFont,
                  fontSize: (config.headerFontSize ?? 96) + 'px',
                  color: config.themeColor,
                  textShadow: headlineTextShadow,
                }}
              >
                {config.teamName || 'Team name'}
              </h1>
              {config.headerUnderline && (
                <div
                  className="poster-underline"
                  style={{ background: config.themeColor }}
                ></div>
              )}
            </div>
          )

          const inner =
            config.logoPlacement === 'left' ? (
              <div className="poster-header-row">
                {logo}
                {textBlock}
              </div>
            ) : (
              <>
                {logo}
                {textBlock}
              </>
            )

          return (
            <div className="poster-header" style={{ alignItems, textAlign: align }}>
              {config.headlineInPanel ? (
                <div
                  className={`headline-panel ${surfaceClass}`}
                  style={{ alignItems, ...surfaceVars(themeDrop) }}
                >
                  {inner}
                </div>
              ) : (
                inner
              )}
            </div>
          )
        })()}

        {/* Team Members Section */}
        {config.teamMembers.length > 0 && (
          <div className="poster-team-members" ref={membersRef}>
            <div
              className="member-grid"
              style={{
                gridTemplateColumns: `repeat(${memberLayout.cols}, auto)`,
                gap: memberLayout.gap + 'px',
              }}
            >
              {config.teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`member-tile${
                    config.memberInPanel ? ` member-tile-panel ${surfaceClass}` : ''
                  }`}
                  style={
                    config.memberInPanel
                      ? {
                          padding: `${memberLayout.panelPad}px ${memberLayout.panelPad * 0.9}px`,
                          ...surfaceVars(themeDrop),
                        }
                      : undefined
                  }
                >
                  <div
                    className={`member-image ${member.shape} ${surfaceClass}`}
                    style={{
                      width: memberLayout.avatar + 'px',
                      height: memberLayout.avatar + 'px',
                      borderRadius:
                        member.shape === 'round'
                          ? '50%'
                          : member.shape === 'rounded'
                          ? memberLayout.avatar * 0.18 + 'px'
                          : '0px',
                      ...surfaceVars(memberBoxShadow),
                      ...(member.image ? { background: 'transparent' } : {}),
                    }}
                  >
                    {member.image ? (
                      <img src={member.image} alt={member.name} />
                    ) : (
                      <span style={{ fontSize: memberLayout.initialsFont + 'px', fontWeight: 800 }}>
                        {initials(member.name)}
                      </span>
                    )}
                  </div>
                  <div
                    className="member-info"
                    style={{ marginTop: memberLayout.infoGap + 'px' }}
                  >
                    <div className="name" style={{ fontSize: memberLayout.nameFont + 'px' }}>
                      {member.name || 'Name'}
                    </div>
                    {member.role && (
                      <div className="role" style={{ fontSize: memberLayout.roleFont + 'px' }}>
                        {member.role}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack Section */}
        {config.techStack.length > 0 && (() => {
          const n = config.techStack.length
          // Scale icon down as the count grows so all items fit the bar
          const iconSize = n <= 4 ? 80 : n <= 6 ? 72 : n <= 8 ? 64 : 56
          const iconFont = Math.round(iconSize * 0.38)
          const itemPadding = n <= 5 ? 26 : n <= 7 ? 18 : 12

          const barOn = config.techBarEnabled !== false
          return (
            <div
              className={`poster-tech-stack ${barOn ? surfaceClass : 'no-bar'}`}
              style={
                barOn
                  ? { height: techBarHeight + 'px', ...surfaceVars(themeDrop) }
                  : { height: techBarHeight + 'px' }
              }
            >
              {config.techStack.map((tech, idx) => (
                <Fragment key={tech.id}>
                  {idx > 0 && barOn && <div className="tech-divider"></div>}
                  <div
                    className="tech-item"
                    style={{ padding: `0 ${itemPadding}px` }}
                  >
                    <div
                      className="tech-icon"
                      style={{ width: iconSize, height: iconSize }}
                    >
                      {tech.image ? (
                        <img src={tech.image} alt={`tech ${idx + 1}`} />
                      ) : (
                        <span style={{ fontSize: iconFont + 'px', fontWeight: 800 }}>
                          {idx + 1}
                        </span>
                      )}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// Pick the column count that yields the largest tiles fitting the area,
// then derive avatar size, gaps and font sizes from it.
function computeMemberLayout(count, w, h, inPanel) {
  if (!count || w <= 0 || h <= 0) {
    return { cols: 1, avatar: 200, gap: 30, initialsFont: 68, nameFont: 16, roleFont: 14, infoGap: 14, panelPad: 0 }
  }
  // Leave breathing room so tiles don't touch the poster edges
  const W = Math.max(0, w - 100)
  const H = Math.max(0, h - 36)
  const heightFactor = inPanel ? 1.85 : 1.4 // tile height ≈ avatar * factor (label + padding)
  let best = null
  for (let cols = 1; cols <= count; cols++) {
    const rows = Math.ceil(count / cols)
    const gap = Math.max(12, Math.min(30, W * 0.018))
    const cellW = (W - gap * (cols - 1)) / cols
    const cellH = (H - gap * (rows - 1)) / rows
    if (cellW <= 0 || cellH <= 0) continue
    const avatar = Math.min(cellW * 0.92, cellH / heightFactor)
    if (!best || avatar > best.avatar) best = { cols, rows, gap, avatar }
  }
  if (!best) {
    const cols = Math.min(count, Math.max(1, Math.ceil(Math.sqrt(count))))
    best = { cols, gap: 16, avatar: 60 }
  }
  const avatar = Math.max(34, Math.min(best.avatar, 210))
  return {
    cols: best.cols,
    gap: best.gap,
    avatar,
    initialsFont: Math.round(avatar * 0.34),
    nameFont: Math.max(11, Math.round(avatar * 0.09)),
    roleFont: Math.max(9, Math.round(avatar * 0.075)),
    infoGap: Math.max(6, Math.round(avatar * 0.07)),
    panelPad: inPanel ? Math.round(avatar * 0.2) : 0,
  }
}

function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase()
}

function hexToRgba(hex, a) {
  const { r, g, b } = parseHex(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function parseHex(hex) {
  const h = (hex || '#ffffff').replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function luminance(hex) {
  const { r, g, b } = parseHex(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

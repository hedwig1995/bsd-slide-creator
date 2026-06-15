const ThemeGenerator = {
  getThemeStyle: (theme, tintColor) => {
    const styles = {
      'liquid-glass': {
        memberTileBackground: `rgba(255, 255, 255, 0.1)`,
        techStackBackground: `rgba(255, 255, 255, 0.1)`,
        memberTileBorder: `2px solid rgba(255, 255, 255, 0.2)`,
        techStackBorder: `2px solid rgba(255, 255, 255, 0.2)`,
        techIconBackground: `rgba(255, 255, 255, 0.15)`,
        techIconBorder: `1px solid rgba(255, 255, 255, 0.25)`,
        backdropFilter: `blur(20px) saturate(180%)`,
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.1)`,
      },
      'frosted-glass': {
        memberTileBackground: `rgba(255, 255, 255, 0.08)`,
        techStackBackground: `rgba(255, 255, 255, 0.08)`,
        memberTileBorder: `1px solid rgba(255, 255, 255, 0.15)`,
        techStackBorder: `1px solid rgba(255, 255, 255, 0.15)`,
        techIconBackground: `rgba(255, 255, 255, 0.1)`,
        techIconBorder: `1px solid rgba(255, 255, 255, 0.15)`,
        backdropFilter: `blur(10px) saturate(100%)`,
        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.15)`,
      },
      pebble: {
        memberTileBackground: `rgba(255, 255, 255, 0.12)`,
        techStackBackground: `rgba(255, 255, 255, 0.12)`,
        memberTileBorder: `none`,
        techStackBorder: `none`,
        techIconBackground: `rgba(255, 255, 255, 0.15)`,
        techIconBorder: `none`,
        backdropFilter: `blur(15px) saturate(130%)`,
        boxShadow: `0 6px 25px rgba(0, 0, 0, 0.12)`,
      },
    }

    return styles[theme] || styles['liquid-glass']
  },

  applyTint: (baseColor, tintColor, intensity = 0.3) => {
    // Simple color blending
    const base = baseColor.replace('#', '')
    const tint = tintColor.replace('#', '')

    const r = Math.round(
      parseInt(base.substr(0, 2), 16) * (1 - intensity) +
        parseInt(tint.substr(0, 2), 16) * intensity
    )
    const g = Math.round(
      parseInt(base.substr(2, 2), 16) * (1 - intensity) +
        parseInt(tint.substr(2, 2), 16) * intensity
    )
    const b = Math.round(
      parseInt(base.substr(4, 2), 16) * (1 - intensity) +
        parseInt(tint.substr(4, 2), 16) * intensity
    )

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
  },
}

export default ThemeGenerator

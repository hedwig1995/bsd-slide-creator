import { useState } from 'react'
import '../styles/ControlPanel.css'
import ImageCropper from './ImageCropper'

// Shared font list used by both the headline and the team-member tiles.
const FONT_OPTIONS = [
  { value: "'Bricolage Grotesque', sans-serif", label: 'Bricolage Grotesque' },
  { value: "'Space Grotesk', sans-serif", label: 'Space Grotesk' },
  { value: "'Poppins', sans-serif", label: 'Poppins' },
  { value: "'Outfit', sans-serif", label: 'Outfit' },
  { value: "'Sora', sans-serif", label: 'Sora' },
  { value: "'Plus Jakarta Sans', sans-serif", label: 'Plus Jakarta Sans' },
  { value: "'Manrope', sans-serif", label: 'Manrope' },
  { value: "'Montserrat', sans-serif", label: 'Montserrat' },
  { value: "'Archivo', sans-serif", label: 'Archivo' },
  { value: "'Inter', sans-serif", label: 'Inter' },
  { value: "'Astloch', system-ui", label: 'Astloch' },
  { value: "'Audiowide', sans-serif", label: 'Audiowide' },
  { value: "'Bitcount Grid Double', system-ui", label: 'Bitcount Grid Double' },
  { value: "'Bitcount Single', system-ui", label: 'Bitcount Single' },
  { value: "'Limelight', sans-serif", label: 'Limelight' },
  { value: "'Metamorphous', serif", label: 'Metamorphous' },
  { value: "'Noto Sans Mono', monospace", label: 'Noto Sans Mono' },
  { value: "'Play', sans-serif", label: 'Play' },
  { value: "'Roboto Flex', sans-serif", label: 'Roboto Flex' },
  { value: "'Smooch Sans', sans-serif", label: 'Smooch Sans' },
  { value: "'Stack Sans Notch', sans-serif", label: 'Stack Sans Notch' },
]

const SECTION_DEFAULTS = {
  theme: {
    theme: 'liquid-glass',
    themeTint: '#ffffff',
    themeShadow: 30,
    headlineInPanel: false,
    memberInPanel: false,
    techBarEnabled: true,
  },
  header: {
    eyebrow: '',
    eyebrowSize: 30,
    teamName: 'BSD Team',
    teamLogo: null,
    headerFont: "'Bricolage Grotesque', sans-serif",
    headerFontSize: 96,
    headerAlign: 'center',
    headerShadow: 30,
    themeColor: '#007AFF',
    headerUnderline: false,
    logoPlacement: 'above',
    logoSize: 96,
  },
  background: {
    backgroundColor: '#1a1a2e',
  },
  backgroundImage: {
    backgroundImage: null,
    backgroundImageOpacity: 1,
    backgroundImageBlur: 0,
    backgroundImageStretch: 'fit',
    backgroundImageScrim: 0,
  },
  members: {
    teamMembersCount: 3,
    memberShadow: 28,
    memberFont: "'Inter', sans-serif",
    memberFontSize: 28,
    teamMembers: [
      { id: 1, image: null, name: 'Member 1', role: 'Role 1', shape: 'round' },
      { id: 2, image: null, name: 'Member 2', role: 'Role 2', shape: 'round' },
      { id: 3, image: null, name: 'Member 3', role: 'Role 3', shape: 'round' },
    ],
  },
  tech: {
    techBarHeight: 130,
    techStackCount: 3,
    techIconScale: 60,
    techShowName: false,
    techNameSize: 15,
    techStack: [
      { id: 1, image: null, name: 'Tech 1' },
      { id: 2, image: null, name: 'Tech 2' },
      { id: 3, image: null, name: 'Tech 3' },
    ],
  },
}

export default function ControlPanel({ config, setConfig }) {
  const [openSections, setOpenSections] = useState({
    0: true, // Theme
    5: true, // Header
    1: true, // Background color
    2: false, // Background image
    3: true, // Team members
    4: false, // Tech stack
  })

  // When set, opens the crop modal for the given member's freshly picked photo.
  const [crop, setCrop] = useState(null) // { memberId, src, shape } | null

  const toggleSection = (num) => {
    setOpenSections(prev => ({
      ...prev,
      [num]: !prev[num]
    }))
  }

  const resetSection = (key) => {
    setConfig(prev => ({ ...prev, ...SECTION_DEFAULTS[key] }))
  }

  const handleThemeChange = (e) => {
    setConfig(prev => ({ ...prev, theme: e.target.value }))
  }

  const handleThemeTintChange = (e) => {
    setConfig(prev => ({ ...prev, themeTint: e.target.value }))
  }

  const handleThemeShadowChange = (e) => {
    setConfig(prev => ({ ...prev, themeShadow: parseInt(e.target.value) }))
  }

  const handleHeadlineInPanelChange = (e) => {
    setConfig(prev => ({ ...prev, headlineInPanel: e.target.checked }))
  }

  const handleMemberInPanelChange = (e) => {
    setConfig(prev => ({ ...prev, memberInPanel: e.target.checked }))
  }

  const handleTechBarEnabledChange = (e) => {
    setConfig(prev => ({ ...prev, techBarEnabled: e.target.checked }))
  }

  const handleThemeColorChange = (e) => {
    setConfig(prev => ({ ...prev, themeColor: e.target.value }))
  }

  const handleBackgroundColorChange = (e) => {
    setConfig(prev => ({ ...prev, backgroundColor: e.target.value }))
  }

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setConfig(prev => ({ ...prev, backgroundImage: event.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageOpacityChange = (e) => {
    setConfig(prev => ({ ...prev, backgroundImageOpacity: parseInt(e.target.value) / 100 }))
  }

  const handleImageBlurChange = (e) => {
    setConfig(prev => ({ ...prev, backgroundImageBlur: parseInt(e.target.value) }))
  }

  const handleImageStretchChange = (e) => {
    setConfig(prev => ({ ...prev, backgroundImageStretch: e.target.value }))
  }

  const handleImageScrimChange = (e) => {
    setConfig(prev => ({ ...prev, backgroundImageScrim: parseInt(e.target.value) / 100 }))
  }

  const handleEyebrowChange = (e) => {
    setConfig(prev => ({ ...prev, eyebrow: e.target.value }))
  }

  const handleEyebrowSizeChange = (e) => {
    setConfig(prev => ({ ...prev, eyebrowSize: parseInt(e.target.value) }))
  }

  const handleHeaderFontSizeChange = (e) => {
    setConfig(prev => ({ ...prev, headerFontSize: parseInt(e.target.value) }))
  }

  const handleHeaderShadowChange = (e) => {
    setConfig(prev => ({ ...prev, headerShadow: parseInt(e.target.value) }))
  }

  const handleMemberShadowChange = (e) => {
    setConfig(prev => ({ ...prev, memberShadow: parseInt(e.target.value) }))
  }

  const handleMemberFontChange = (e) => {
    setConfig(prev => ({ ...prev, memberFont: e.target.value }))
  }

  const handleMemberFontSizeChange = (e) => {
    setConfig(prev => ({ ...prev, memberFontSize: parseInt(e.target.value) }))
  }

  const handleHeaderAlignChange = (align) => {
    setConfig(prev => ({ ...prev, headerAlign: align }))
  }

  const handleLogoPlacementChange = (placement) => {
    setConfig(prev => ({ ...prev, logoPlacement: placement }))
  }

  const handleLogoSizeChange = (e) => {
    setConfig(prev => ({ ...prev, logoSize: parseInt(e.target.value) }))
  }

  const handleHeaderUnderlineChange = (e) => {
    setConfig(prev => ({ ...prev, headerUnderline: e.target.checked }))
  }

  const handleTechBarHeightChange = (e) => {
    setConfig(prev => ({ ...prev, techBarHeight: parseInt(e.target.value) }))
  }

  const handleTechIconScaleChange = (e) => {
    setConfig(prev => ({ ...prev, techIconScale: parseInt(e.target.value) }))
  }

  const handleTechShowNameChange = (e) => {
    setConfig(prev => ({ ...prev, techShowName: e.target.checked }))
  }

  const handleTechNameSizeChange = (e) => {
    setConfig(prev => ({ ...prev, techNameSize: parseInt(e.target.value) }))
  }

  const handleTeamNameChange = (e) => {
    setConfig(prev => ({ ...prev, teamName: e.target.value }))
  }

  const handleTeamLogoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setConfig(prev => ({ ...prev, teamLogo: event.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHeaderFontChange = (e) => {
    setConfig(prev => ({ ...prev, headerFont: e.target.value }))
  }

  const handleTeamMembersCountChange = (e) => {
    const newCount = parseInt(e.target.value)
    const currentCount = config.teamMembers.length
    let newMembers = [...config.teamMembers]

    if (newCount > currentCount) {
      for (let i = currentCount; i < newCount; i++) {
        newMembers.push({
          id: Date.now() + i,
          image: null,
          name: `Member ${i + 1}`,
          role: `Role ${i + 1}`,
          shape: 'round',
        })
      }
    } else {
      newMembers = newMembers.slice(0, newCount)
    }

    setConfig(prev => ({
      ...prev,
      teamMembersCount: newCount,
      teamMembers: newMembers,
    }))
  }

  const handleMemberChange = (memberId, field, value) => {
    setConfig(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member =>
        member.id === memberId ? { ...member, [field]: value } : member
      ),
    }))
  }

  const handleMemberImageChange = (memberId, file, shape) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setCrop({ memberId, src: event.target.result, shape })
    }
    reader.readAsDataURL(file)
  }

  const handleCropSave = (dataUrl) => {
    if (crop) handleMemberChange(crop.memberId, 'image', dataUrl)
    setCrop(null)
  }

  const handleTechStackCountChange = (e) => {
    const newCount = parseInt(e.target.value)
    const currentCount = config.techStack.length
    let newStack = [...config.techStack]

    if (newCount > currentCount) {
      for (let i = currentCount; i < newCount; i++) {
        newStack.push({
          id: Date.now() + i,
          image: null,
          name: `Tech ${i + 1}`,
        })
      }
    } else {
      newStack = newStack.slice(0, newCount)
    }

    setConfig(prev => ({
      ...prev,
      techStackCount: newCount,
      techStack: newStack,
    }))
  }

  const handleTechChange = (techId, field, value) => {
    setConfig(prev => ({
      ...prev,
      techStack: prev.techStack.map(tech =>
        tech.id === techId ? { ...tech, [field]: value } : tech
      ),
    }))
  }

  const handleTechImageChange = (techId, file) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        handleTechChange(techId, 'image', event.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="control-panel">
      <div className="control-panel-header">
        <div className="control-panel-title">BSD Slide Creator</div>
        <div className="control-panel-subtitle">Create 1920×1080 Event Posters</div>
      </div>

      <div className="control-panel-body">
        {/* Section: Theme */}
        <Accordion
          title="Theme"
          open={openSections[0]}
          onToggle={() => toggleSection(0)}
          onReset={() => resetSection('theme')}
        >
          <div className="control-group">
            <label>Surface style</label>
            <select value={config.theme} onChange={handleThemeChange}>
              <option value="liquid-glass">Liquid glass</option>
              <option value="frosted-glass">Frosted glass</option>
              <option value="solid-border">Solid color + black border</option>
            </select>
          </div>

          {(config.theme === 'frosted-glass' || config.theme === 'solid-border') && (
            <div className="control-group">
              <label>
                {config.theme === 'solid-border' ? 'Fill color' : 'Glass tint'}
              </label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={config.themeTint}
                  onChange={handleThemeTintChange}
                />
                <span style={{ color: 'var(--mut)', fontSize: '12px' }}>
                  {config.themeTint.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          <div className="control-group">
            <label>Element shadow: {config.themeShadow}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={config.themeShadow}
              onChange={handleThemeShadowChange}
            />
          </div>

          <div className="control-group">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={config.headlineInPanel}
                onChange={handleHeadlineInPanelChange}
              />
              <span>Headline on a tabloid panel</span>
            </label>
          </div>

          <div className="control-group">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={config.memberInPanel}
                onChange={handleMemberInPanelChange}
              />
              <span>Each member tile on a panel</span>
            </label>
          </div>

          <div className="control-group">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={config.techBarEnabled}
                onChange={handleTechBarEnabledChange}
              />
              <span>Show tech stack bar</span>
            </label>
          </div>
        </Accordion>

        {/* Section: Header */}
        <Accordion
          title="Header & title"
          open={openSections[5]}
          onToggle={() => toggleSection(5)}
          onReset={() => resetSection('header')}
        >
          <div className="control-group">
            <label>Eyebrow (optional)</label>
            <input
              type="text"
              value={config.eyebrow}
              onChange={handleEyebrowChange}
              placeholder="e.g. PRESENTED BY"
            />
          </div>

          {config.eyebrow && (
            <div className="control-group">
              <label>Eyebrow size: {config.eyebrowSize}px</label>
              <input
                type="range"
                min="14"
                max="72"
                step="1"
                value={config.eyebrowSize}
                onChange={handleEyebrowSizeChange}
              />
            </div>
          )}

          <div className="control-group">
            <label>Team name (H1)</label>
            <input
              type="text"
              value={config.teamName}
              onChange={handleTeamNameChange}
              placeholder="Enter team name"
            />
          </div>

          <div className="control-group">
            <label>Headline size: {config.headerFontSize}px</label>
            <input
              type="range"
              min="40"
              max="200"
              step="2"
              value={config.headerFontSize}
              onChange={handleHeaderFontSizeChange}
            />
          </div>

          <div className="control-group">
            <label>Headline alignment</label>
            <div className="segmented">
              {['left', 'center', 'right'].map((a) => (
                <button
                  key={a}
                  className={config.headerAlign === a ? 'active' : ''}
                  onClick={() => handleHeaderAlignChange(a)}
                >
                  {a === 'left' ? 'Left' : a === 'center' ? 'Center' : 'Right'}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <label>Headline shadow: {config.headerShadow}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={config.headerShadow}
              onChange={handleHeaderShadowChange}
            />
          </div>

          <div className="control-group">
            <label>Title font</label>
            <select value={config.headerFont} onChange={handleHeaderFontChange}>
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Title color</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={config.themeColor}
                onChange={handleThemeColorChange}
              />
              <span style={{ color: 'var(--mut)', fontSize: '12px' }}>
                {config.themeColor.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="control-group">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={config.headerUnderline}
                onChange={handleHeaderUnderlineChange}
              />
              <span>Show underline accent</span>
            </label>
          </div>

          <div className="control-group">
            <label>Team Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleTeamLogoChange}
            />
          </div>

          {config.teamLogo && (
            <>
              <div className="control-group">
                <label>Logo placement</label>
                <div className="segmented">
                  {['above', 'left'].map((p) => (
                    <button
                      key={p}
                      className={config.logoPlacement === p ? 'active' : ''}
                      onClick={() => handleLogoPlacementChange(p)}
                    >
                      {p === 'above' ? 'Above title' : 'Left of title'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-group">
                <label>Logo size: {config.logoSize}px</label>
                <input
                  type="range"
                  min="40"
                  max="260"
                  step="2"
                  value={config.logoSize}
                  onChange={handleLogoSizeChange}
                />
              </div>
            </>
          )}
        </Accordion>

        {/* Section: Background color */}
        <Accordion
          title="Background color"
          open={openSections[1]}
          onToggle={() => toggleSection(1)}
          onReset={() => resetSection('background')}
        >
          <div className="control-group">
            <label>Solid background</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="color"
                value={config.backgroundColor}
                onChange={handleBackgroundColorChange}
              />
              <span style={{ color: 'var(--mut)', fontSize: '12px' }}>
                {config.backgroundColor.toUpperCase()}
              </span>
            </div>
          </div>
        </Accordion>

        {/* Section: Background Image */}
        <Accordion
          title="Background image layer"
          open={openSections[2]}
          onToggle={() => toggleSection(2)}
          onReset={() => resetSection('backgroundImage')}
        >
          <div className="control-group">
            <label>Image over background</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackgroundImageChange}
            />
          </div>

          {config.backgroundImage && (
            <>
              <div className="control-group">
                <label>
                  Opacity: {Math.round(config.backgroundImageOpacity * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={Math.round(config.backgroundImageOpacity * 100)}
                  onChange={handleImageOpacityChange}
                />
              </div>

              <div className="control-group">
                <label>Blur: {config.backgroundImageBlur}px</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={config.backgroundImageBlur}
                  onChange={handleImageBlurChange}
                />
              </div>

              <div className="control-group">
                <label>Sizing mode</label>
                <select value={config.backgroundImageStretch} onChange={handleImageStretchChange}>
                  <option value="fit">Fit to scale (contain)</option>
                  <option value="stretch">Stretch to fit (cover)</option>
                  <option value="custom">Custom stretch (fill)</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px', marginTop: '16px' }}>
                <div className="control-group">
                  <label>Overlay scrim (for contrast)</label>
                  <small style={{ color: 'var(--mut)' }}>
                    Tints everything so titles stay readable.
                  </small>
                </div>

                <div className="control-group">
                  <label>
                    Scrim strength: {Math.round(config.backgroundImageScrim * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={Math.round(config.backgroundImageScrim * 100)}
                    onChange={handleImageScrimChange}
                  />
                </div>
              </div>
            </>
          )}
        </Accordion>

        {/* Section: Team Members */}
        <Accordion
          title="Team members"
          open={openSections[3]}
          onToggle={() => toggleSection(3)}
          onReset={() => resetSection('members')}
        >
          <div className="control-group">
            <label>Tile shadow: {config.memberShadow}%</label>
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={config.memberShadow}
              onChange={handleMemberShadowChange}
            />
          </div>

          <div className="control-group">
            <label>Number of members (1–20)</label>
            <select value={config.teamMembersCount} onChange={handleTeamMembersCountChange}>
              {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Tile font</label>
            <select value={config.memberFont} onChange={handleMemberFontChange}>
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>Tile name size: {config.memberFontSize}px</label>
            <input
              type="range"
              min="12"
              max="45"
              step="1"
              value={config.memberFontSize}
              onChange={handleMemberFontSizeChange}
            />
          </div>

          <div className="member-list">
            {config.teamMembers.map((member, idx) => (
              <div key={member.id} className="member-card">
                <div className="member-card-top">
                  <span className="member-card-number">{idx + 1}</span>
                  <div
                    className="member-card-thumb"
                    style={{
                      background: member.image ? 'transparent' : '#2c313a',
                    }}
                  >
                    {member.image ? (
                      <img src={member.image} alt={member.name} />
                    ) : (
                      initials(member.name)
                    )}
                  </div>
                  <label style={{ flex: 1, cursor: 'pointer', fontSize: '11px', fontWeight: 600, padding: '7px 10px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        handleMemberImageChange(member.id, e.target.files?.[0], member.shape)
                        e.target.value = ''
                      }}
                      style={{ display: 'none' }}
                    />
                    {member.image ? 'Change photo' : 'Photo'}
                  </label>
                </div>

                <div className="member-card-controls">
                  <input
                    type="text"
                    placeholder="Name"
                    value={member.name}
                    onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={member.role}
                    onChange={(e) => handleMemberChange(member.id, 'role', e.target.value)}
                  />

                  <div className="member-shape-buttons">
                    {['round', 'rounded', 'sharp'].map((shape) => (
                      <button
                        key={shape}
                        className={`${member.shape === shape ? 'active' : ''}`}
                        onClick={() => handleMemberChange(member.id, 'shape', shape)}
                      >
                        {shape === 'round' ? 'Round' : shape === 'rounded' ? 'Rounded' : 'Sharp'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Accordion>

        {/* Section: Tech Stack */}
        <Accordion
          title="Tech stack bar"
          open={openSections[4]}
          onToggle={() => toggleSection(4)}
          onReset={() => resetSection('tech')}
        >
          <div className="control-group">
            <label>Bar height: {config.techBarHeight}px</label>
            <input
              type="range"
              min="80"
              max="220"
              step="2"
              value={config.techBarHeight}
              onChange={handleTechBarHeightChange}
            />
          </div>

          <div className="control-group">
            <label>
              Icon size: {config.techIconScale}% of bar (
              {Math.round((config.techBarHeight * config.techIconScale) / 100)}px)
            </label>
            <input
              type="range"
              min="20"
              max="90"
              step="1"
              value={config.techIconScale}
              onChange={handleTechIconScaleChange}
            />
          </div>

          <div className="control-group">
            <label>Number of technologies (1–10)</label>
            <select value={config.techStackCount} onChange={handleTechStackCountChange}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label className="toggle-row">
              <input
                type="checkbox"
                checked={config.techShowName}
                onChange={handleTechShowNameChange}
              />
              <span>Show tech names</span>
            </label>
          </div>

          {config.techShowName && (
            <div className="control-group">
              <label>Tech name size: {config.techNameSize}px</label>
              <input
                type="range"
                min="8"
                max="40"
                step="1"
                value={config.techNameSize}
                onChange={handleTechNameSizeChange}
              />
            </div>
          )}

          <div className="tech-stack-list">
            {config.techStack.map((tech, idx) => (
              <div key={tech.id} className="tech-card">
                <div className="tech-card-top">
                  <span className="tech-card-number">{idx + 1}</span>
                  <div
                    className="tech-card-thumb"
                    style={{
                      background: tech.image ? 'transparent' : '#2c313a',
                    }}
                  >
                    {tech.image ? (
                      <img src={tech.image} alt={`tech ${idx + 1}`} />
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <label style={{ flex: 1, cursor: 'pointer', fontSize: '11px', fontWeight: 600, padding: '7px 10px' }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleTechImageChange(tech.id, e.target.files?.[0])}
                      style={{ display: 'none' }}
                    />
                    {tech.image ? 'Change icon' : 'Upload icon'}
                  </label>
                </div>

                {config.techShowName && (
                  <input
                    type="text"
                    placeholder="Tech name"
                    value={tech.name}
                    onChange={(e) => handleTechChange(tech.id, 'name', e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </Accordion>
      </div>

      {crop && (
        <ImageCropper
          src={crop.src}
          shape={crop.shape}
          onCancel={() => setCrop(null)}
          onSave={handleCropSave}
        />
      )}
    </div>
  )
}

function Accordion({ title, open, onToggle, onReset, children }) {
  const handleReset = (e) => {
    e.stopPropagation()
    onReset()
  }

  return (
    <div className={`control-section ${open ? 'open' : ''}`}>
      <div className="control-section-header">
        <button className="control-section-toggle" onClick={onToggle}>
          {title}
        </button>
        {onReset && (
          <button
            className="control-section-reset"
            onClick={handleReset}
            title="Reset section to default"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 2.6-6.4L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        )}
        <button className="control-section-chevron" onClick={onToggle}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="control-section-body">{children}</div>
    </div>
  )
}

function initials(name) {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase()
}

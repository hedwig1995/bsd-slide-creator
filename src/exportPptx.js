import PptxGenJS from 'pptxgenjs'

// 16:9 widescreen slide in inches (matches the 1920×1080 poster aspect ratio).
const SLIDE_W = 13.333
const SLIDE_H = 7.5

// Build a single-slide .pptx whose only content is the rendered poster image,
// sized to fill the entire slide, and trigger a download.
export async function exportPptx(imageDataUrl, fileName) {
  const pptx = new PptxGenJS()
  pptx.defineLayout({ name: 'BSD_16x9', width: SLIDE_W, height: SLIDE_H })
  pptx.layout = 'BSD_16x9'

  const slide = pptx.addSlide()
  slide.addImage({ data: imageDataUrl, x: 0, y: 0, w: SLIDE_W, h: SLIDE_H })

  await pptx.writeFile({ fileName: `${fileName}.pptx` })
}

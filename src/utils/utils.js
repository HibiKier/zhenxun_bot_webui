// 获取字体大小，根据屏幕大小调整
export function getFontSize(fontSize, maxSize = 100) {
  const windowHeight = window.innerHeight
  if (!window.innerHeight) {
    return fontSize
  }
  return Math.min(fontSize * (windowHeight / 1024), maxSize)
}

export function getConvertSize(size, w = 768) {
  const windowHeight = window.innerHeight
  if (!window.innerHeight) {
    return size
  }
  return size * (windowHeight / w)
}

export function getHeaderHeight() {
  return 85
}

export function isMobile() {
  const userAgent = navigator.userAgent.toLowerCase()

  // 更全面的移动设备检测（包括 iPad、Surface Duo 等）
  const isMobileUA =
    /android|webos|iphone|ipod|ipad|blackberry|iemobile|opera mini|mobile|tablet|kindle|silk|playbook|windows phone|bb10|meego|ucbrowser|samsungbrowser/i.test(
      userAgent
    )

  // 屏幕宽度检测（通常移动端 < 992px，可根据需求调整）
  const isSmallScreen = window.innerWidth < 992

  // 如果 UA 匹配移动端，或者屏幕宽度较小，则认为是移动端
  return isMobileUA || isSmallScreen
}

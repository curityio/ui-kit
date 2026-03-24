export function isMobileDevice() {
  if (typeof window === 'undefined') {
    return false;
  }

  const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;
  const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;

  const userAgent = navigator.userAgent;
  const isMobileUA = /Mobi|Opera Mini|Android|BlackBerry|iPhone|iPad|iPod/i.test(userAgent);

  return (isTouchPrimary && isSmallScreen) || isMobileUA;
}

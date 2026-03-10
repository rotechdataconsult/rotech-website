/**
 * Extract YouTube video ID from any YouTube URL format:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://www.youtube.com/embed/VIDEO_ID
 */
export function getYouTubeId(url) {
  if (!url) return null
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /\/embed\/([^?&#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function getThumbnail(url) {
  const id = getYouTubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

export function getEmbedUrl(url) {
  const id = getYouTubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export function isValidYouTubeUrl(url) {
  return !!getYouTubeId(url)
}

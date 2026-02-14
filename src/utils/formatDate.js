import { formatDistanceToNow, format } from 'date-fns'

export function formatDateRelative(date) {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return 'Unknown date'
  }
}

export function formatDateFull(date) {
  try {
    return format(new Date(date), 'MMM d, yyyy')
  } catch {
    return 'Unknown date'
  }
}

export function formatDateWithTime(date) {
  try {
    return format(new Date(date), 'MMM d, yyyy h:mm a')
  } catch {
    return 'Unknown date'
  }
}

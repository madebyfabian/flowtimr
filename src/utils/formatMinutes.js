/**
 * @param {number} val Takes any amount of minutes (e.g. "150")
 * @returns A user-readable string (e.g. "2 Std, 30 min", or "40 min")
 */
export default ( val, type = 'long' ) => {
  let hours = Math.trunc(val / 60),
      minutes = val % 60
  
  if (hours && type === 'short') 
    return `${(Math.round((val / 60) * 4) / 4).toLocaleString()} Std`
  
  let str = `${minutes} min`
  if (hours) 
    str = `${hours} Std` + (minutes ? `, ${minutes} min` : '')

  return str
}
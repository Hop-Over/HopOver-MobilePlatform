export function getTime(dateSent) {
  const monthes = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const msgLastDate = new Date(dateSent * 1000)
  const msgYear = msgLastDate.getFullYear()
  const msgMonth = msgLastDate.getMonth()
  const msgDate = msgLastDate.getDate()
  const msgDay = msgLastDate.getDay()
  const msgHours = msgLastDate.getHours()
  const msgMinutes = msgLastDate.getMinutes()
  const LastDate = new Date()
  const curYear = LastDate.getFullYear()
  const curMonth = LastDate.getMonth()
  const curDate = LastDate.getDate()
  const curDay = LastDate.getDay()

  if (curYear > msgYear) {
    return `${monthes[msgMonth]} ${msgDate}, ${msgYear}`
  } else if (curMonth > msgMonth) {
    return `${monthes[msgMonth]} ${msgDate}`
  } else if (curDate > (msgDate + 6)) {
    return `${monthes[msgMonth]} ${msgDate}`
  } else if (curDay > msgDay) {
    return `${days[msgDay]}`
  } else {
    return `${(msgHours > 12) ? msgHours - 12 : (msgHours)}:${(msgMinutes > 9) ? msgMinutes : ('0' + msgMinutes)} ${(msgHours >= 12) ? "PM" : "AM"}`
  }
}

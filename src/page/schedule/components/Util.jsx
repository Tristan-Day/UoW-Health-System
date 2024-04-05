function toTwoDigits(digit) {
  if (digit < 10) {
    return '0' + digit
  }

  return digit
}

function incrementDate(date) {
  let newDate = new Date(date)
  return newDate.setDate(newDate.getDate() + 1)
}

function decrementDate(date) {
  let newDate = new Date(date)
  return newDate.setDate(newDate.getDate() - 1)
}

class DIRECTION {
  static PREVIOUS = '-'
  static NEXT = '+'
}

export { toTwoDigits, incrementDate, decrementDate, DIRECTION }

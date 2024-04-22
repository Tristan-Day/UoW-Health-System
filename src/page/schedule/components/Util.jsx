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

function getWindowWidth() {
  //cannot be contained in a component
  return window.innerWidth
}

function getWindowHeight() {
  //cannot be contained in a component
  return window.innerHeight
}

export { toTwoDigits, incrementDate, decrementDate, getWindowWidth, getWindowHeight, DIRECTION }

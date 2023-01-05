class Calculator {
  userInput = []

  addValue(value) {
    this.userInput.push(value)
  }

  getResult() {
    return this.userInput
  }
}

const calculator = new Calculator()

class Input {
  input = document.querySelector('input')

  addDigit(digit) {
    this.input.value = this.input.value + digit
  }

  getValue() {
    return this.input.value
  }

  resetValue() {
    this.input.value = ''
  }
}

const input = new Input()

const buttons = document.querySelectorAll('button')
const buttonsArray = Array.from(buttons)
const buttonsDigit = buttonsArray.filter((button) => {
  return !isNaN(+button.value) || button.value === '.'
})

buttonsDigit.forEach((button) => {
  button.addEventListener('click',(event) => {
    input.addDigit(event.target.value)
  })
})

const operations = ['+', '-', '*', '/']
const buttonsOperations = buttonsArray.filter((button) => {
  return operations.includes(button.value)
})

buttonsOperations.forEach((button) => {
  button.addEventListener('click', (event) => {
    calculator.addValue(input.getValue())
    calculator.addValue(event.target.value)
    input.resetValue()
  })
})

const buttonEquals = buttonsArray.find((button) => button.value === '=')
buttonEquals.addEventListener('click', () => {
  calculator.addValue(input.getValue())
  console.log(calculator.getResult())
})

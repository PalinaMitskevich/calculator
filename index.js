class Calculator {
  userInput = []

  addValue(value) {
    const lastValue = this.userInput[this.userInput.length - 1]
    if (!isNaN(value) && !isNaN(lastValue)) {
      this.userInput[this.userInput.length - 1] = value
      return
    }
    this.userInput.push(value)
  }

  updateLastValue(value) {
    this.userInput[this.userInput.length - 1] = value
  }

  getUserInput() {
    return this.userInput
  }

  #roundResult(value) {
    const [integer, fraction] = String(value).split('.')
    if (fraction && fraction.length > 8) {
      return value.toFixed(8)
    }
    return value
  }

  calculate() {
    const [operand1, operator, operand2] = this.userInput
    this.resetUserInput()

    switch (operator) {
      case '-': this.userInput.push(this.#roundResult(+operand1 - +operand2))
        break
      case '+': this.userInput.push(this.#roundResult(+operand1 + +operand2))
        break
      case '*': this.userInput.push(this.#roundResult(+operand1 * +operand2))
        break
      case '/': this.userInput.push(this.#roundResult(+operand1 / +operand2))
        break
    }
  }

  changeOperand(value, changer) {
    switch (changer) {
      case '±': return value * -1
      case '%': return this.#roundResult(value * 0.01)
      case '√': return this.#roundResult(Math.sqrt(value))
    }
  }

  resetUserInput() {
    this.userInput = []
  }
}

const calculator = new Calculator()

class Input {
  input = document.querySelector('.result')
  history = document.querySelector('.history')

  addDigit(digit) {
    this.input.value = this.input.value + digit
  }

  getValue() {
    return this.input.value
  }

  setValue(value) {
    this.input.value = value
  }

  resetValue() {
    this.input.value = ''
  }

  resetHistory() {
    this.history.value = ''
  }

  setHistory(value) {
    this.history.value = value
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
    if (event.target.value === '.' && (input.getValue() === '' || input.getValue().split(".").length >= 2)) {
      return
    }
    input.addDigit(event.target.value)
  })
})

const operations = ['+', '-', '*', '/']
const buttonsOperations = buttonsArray.filter((button) => {
  return operations.includes(button.value)
})

buttonsOperations.forEach((button) => {
  button.addEventListener('click', (event) => {
    if(input.getValue()) {
      calculator.addValue(input.getValue())
    }
    const userInput = calculator.getUserInput()
    const isLastOperation = operations.includes(userInput[userInput.length - 1])

    if (userInput.length === 0) {
      return
    }
    if (isLastOperation) {
      calculator.updateLastValue(event.target.value)
      const [operand, operator] = calculator.getUserInput()
      input.setHistory(`${operand} ${operator}`)
      return
    }
    if(calculator.getUserInput().length === 3) {
      calculator.calculate()
      calculator.addValue(event.target.value)
      const [operand, operator] = calculator.getUserInput()
      input.setHistory(`${operand} ${operator}`)
      input.resetValue()
      return
    }
    calculator.addValue(event.target.value)
    if(input.getValue()) {
      input.setHistory(`${input.getValue()} ${event.target.value}`)
    } else {
      const [result] = calculator.getUserInput()
      input.setHistory(`${result} ${event.target.value}`)
    }
    input.resetValue()
  })
})

const buttonEquals = buttonsArray.find((button) => button.value === '=')
buttonEquals.addEventListener('click', () => {
  if (input.getValue()) {
    calculator.addValue(input.getValue())
  }
  if (calculator.getUserInput().length === 3) {
    calculator.calculate()
    const [result] = calculator.getUserInput()
    input.setHistory(result)
    input.resetValue()
  }
})

const buttonReset = buttonsArray.find((button) => button.value ==='AC')
buttonReset.addEventListener('click', () => {
  input.resetValue()
  input.resetHistory()
  calculator.resetUserInput()
})

const operandChangers = ['±', '%', '√']
const buttonsOperandChangers = buttonsArray.filter((button) => {
  return operandChangers.includes(button.value)
})

buttonsOperandChangers.forEach((button) => {
  button.addEventListener('click', (event) => {
    const currentValue = input.getValue()

    if (currentValue) {
      if (event.target.value === '√'&& currentValue < 0) {
        return
      }
      const result = calculator.changeOperand(currentValue, event.target.value)
      input.setValue(result)
    }
  })
})

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

document.addEventListener('keydown', (event) => {
  event.preventDefault()

  if (event.key === 'Enter' || event.key === '=') {
    buttonEquals.click()
  }
  if (digits.includes(event.key)) {
    const digit = event.key[event.key.length - 1]
    const button = buttonsDigit.find((button) => button.value === digit)
    button.click()
  }
  if (event.key === '+') {
    const add = buttonsOperations.find((button) => button.value === '+')
    add.click()
  }
  if (event.key === '-') {
    const subtrack = buttonsOperations.find((button) => button.value === '-')
    subtrack.click()
  }
  if (event.key === '*') {
    const multiply = buttonsOperations.find((button) => button.value === '*')
    multiply.click()
  }
  if (event.key === '/') {
    const divide = buttonsOperations.find((button) => button.value === '/')
    divide.click()
  }
  if (event.key === '%') {
    const percent = buttonsArray.find((button) => button.value === '%')
    percent.click()
  }
  if (event.key === 'Escape' || event.key === "Delete" || event.code === 'Backspace') {
    buttonReset.click()
  }
  if (event.key === ',' || event.key === '.') {
    const comma = buttonsArray.find((button) => button.value === '.')
    comma.click()
  }
})
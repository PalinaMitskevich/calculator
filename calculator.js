class Calculator {
  userInput = []

  addValue(value) {
    this.userInput.push(value)
  }

  getUserInput() {
    return this.userInput
  }

  calculate() {
    const num1 = this.userInput[0]
    const num2 = this.userInput[2]
    const operator = this.userInput[1]
    this.userInput = []

    switch (operator) {
      case '-': this.userInput.push(+num1 - +num2)
        break
      case '+': this.userInput.push(+num1 + +num2)
        break
      case '*': this.userInput.push(+num1 * +num2)
        break
      case '/': this.userInput.push(+num1 / +num2)
        break
    }
  }

  changeOperand(changer) {
    switch (changer) {
      case '±':
        this.#setLastOperand(this.#getLastOperand() * -1)
        break
      case '%':
        this.#setLastOperand(this.#getLastOperand() * 0.01)
        break
      case '√':
        this.#setLastOperand(Math.sqrt(this.#getLastOperand()))
        break
    }
  }

  #setLastOperand(value) {
    const num1 = this.userInput[0]
    const num2 = this.userInput[2]
    if(num2) {
      this.userInput[2] = value
      return
    }
    if(num1) {
      this.userInput[0] = value
      return
    }
  }

  #getLastOperand() {
    const num1 = this.userInput[0]
    const num2 = this.userInput[2]
    if(num2) {
      return num2
    }
    if(num1) {
      return num1
    }
  }

  resetUserInput() {
    this.userInput = []
  }
}

const calculator = new Calculator()

class Input {
  resultInput = document.querySelector('.result')
  historyInput = document.querySelector('.history')

  addDigit(digit) {
    this.resultInput.value = this.resultInput.value + digit
  }

  getValue() {
    return this.resultInput.value
  }

  resetResultValue() {
    this.resultInput.value = ''
  }

  resetHistoryValue() {
    this.historyInput.value = ''
  }

  setHistory(value) {
    this.historyInput.value = value
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
    if(input.getValue()) {
      calculator.addValue(input.getValue())
    }

    if(calculator.getUserInput().length === 3) {
      calculator.calculate()
      calculator.addValue(event.target.value)
      const [operand, operator] = calculator.getUserInput()
      input.setHistory(`${operand} ${operator}`)
      input.resetResultValue()
      return
    }
    calculator.addValue(event.target.value)
    if(input.getValue()) {
      input.setHistory(`${input.getValue()} ${event.target.value}`)
    } else {
      const [result] = calculator.getUserInput()
      input.setHistory(`${result} ${event.target.value}`)
    }
    input.resetResultValue()
  })
})

const buttonEquals = buttonsArray.find((button) => button.value === '=')
buttonEquals.addEventListener('click', () => {
  calculator.addValue(input.getValue())
  calculator.calculate()
  const [result] = calculator.getUserInput()
  input.setHistory(result)
  input.resetResultValue()
})

const buttonReset = buttonsArray.find((button) => button.value ==='AC')
buttonReset.addEventListener('click', () => {
  input.resetResultValue()
  input.resetHistoryValue()
  calculator.resetUserInput()
})

const operandChangers = ['±', '%', '√']
const buttonsOperandChangers = buttonsArray.filter((button) => {
  return operandChangers.includes(button.value)
})

buttonsOperandChangers.forEach((button) => {
  button.addEventListener('click', (event) => {
    calculator.changeOperand(event.target.value)
    console.log(calculator.getUserInput())
  })
})
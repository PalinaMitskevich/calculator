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

  resetValue() {
    this.resultInput.value = ''
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
    calculator.addValue(input.getValue())
    if(calculator.getUserInput().length === 3) {
      calculator.calculate()
      calculator.addValue(event.target.value)
      const [operand, operator] = calculator.getUserInput()
      input.setHistory(`${operand} ${operator}`)
      input.resetValue()
      return
    }
    calculator.addValue(event.target.value)
    console.log(calculator.getUserInput())
    input.setHistory(`${input.getValue()} ${event.target.value}`)
    input.resetValue()
  })
})

const buttonEquals = buttonsArray.find((button) => button.value === '=')
buttonEquals.addEventListener('click', () => {
  calculator.addValue(input.getValue())
  console.log(calculator.getUserInput())
})

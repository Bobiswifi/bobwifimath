class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.memory = 0;
        this.history = [];
        
        this.init();
    }

    init() {
        this.previousOperandElement = document.getElementById('previousOperand');
        this.currentOperandElement = document.getElementById('currentOperand');
        this.historyList = document.getElementById('historyList');
        // Add event listeners
        document.querySelectorAll('.number').forEach(button => {
            button.addEventListener('click', () => this.appendNumber(button.innerText));
        });

        document.querySelectorAll('.operation').forEach(button => {
            const action = button.dataset.action;
            if (['add', 'subtract', 'multiply', 'divide', 'percentage'].includes(action)) {
                button.addEventListener('click', () => this.chooseOperation(action));
            }
        });

        // Special buttons
        document.querySelector('[data-action="equals"]').addEventListener('click', () => this.calculate());
        document.querySelector('[data-action="clear"]').addEventListener('click', () => this.clear());
        document.querySelector('[data-action="backspace"]').addEventListener('click', () => this.backspace());
        
        // Memory operations
        document.querySelector('[data-action="memory-clear"]').addEventListener('click', () => this.memoryClear());
        document.querySelector('[data-action="memory-recall"]').addEventListener('click', () => this.memoryRecall());
        document.querySelector('[data-action="memory-add"]').addEventListener('click', () => this.memoryAdd());
        document.querySelector('[data-action="memory-subtract"]').addEventListener('click', () => this.memorySubtract());

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.calculate();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    calculate() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.showError();
                    return;
                }
                computation = prev / current;
                break;
            case 'percentage':
                computation = (prev * current) / 100;
                break;
            default:
                return;
        }

        // Add to history
        this.addToHistory(`${prev} ${this.getOperationSymbol(this.operation)} ${current} = ${computation}`);

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    getOperationSymbol(operation) {
        const symbols = {
            add: '+',
            subtract: '−',
            multiply: '×',
            divide: '÷',
            percentage: '%'
        };
        return symbols[operation] || '';
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    backspace() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        this.updateDisplay();
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation) {
            this.previousOperandElement.innerText = 
                `${this.previousOperand} ${this.getOperationSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    showError() {
        this.currentOperandElement.classList.add('error');
        this.currentOperand = 'Error';
        this.updateDisplay();
        setTimeout(() => {
            this.currentOperandElement.classList.remove('error');
            this.clear();
        }, 2000);
    }

    // Memory functions
    memoryClear() {
        this.memory = 0;
    }

    memoryRecall() {
        this.currentOperand = this.memory.toString();
        this.updateDisplay();
    }

    memoryAdd() {
        this.memory += parseFloat(this.currentOperand) || 0;
    }

    memorySubtract() {
        this.memory -= parseFloat(this.currentOperand) || 0;
    }

    // History functions
    addToHistory(calculation) {
        this.history.unshift(calculation);
        if (this.history.length > 10) {
            this.history.pop();
        }
        this.updateHistory();
    }

    updateHistory() {
        this.historyList.innerHTML = this.history
            .map(calc => `<div class="history-item">${calc}</div>`)
            .join('');
    }

    // Keyboard support
    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9' || e.key === '.') {
            e.preventDefault();
            this.appendNumber(e.key);
        }
        if (e.key === '+') {
            e.preventDefault();
            this.chooseOperation('add');
        }
        if (e.key === '-') {
            e.preventDefault();
            this.chooseOperation('subtract');
        }
        if (e.key === '*') {
            e.preventDefault();
            this.chooseOperation('multiply');
        }
        if (e.key === '/') {
            e.preventDefault();
            this.chooseOperation('divide');
        }
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.calculate();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            this.clear();
        }
        if (e.key === 'Backspace') {
            e.preventDefault();
            this.backspace();
        }
    }
}

// Initialize calculator
const calculator = new Calculator();
import './simple-generator.scss';
import quotes from '../../common/scripts/simpleQuotes';
import randomIndexGenerator from '../../common/scripts/randomIndexGenerator';

class SimpleGenerator {
  constructor() {
    this.init();
  }

  setupDOMReferences() {
    this.simpleQuoteText = document.querySelector('.simple-generator__quote');
    this.button = document.querySelector('.simple-generator__button');
  }
  setupEvents() {
    this.button.addEventListener('click', () => this.quoteGenerator());
  }

  quoteGenerator() {
    this.fragmentOne = quotes[0][randomIndexGenerator(quotes)];
    this.fragmentTwo = quotes[1][randomIndexGenerator(quotes)];
    this.fragmentThree = quotes[2][randomIndexGenerator(quotes)];
    this.simpleQuoteText.innerHTML = `\"${this.fragmentOne} ${this.fragmentTwo} ${this.fragmentThree}\"`;
  }

  init() {
    this.setupDOMReferences();
    this.setupEvents();
  }
}

export default SimpleGenerator;

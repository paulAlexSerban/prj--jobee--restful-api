import "./custom-generator.scss";
import travelQuotes from "../../common/scripts/travelQuotes";
import learnQuotes from "../../common/scripts/learnQuotes";
import randomIndexGenerator from "../../common/scripts/randomIndexGenerator";

class CustomGenerator {
  constructor() {
    this.quoteType = learnQuotes;
    this.init();
  }

  setupDOMRefrences() {
    this.switchButton = document.querySelector(".switch-button");
    this.quotesContainer = document.querySelector(".custom-generator__quotes");
    this.generatorButtons = document.querySelectorAll(".custom-generator__button");
    this.removeButton = document.querySelector(".button__base--remove");
  }

  setupEvents() {
    this.generatorButtons.forEach(button => button.addEventListener("click", event => (
      this.multipleInit(event.target.dataset.quotes))
    ))
    this.switchButton.addEventListener("click", () => this.quoteTypeSwitch());
    this.removeButton.addEventListener("click", () => this.removeQuotes());
  }

  quoteRepeater(times) {
    for (let i = 1; i <= times; i += 1) {
      this.createQuoteParagraph();
    }
  }

  createQuoteParagraph() {
    this.quoteText = document.createElement("p");
    this.quotesContainer.appendChild(this.quoteText);
    this.fragmentOne = this.quoteType[0][randomIndexGenerator(this.quoteType)];
    this.fragmentTwo = this.quoteType[1][randomIndexGenerator(this.quoteType)];
    this.fragmentThree = this.quoteType[2][randomIndexGenerator(this.quoteType)];
    this.quoteText.innerHTML = `\" ${this.fragmentOne} ${this.fragmentTwo} ${this.fragmentThree} \"`;
  }

  quoteTypeSwitch() {
    if (this.switchButton.checked == true) {
      this.quoteType = travelQuotes;
    } else {
      this.quoteType = learnQuotes;
    }
  }

  removeQuotes() {
    this.quotesContainer.innerHTML = "";
  }

  multipleInit(quoteCount) {
    this.removeQuotes();
    this.quoteRepeater(quoteCount);
  }

  init() {
    this.setupDOMRefrences();
    this.setupEvents();
  }
}

export default CustomGenerator;
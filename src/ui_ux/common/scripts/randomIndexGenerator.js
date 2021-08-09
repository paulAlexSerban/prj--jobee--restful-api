const randomIndexGenerator = (quotes) => {
  let randomIndex;
  for (let i = 0; i < quotes.length; i += 1) {
      randomIndex = Math.floor(Math.random() * quotes[i].length);
  }
  return randomIndex;
}

export default randomIndexGenerator;
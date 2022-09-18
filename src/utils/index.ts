export const isEmpty = (text: string) => text.trim() === "";
export const hasDash = (text: string) => text.includes("-");
export const hasTwoParts = (text: string) => text.split(" ").length === 2;

const yields = ["Achtung!", "Oju eh?", "EH!", "Eeeooo!", "PSSST!"];
export const getRandomYield = (): string =>
  yields[Math.floor(Math.random() * yields.length)];

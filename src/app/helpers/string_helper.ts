const numbersOnly = (value: string = ""): string => {
  return value.replace(/\D/g, "");
};

export { numbersOnly };

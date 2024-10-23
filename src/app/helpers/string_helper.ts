/** Substitui tudo o que não é digito, mantendo somente os números */
const numbersOnly = (value: string = ""): string => {
  return value.replace(/\D/g, "");
};

export { numbersOnly };

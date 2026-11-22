const base = "/images/categorias/";

const covers: Record<string, string> = {
  "Programação FrontEnd": "frontend",
  "Banco de Dados": "banco-de-dados",
  "Estatística": "estatistica",
  "Machine Learning": "machine-learning",
  "Programação Orientada a Objetos": "poo",
  "Inglês": "ingles",
  "UX/UI Design": "ux-ui",
};

export function coverFor(subject: string): string {
  return `${base}${covers[subject] ?? "frontend"}.svg`;
}

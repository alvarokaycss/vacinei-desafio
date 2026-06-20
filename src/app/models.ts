export interface Vacina {
  id: number;
  nome: string;
  descricao: string;
}

export interface FaixaEtaria {
  id: number;
  nome: string;
  idadeMinMeses: number;
  idadeMaxMeses: number;
}

export interface VacinaEsperada {
  vacinaId: number;
  dose: number;
}

export interface CalendarioVacinal {
  id: number;
  faixaEtariaId: number;
  vacinasEsperadas: VacinaEsperada[];
}

export interface Campanha {
  id: number;
  nome: string;
  dataInicio: string;
  dataFim: string;
  faixaEtariaAlvoId: number;
  vacinaId: number;
  descricao: string;
}

export interface VacinaAplicada {
  vacinaId: number;
  dose: number;
  dataAplicacao: string;
}

export interface Crianca {
  id: number;
  nome: string;
  dataNascimento: string;
  vacinasAplicadas: VacinaAplicada[];
}

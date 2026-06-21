import { Injectable } from '@angular/core';
import { Crianca, Vacina, FaixaEtaria, CalendarioVacinal, Campanha } from '../models';

@Injectable({
  providedIn: 'root'
})
export class VacinaService {

  // -----------------------------------------------
  // BANCO DE DADOS MOCKADO (Referência do SUS)
  // Dados fixos — iguais para todas as crianças
  // -----------------------------------------------

  readonly vacinas: Vacina[] = [
    { id: 1, nome: "BCG", descricao: "Previne formas graves de tuberculose." },
    { id: 2, nome: "Hepatite B", descricao: "Previne a transmissão e infecção do vírus da Hepatite B." },
    { id: 3, nome: "Pentavalente", descricao: "Previne Difteria, Tétano, Coqueluche, Hepatite B e Meningite por Hib." },
    { id: 4, nome: "VIP/VOP (Pólio)", descricao: "Vacina contra a paralisia infantil." },
    { id: 5, nome: "Rotavírus", descricao: "Previne diarreia grave causada por rotavírus." },
    { id: 6, nome: "Pneumocócica 10V", descricao: "Previne pneumonia, meningite e otite." },
    { id: 7, nome: "Meningocócica C", descricao: "Previne infecções graves por meningococo." },
    { id: 8, nome: "Febre Amarela", descricao: "Previne a Febre Amarela." },
    { id: 9, nome: "Tríplice Viral", descricao: "Previne Sarampo, Caxumba e Rubéola." },
    { id: 10, nome: "DTP", descricao: "Reforço contra Difteria, Tétano e Coqueluche." }
  ];

  readonly faixasEtarias: FaixaEtaria[] = [
    { id: 1, nome: "Ao Nascer",  idadeMinMeses: 0,  idadeMaxMeses: 1  },
    { id: 2, nome: "2 Meses",   idadeMinMeses: 2,  idadeMaxMeses: 3  },
    { id: 3, nome: "4 Meses",   idadeMinMeses: 4,  idadeMaxMeses: 5  },
    { id: 4, nome: "6 Meses",   idadeMinMeses: 6,  idadeMaxMeses: 7  },
    { id: 5, nome: "9 Meses",   idadeMinMeses: 9,  idadeMaxMeses: 11 },
    { id: 6, nome: "12 Meses",  idadeMinMeses: 12, idadeMaxMeses: 14 },
    { id: 7, nome: "15 Meses",  idadeMinMeses: 15, idadeMaxMeses: 17 },
    { id: 8, nome: "4 Anos",    idadeMinMeses: 48, idadeMaxMeses: 59 }
  ];

  readonly calendarios: CalendarioVacinal[] = [
    { id: 1, faixaEtariaId: 1, vacinasEsperadas: [{ vacinaId: 1, dose: 1 }, { vacinaId: 2, dose: 1 }] },
    { id: 2, faixaEtariaId: 2, vacinasEsperadas: [{ vacinaId: 3, dose: 1 }, { vacinaId: 4, dose: 1 }, { vacinaId: 5, dose: 1 }, { vacinaId: 6, dose: 1 }] },
    { id: 3, faixaEtariaId: 3, vacinasEsperadas: [{ vacinaId: 3, dose: 2 }, { vacinaId: 4, dose: 2 }, { vacinaId: 5, dose: 2 }, { vacinaId: 6, dose: 2 }] },
    { id: 4, faixaEtariaId: 4, vacinasEsperadas: [{ vacinaId: 3, dose: 3 }, { vacinaId: 4, dose: 3 }, { vacinaId: 6, dose: 3 }] },
    { id: 5, faixaEtariaId: 5, vacinasEsperadas: [{ vacinaId: 8, dose: 1 }] },
    { id: 6, faixaEtariaId: 6, vacinasEsperadas: [{ vacinaId: 7, dose: 2 }, { vacinaId: 9, dose: 1 }] },
    { id: 7, faixaEtariaId: 7, vacinasEsperadas: [{ vacinaId: 10, dose: 1 }] },
    { id: 8, faixaEtariaId: 8, vacinasEsperadas: [{ vacinaId: 10, dose: 2 }, { vacinaId: 4, dose: 4 }] }
  ];

  readonly campanhas: Campanha[] = [
    { id: 1, nome: "Campanha Nacional contra Gripe Influenza", dataInicio: "2026-06-01", dataFim: "2026-07-31", faixaEtariaAlvoId: 5, vacinaId: 5, descricao: "Prevenção contra as principais cepas de gripe deste ano." },
    { id: 2, nome: "Campanha de Intensificação Sarampo/Tríplice", dataInicio: "2026-05-15", dataFim: "2026-06-30", faixaEtariaAlvoId: 6, vacinaId: 9, descricao: "Derrubando o avanço do sarampo na primeira infância." }
  ];

  // -----------------------------------------------
  // DADOS INDIVIDUAIS DAS CRIANÇAS
  // Mutáveis — individuais de cada perfil
  // -----------------------------------------------
  criancas: Crianca[] = [
    {
      id: 1,
      nome: "Bia Santos",
      dataNascimento: "2026-04-19", // 2 meses. Faixa de 2 meses = disponível
      vacinasAplicadas: [
        // Ao Nascer (ok)
        { vacinaId: 1, dose: 1, dataAplicacao: "2026-04-20" },
        { vacinaId: 2, dose: 1, dataAplicacao: "2026-04-20" },
        // 2 Meses (tomou quase todas, falta SÓ 1 para ficar disponível)
        { vacinaId: 3, dose: 1, dataAplicacao: "2026-06-19" },
        { vacinaId: 4, dose: 1, dataAplicacao: "2026-06-19" },
        { vacinaId: 5, dose: 1, dataAplicacao: "2026-06-19" }
        // Faltou a vacinaId 6 (Pneumocócica), então fica 1 Disponível!
      ]
    },
    {
      id: 2,
      nome: "Arthur Rezende",
      dataNascimento: "2025-07-19", // 11 meses.
      vacinasAplicadas: [
        // Ao Nascer
        { vacinaId: 1, dose: 1, dataAplicacao: "2025-07-20" },
        { vacinaId: 2, dose: 1, dataAplicacao: "2025-07-20" },
        // 2 Meses
        { vacinaId: 3, dose: 1, dataAplicacao: "2025-09-20" },
        { vacinaId: 4, dose: 1, dataAplicacao: "2025-09-20" },
        { vacinaId: 5, dose: 1, dataAplicacao: "2025-09-20" },
        { vacinaId: 6, dose: 1, dataAplicacao: "2025-09-20" },
        // 4 Meses
        { vacinaId: 3, dose: 2, dataAplicacao: "2025-11-20" },
        { vacinaId: 4, dose: 2, dataAplicacao: "2025-11-20" },
        { vacinaId: 5, dose: 2, dataAplicacao: "2025-11-20" },
        { vacinaId: 6, dose: 2, dataAplicacao: "2025-11-20" },
        // 6 Meses (A dose máxima era 7 meses de idade)
        { vacinaId: 3, dose: 3, dataAplicacao: "2026-01-20" },
        { vacinaId: 4, dose: 3, dataAplicacao: "2026-01-20" },
        // => FALTANDO: { vacinaId: 6, dose: 3 } (Pneumocócica). Como ele tem 11 meses, ela está genuinamente ATRASADA!
        // 9 Meses (A dose máxima é 11 meses)
        { vacinaId: 8, dose: 1, dataAplicacao: "2026-04-20" }
      ]
    },
    {
      id: 3,
      nome: "Leo",
      dataNascimento: "2026-05-19", // 1 mês de vida
      vacinasAplicadas: [
        // Completamente Saudável / Em Dia
        { vacinaId: 1, dose: 1, dataAplicacao: "2026-05-20" },
        { vacinaId: 2, dose: 1, dataAplicacao: "2026-05-20" }
      ]
    }
  ];

  // -----------------------------------------------
  // MÉTODOS DE ACESSO AOS DADOS
  // -----------------------------------------------

  getCriancas(): Crianca[] {
    return this.criancas;
  }

  getCriancaById(id: number): Crianca | undefined {
    return this.criancas.find(c => c.id === id);
  }

  getVacinaById(id: number): Vacina | undefined {
    return this.vacinas.find(v => v.id === id);
  }

  getFaixaEtariaById(id: number): FaixaEtaria | undefined {
    return this.faixasEtarias.find(f => f.id === id);
  }

  addCrianca(crianca: Crianca): void {
    crianca.id = this.criancas.length + 1;
    this.criancas.push(crianca);
  }

  updateCrianca(criancaAtualizada: Crianca): void {
    const idx = this.criancas.findIndex(c => c.id === criancaAtualizada.id);
    if (idx !== -1) this.criancas[idx] = criancaAtualizada;
  }

  deleteCrianca(id: number): void {
    this.criancas = this.criancas.filter(c => c.id !== id);
  }

  // Marca ou desmarca uma vacina no histórico da criança
  toggleVacina(criancaId: number, vacinaId: number, dose: number, dataAplicacao: string): void {
    const crianca = this.getCriancaById(criancaId);
    if (!crianca) return;

    const index = crianca.vacinasAplicadas.findIndex(
      v => v.vacinaId === vacinaId && v.dose === dose
    );

    if (index !== -1) {
      // Se já tem, remove (desmarca)
      crianca.vacinasAplicadas.splice(index, 1);
    } else {
      // Se não tem, adiciona (marca como aplicada)
      crianca.vacinasAplicadas.push({
        vacinaId,
        dose,
        dataAplicacao
      });
    }
  }

  // Motor de status vacinal — centralizado aqui para ser reutilizado em qualquer tela
  evaluateVaccineStatus(child: Crianca, referenceDate: string) {
    const simDate = new Date(referenceDate);
    const birthDate = new Date(child.dataNascimento);
    const ageInMonths = Math.floor(
      Math.abs(simDate.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)
    );

    let totals = { emDia: 0, atencao: 0, atrasada: 0 };

    this.faixasEtarias.forEach(faixa => {
      if (ageInMonths >= faixa.idadeMinMeses) {
        const cal = this.calendarios.find(c => c.faixaEtariaId === faixa.id);
        if (cal) {
          cal.vacinasEsperadas.forEach(esp => {
            const aplicada = child.vacinasAplicadas.find(
              a => a.vacinaId === esp.vacinaId && a.dose === esp.dose
            );
            if (aplicada) {
              totals.emDia++;
            } else {
              if (ageInMonths <= faixa.idadeMaxMeses) {
                totals.atencao++;
              } else {
                totals.atrasada++;
              }
            }
          });
        }
      }
    });

    return {
      ageInMonths,
      totals,
      overallStatus: totals.atrasada > 0 ? 'ATRASADA' : (totals.atencao > 0 ? 'ATENCAO' : 'EM_DIA')
    };
  }
}

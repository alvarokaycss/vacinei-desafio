import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Crianca, Vacina, FaixaEtaria, CalendarioVacinal, Campanha } from '../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {
  constructor(private router: Router){}
  // Estado Atual do App (usamos uma data fixa simulada para nosso mockup fazer sentido)
  currentDateStr = "2026-06-19";
  currentScreen = "home";

  // Banco de Dados Estático (Mock do SUS)
  vacinas: Vacina[] = [
    { id: 1, nome: "BCG", descricao: "Previne formas graves de tuberculose." },
    { id: 2, nome: "Hepatite B", descricao: "Previne a transmissão e infecção do vírus." },
    { id: 3, nome: "Pentavalente", descricao: "Previne Difteria, Tétano, Coqueluche e Hepatite B." },
    { id: 4, nome: "VIP/VOP (Pólio)", descricao: "Vacina contra a paralisia infantil." },
    { id: 6, nome: "Pneumocócica 10V", descricao: "Previne pneumonia e meningite." },
    { id: 7, nome: "Meningocócica C", descricao: "Previne infecções por meningococo." },
    { id: 8, nome: "Febre Amarela", descricao: "Prevenção contra a Febre Amarela." },
    { id: 9, nome: "Tríplice Viral", descricao: "Previne Sarampo, Caxumba e Rubéola." },
    { id: 10, nome: "DTP", descricao: "Reforço contra Difteria, Tétano e Coqueluche." }
  ];

  faixasEtarias: FaixaEtaria[] = [
    { id: 1, nome: "Ao Nascer", idadeMinMeses: 0, idadeMaxMeses: 1 },
    { id: 2, nome: "2 Meses", idadeMinMeses: 2, idadeMaxMeses: 3 },
    { id: 3, nome: "3 Meses", idadeMinMeses: 3, idadeMaxMeses: 4 },
    { id: 8, nome: "12 Meses", idadeMinMeses: 12, idadeMaxMeses: 14 }
  ];

  calendarios: CalendarioVacinal[] = [
    { id: 1, faixaEtariaId: 1, vacinasEsperadas: [{ vacinaId: 1, dose: 1 }, { vacinaId: 2, dose: 1 }] },
    { id: 2, faixaEtariaId: 2, vacinasEsperadas: [{ vacinaId: 3, dose: 1 }, { vacinaId: 4, dose: 1 }] }
  ];

  campanhas: Campanha[] = [
    { id: 1, nome: "Campanha Nacional contra Gripe", dataInicio: "2026-06-01", dataFim: "2026-07-31", faixaEtariaAlvoId: 8, vacinaId: 9, descricao: "Prevenção contra as principais cepas de gripe deste ano." }
  ];

  // Nossas crianças cadastradas para teste
  children: Crianca[] = [
    {
      id: 1,
      nome: "Bia Santos",
      dataNascimento: "2026-04-19", // 2 meses de idade na data simulada
      vacinasAplicadas: [
        { vacinaId: 1, dose: 1, dataAplicacao: "2026-04-20" }
      ]
    },
    {
      id: 2,
      nome: "Arthur Rezende",
      dataNascimento: "2025-07-19", // 11 meses de idade na data simulada
      vacinasAplicadas: [
        { vacinaId: 1, dose: 1, dataAplicacao: "2025-07-20" }
      ]
    }
  ];

  ngOnInit() {}

  // ----------------------------------------------------
  // Motor Computacional de Status (O coração da sua avaliação)
  // ----------------------------------------------------
  evaluateVaccineStatus(child: Crianca) {
    const simDate = new Date(this.currentDateStr);
    const birthDate = new Date(child.dataNascimento);

    // Calcula idade exata em meses
    const diffTime = Math.abs(simDate.getTime() - birthDate.getTime());
    const ageInMonths = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 30.4375));

    let totals = { emDia: 0, atencao: 0, atrasada: 0 };

    this.faixasEtarias.forEach(faixa => {
      // Verifica só as faixas etárias que a criança já atingiu ou passou
      if (ageInMonths >= faixa.idadeMinMeses) {
        const cal = this.calendarios.find(c => c.faixaEtariaId === faixa.id);

        if (cal) {
          cal.vacinasEsperadas.forEach(esp => {
            // A criança tomou essa vacina exata e essa dose exata?
            const aplicada = child.vacinasAplicadas.find(a => a.vacinaId === esp.vacinaId && a.dose === esp.dose);

            if (aplicada) {
              totals.emDia++;
            } else {
              // Se não tomou, está no prazo (atenção) ou já passou (atrasada)?
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

  // Utilitário para formatar a idade na tela (ex: "2 meses", "1 ano")
  formatAge(months: number): string {
    if (months === 0) return "Recém-nascido(a)";
    if (months < 12) return `${months} meses`;
    const yrs = Math.floor(months / 12);
    return `${yrs} ${yrs === 1 ? 'ano' : 'anos'}`;
  }

  // Função simples para navegar entre os "estados" das telas
  // Agora a função aceita um ID opcional
  navigateTo(screen: string, childId?: number) {
    if (screen === 'perfil' && childId) {
      this.router.navigate(['/perfil', childId]);
    } else {
      this.router.navigate(['/' + screen]);
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonContent } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { VacinaService } from '../services/vacina';
import { Campanha, Crianca } from '../models';

@Component({
  selector: 'app-campanhas',
  templateUrl: './campanhas.page.html',
  styleUrls: ['./campanhas.page.scss'],
  standalone: true,
  imports: [IonHeader, IonContent, CommonModule, FormsModule],
  styles: [':host { display: flex; flex-direction: column; position: absolute; inset: 0; }']
})
export class CampanhasPage implements OnInit {

  currentDateStr = '2026-06-19';
  campanhas: Campanha[] = [];
  criancas: Crianca[] = [];

  constructor(
    private vacinaService: VacinaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.campanhas = this.vacinaService.campanhas;
    this.criancas = this.vacinaService.getCriancas();
  }

  isCampanhaAtiva(campanha: Campanha): boolean {
    const hoje = new Date(this.currentDateStr);
    const inicio = new Date(campanha.dataInicio);
    const fim = new Date(campanha.dataFim);
    return hoje >= inicio && hoje <= fim;
  }

  // Retorna os filhos elegíveis com base na faixa etária alvo da campanha
  getFilhosElegiveis(campanha: Campanha): Crianca[] {
    const faixa = this.vacinaService.getFaixaEtariaById(campanha.faixaEtariaAlvoId);
    if (!faixa) return [];

    return this.criancas.filter(crianca => {
      const nascimento = new Date(crianca.dataNascimento);
      const hoje = new Date(this.currentDateStr);
      const idadeEmMeses = Math.floor(
        Math.abs(hoje.getTime() - nascimento.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)
      );
      return idadeEmMeses >= faixa.idadeMinMeses && idadeEmMeses <= faixa.idadeMaxMeses;
    });
  }

  formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}

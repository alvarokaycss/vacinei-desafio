import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { VacinaService } from '../services/vacina';
import { Crianca, VacinaAplicada, CalendarioVacinal, FaixaEtaria } from '../models';

// Interface local para exibição na tela de perfil
interface VacinaStatus {
  vacinaId: number;
  nome: string;
  descricao: string;
  dose: number;
  faixaNome: string;
  status: 'EM_DIA' | 'ATENCAO' | 'DISPONIVEL' | 'ATRASADA';
  dataAplicacao?: string;
}

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonHeader, IonContent, CommonModule, FormsModule],
  styles: [':host { display: flex; flex-direction: column; position: absolute; inset: 0; }']
})
export class PerfilPage implements OnInit {

  currentDateStr = '2026-06-19';
  crianca: Crianca | undefined;
  vacinasStatus: VacinaStatus[] = [];
  filtroAtivo: 'todas' | 'atrasadas' | 'historico' = 'todas';
  statusGeral: 'EM_DIA' | 'ATENCAO' | 'ATRASADA' = 'EM_DIA';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vacinaService: VacinaService
  ) {}

  ngOnInit() {
    // Lê o :id da URL para saber qual criança exibir
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.crianca = this.vacinaService.getCriancaById(id);
    if (this.crianca) {
      this.buildVacinasStatus(this.crianca);
    }
  }

  // Constrói a lista completa de vacinas com status para exibição
  buildVacinasStatus(crianca: Crianca) {
    const hoje = new Date(this.currentDateStr);
    const nascimento = new Date(crianca.dataNascimento);
    const idadeEmMeses = Math.floor(
      Math.abs(hoje.getTime() - nascimento.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)
    );

    this.vacinasStatus = [];

    this.vacinaService.faixasEtarias.forEach((faixa: FaixaEtaria) => {
      if (idadeEmMeses < faixa.idadeMinMeses) return;

      const cal = this.vacinaService.calendarios.find(
        (c: CalendarioVacinal) => c.faixaEtariaId === faixa.id
      );
      if (!cal) return;

      cal.vacinasEsperadas.forEach(esp => {
        const vacina = this.vacinaService.getVacinaById(esp.vacinaId);
        if (!vacina) return;

        const aplicada = crianca.vacinasAplicadas.find(
          (a: VacinaAplicada) => a.vacinaId === esp.vacinaId && a.dose === esp.dose
        );

        let status: VacinaStatus['status'];
        if (aplicada) {
          status = 'EM_DIA';
        } else if (idadeEmMeses <= faixa.idadeMaxMeses) {
          status = 'DISPONIVEL';
        } else {
          status = 'ATRASADA';
        }

        this.vacinasStatus.push({
          vacinaId: vacina.id,
          nome: vacina.nome,
          descricao: vacina.descricao,
          dose: esp.dose,
          faixaNome: faixa.nome,
          status,
          dataAplicacao: aplicada?.dataAplicacao
        });
      });
    });

    // Define o status geral da criança
    const temAtrasada = this.vacinasStatus.some(v => v.status === 'ATRASADA');
    const temDisponivel = this.vacinasStatus.some(v => v.status === 'DISPONIVEL');
    this.statusGeral = temAtrasada ? 'ATRASADA' : temDisponivel ? 'ATENCAO' : 'EM_DIA';
  }

  // Retorna as vacinas filtradas de acordo com o filtro ativo
  get vacinasFiltradas(): VacinaStatus[] {
    if (this.filtroAtivo === 'atrasadas') {
      return this.vacinasStatus.filter(v => v.status === 'ATRASADA' || v.status === 'DISPONIVEL');
    }
    if (this.filtroAtivo === 'historico') {
      return this.vacinasStatus.filter(v => v.status === 'EM_DIA');
    }
    return this.vacinasStatus;
  }

  // Agrupa vacinas por faixa etária para exibição em seções
  get vacinasAgrupadasPorFaixa(): { faixa: string; vacinas: VacinaStatus[] }[] {
    const grupos: { [key: string]: VacinaStatus[] } = {};
    this.vacinasFiltradas.forEach(v => {
      if (!grupos[v.faixaNome]) grupos[v.faixaNome] = [];
      grupos[v.faixaNome].push(v);
    });
    return Object.keys(grupos).map(faixa => ({ faixa, vacinas: grupos[faixa] }));
  }

  // Conta pendências (atrasadas + disponíveis) para o badge
  get totalPendencias(): number {
    return this.vacinasStatus.filter(v => v.status === 'ATRASADA' || v.status === 'DISPONIVEL').length;
  }

  formatAge(dataNasc: string): string {
    const hoje = new Date(this.currentDateStr);
    const nasc = new Date(dataNasc);
    const meses = Math.floor(Math.abs(hoje.getTime() - nasc.getTime()) / (1000 * 60 * 60 * 24 * 30.4375));
    if (meses === 0) return 'Recém-nascido(a)';
    if (meses < 12) return `${meses} meses`;
    const anos = Math.floor(meses / 12);
    return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  }

  formatDate(dateStr: string): string {
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  }

  toggleVacina(v: VacinaStatus) {
    if (!this.crianca) return;
    this.vacinaService.toggleVacina(this.crianca.id, v.vacinaId, v.dose, this.currentDateStr);
    // Recalcula o status para atualizar a tela imediatamente
    this.buildVacinasStatus(this.crianca);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  goToEdit() {
    this.router.navigate(['/cadastro'], { queryParams: { id: this.crianca?.id } });
  }
}

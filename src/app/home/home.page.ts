import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { VacinaService } from '../services/vacina';
import { Crianca } from '../models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class HomePage implements OnInit {

  currentDateStr = '2026-06-19';
  children: Crianca[] = [];

  constructor(
    private router: Router,
    private vacinaService: VacinaService
  ) {}

  ngOnInit() {
    // Carrega as crianças do Service (fonte única de dados)
    this.children = this.vacinaService.getCriancas();
  }

  // Delega o cálculo de status para o Service (sem duplicar lógica)
  getStatus(child: Crianca) {
    return this.vacinaService.evaluateVaccineStatus(child, this.currentDateStr);
  }

  // Verifica se alguma criança tem vacina atrasada (para o alerta global)
  hasAnyDelayed(): boolean {
    return this.children.some(c => this.getStatus(c).totals.atrasada > 0);
  }

  formatAge(months: number): string {
    if (months === 0) return 'Recém-nascido(a)';
    if (months < 12) return `${months} meses`;
    const yrs = Math.floor(months / 12);
    return `${yrs} ${yrs === 1 ? 'ano' : 'anos'}`;
  }

  navigateTo(screen: string, childId?: number) {
    if (screen === 'perfil' && childId) {
      this.router.navigate(['/perfil', childId]);
    } else {
      this.router.navigate(['/' + screen]);
    }
  }
}

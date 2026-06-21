import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonContent } from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VacinaService } from '../services/vacina';
import { Crianca } from '../models';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonHeader, IonContent, CommonModule, FormsModule],
  styles: [':host { display: flex; flex-direction: column; position: absolute; inset: 0; }']
})
export class CadastroPage implements OnInit {

  // Modo da tela: 'criar' ou 'editar'
  modo: 'criar' | 'editar' = 'criar';
  criancaId: number | null = null;

  // Campos do formulário
  nome: string = '';
  dataNascimento: string = '';

  // Estado de validação
  erroNome: string = '';
  erroData: string = '';
  salvoComSucesso: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vacinaService: VacinaService
  ) {}

  ngOnInit() {
    // Se vier com ?id=X na URL, estamos no modo edição
    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam) {
      this.modo = 'editar';
      this.criancaId = Number(idParam);
      const crianca = this.vacinaService.getCriancaById(this.criancaId);
      if (crianca) {
        this.nome = crianca.nome;
        this.dataNascimento = crianca.dataNascimento;
      }
    }
  }

  // Valida os campos e salva (cria ou edita)
  salvar() {
    this.erroNome = '';
    this.erroData = '';

    if (!this.nome.trim()) {
      this.erroNome = 'Por favor, informe o nome completo.';
      return;
    }
    if (!this.dataNascimento) {
      this.erroData = 'Por favor, informe a data de nascimento.';
      return;
    }

    const hoje = new Date();
    const dataNasc = new Date(this.dataNascimento);
    if (dataNasc > hoje) {
      this.erroData = 'A data de nascimento não pode ser no futuro.';
      return;
    }

    if (this.modo === 'criar') {
      const novaCrianca: Crianca = {
        id: 0, // O Service atribui o ID real
        nome: this.nome.trim(),
        dataNascimento: this.dataNascimento,
        vacinasAplicadas: []
      };
      this.vacinaService.addCrianca(novaCrianca);
    } else if (this.modo === 'editar' && this.criancaId) {
      const criancaAtualizada = this.vacinaService.getCriancaById(this.criancaId);
      if (criancaAtualizada) {
        criancaAtualizada.nome = this.nome.trim();
        criancaAtualizada.dataNascimento = this.dataNascimento;
        this.vacinaService.updateCrianca(criancaAtualizada);
      }
    }

    this.salvoComSucesso = true;
    setTimeout(() => this.router.navigate(['/home']), 1200);
  }

  // Exclui o perfil e volta para a Home
  excluir() {
    if (this.criancaId) {
      this.vacinaService.deleteCrianca(this.criancaId);
      this.router.navigate(['/home']);
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}

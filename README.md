# Vacinei

🌍 **[Acesse a aplicação ao vivo clicando aqui!](https://vacinei-desafio.vercel.app/)**

Este projeto é a minha submissão para o Desafio de Estágio Frontend. O objetivo foi criar uma aplicação web para facilitar o acompanhamento da caderneta de vacinação infantil, baseada no calendário do SUS.

## 🛠 O que usei
*   **Angular 17+ (Standalone):** Optei por usar a estrutura standalone para deixar o código mais limpo e sem a necessidade de vários NgModules.
*   **Ionic Framework:** Para aproveitar os componentes de interface e ter uma cara de aplicativo de celular mesmo rodando no navegador.
*   **Tailwind CSS:** Usei para a estilização principal. Foi um desafio legal fazer o Tailwind conversar bem com os componentes padrão do Ionic, mas ajudou muito na responsividade.

## 📱 Principais Funcionalidades
*   **Controle de Status:** O app calcula sozinho a idade da criança e cruza com as faixas etárias do SUS. Com isso, ele avisa se a vacina está em dia, disponível para tomar ou atrasada.
*   **Interação:** É possível marcar e desmarcar as vacinas direto no perfil da criança. Quando uma vacina pendente é marcada, os alertas visuais somem na hora.
*   **Campanhas:** Uma aba simulando campanhas do governo. A lista filtra automaticamente quais crianças cadastradas têm a idade certa para participar da campanha.
*   **Dados Mockados:** Criei um `VacinaService` com dados fictícios de 3 crianças para facilitar os testes (uma com dose atrasada, uma com dose disponível e uma totalmente em dia).

## 🧠 Aprendizados
Apesar de ter usado IA para me ajudar a estruturar e debugar partes complexas (como os conflitos entre o roteador do Ionic e o Angular Standalone), o projeto me ensinou muito sobre como organizar regras de negócio no frontend e como pensar na usabilidade (UX) antes de escrever o código. Garantir que as informações fizessem sentido real para o usuário final foi um excelente exercício.

## 🚀 Como rodar o projeto

Você vai precisar do [Node.js](https://nodejs.org/en/) e do [Ionic CLI](https://ionicframework.com/docs/cli) instalados na sua máquina.

1. Clone o repositório.
2. Na pasta do projeto (`vacinei`), instale as dependências:
   ```bash
   npm install
   ```
3. Rode o servidor de desenvolvimento:
   ```bash
   ionic serve
   ```
O projeto vai abrir no seu navegador (geralmente em `http://localhost:8100`). Recomendo abrir o Inspecionar Elemento (F12) e colocar no modo de visualização de celular para ver a responsividade correta.

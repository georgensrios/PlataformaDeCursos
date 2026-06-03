# 🌊 EduFlow - Plataforma Educacional PWA

![Licença](https://img.shields.io/github/license/seu-usuario/seu-repositorio?style=flat-glowing)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-7952B3?style=flat&logo=bootstrap&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)

O **EduFlow** é uma aplicação web focada na experiência de aprendizado online, desenvolvida como um Front-End para um aplicativo **PWA (Progressive Web App)**. O sistema permite que o usuário navegue por módulos e aulas, acompanhe seu progresso de forma dinâmica, marque aulas como concluídas e faça anotações personalizadas.

Este projeto foi desenvolvido como **Atividade Complementar Avaliativa (OAT2)** para a matéria de **Front-End** do curso de **Sistemas de Informação** no **Centro Universitário de Excelência - UNEX** (Unidade de Feira de Santana - BA).

---

## 👨‍🏫 Orientação Acadêmica
*   **Instituição:** Centro Universitário de Excelência - UNEX (Feira de Santana)
*   **Curso:** Sistemas de Informação
*   **Matéria:** Desenvolvimento Front-End
*   **Professor Orientador:** Ramon Paixão
*   **Atividade:** OAT2 (Atividade Complementar Avaliativa)

---

## 🎯 Funcionalidades Solicitadas e Implementadas

O projeto cumpre integralmente os requisitos de escopo definidos pelo professor:

- [x] **Arquitetura de Plataforma Educacional:** Organização fluida dividida em tela de Login, visualização de Módulos e tela de Player de Aula.
- [x] **Controle de Progresso Individual:** Opção para marcar/desmarcar aulas como "assistidas" através de um switch intuitivo.
- [x] **Barra de Progresso Dinâmica:** Indicador visual e percentual na Home que se atualiza automaticamente em tempo real à medida que o aluno avança nas aulas.
- [x] **Bloco de Anotações Pessoais:** Espaço dedicado para o aluno digitar seus insights, códigos e dúvidas por aula.
- [x] **Persistência de Dados com `LocalStorage`:** Todo o progresso do aluno (aulas assistidas e textos de anotações) é salvo automaticamente no navegador. Ao fechar e reabrir a plataforma, o estado dos estudos é mantido exatamente de onde parou.
- [x] **Interface Otimizada para Mobile (PWA):** Design responsivo pensado primeiramente na usabilidade em telas de toque (Mobile-First).

---

## 🛠️ Tecnologias Utilizadas

A pilha de tecnologia foi selecionada com foco em performance nativa, sem a necessidade de frameworks pesados de terceiros, garantindo leveza para o conceito PWA:

*   **HTML5:** Estrutura semântica refinada e tags de acessibilidade (WAI-ARIA) para leitores de tela.
*   **Bootstrap 5.3.3:** Sistema de grid fluido e componentes utilitários responsivos para estilização ágil.
*   **Remix Icon (v3.5.0):** Conjunto moderno de ícones vetoriais de alta resolução.
*   **JavaScript (ES6+):** Lógica de manipulação do DOM, controle de estado da aplicação e integração com a API de armazenamento.
*   **Web Storage API (`LocalStorage`):** Mecanismo de persistência de dados no lado do cliente.

---

## 📂 Estrutura do Projeto

A organização dos arquivos segue os padrões modernos de arquitetura web:

```text
├── assets/
│   ├── icone/
│   │   └── flow-ico.svg      # Ícone/Logo personalizado do EduFlow
├── index.html                # Arquivo principal contendo as telas estruturadas
├── script.js                 # Toda a inteligência, manipulação do DOM e LocalStorage
├── style.css                 # Customizações e refinamentos visuais de comportamento
└── README.md                 # Documentação do projeto

<div align="center">

  <img src="src/assets/SOFTCOMP-Logo-horizontal.png" alt="SOFTCOMP Logo" width="280" />

  # ⚙️ Calculadora de Peso Teórico de Metais & Polímeros

  **Módulo Industrial de Engenharia para ERP**

  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
  [![Status](https://img.shields.io/badge/Status-Produção-brightgreen?style=for-the-badge)]()

  <p align="center">
    Ferramenta de alta velocidade operacional desenhada por Eduardo Bielecky para a equipe de suporte da Softcomp Sistemas.
  </p>

</div>

---

## 📌 Sumário
- [Sobre o Projeto](#-sobre-o-projeto)
- [Módulo Autônomo Single-File (Para Incorporar em Websites)](#-módulo-autônomo-single-file-para-incorporar-em-websites)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Catálogo de Geometrias](#-catálogo-de-geometrias-14)
- [Biblioteca de Materiais](#-biblioteca-de-materiais-30)
- [Esquema Técnico 3D Interativo](#-esquema-técnico-3d-interativo)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Executar](#-como-executar)
- [Especificação Matemática](#-especificação-matemática)
- [Licença](#-licença)

---

## 🚀 Sobre o Projeto

A **Calculadora de Peso Teórico de Metais** da **SOFTCOMP** é um módulo frontend moderno em React + Vite criado para integrar diretamente aos fluxos de **Cotações, Vendas e Ordens de Produção (PCP)** de sistemas ERP industriais.

### 🌟 Destaques de UX/UI
- **Operação por Atalhos de Teclado**: Navegação ultra-rápida via <kbd>Tab</kbd>, <kbd>Enter</kbd> (para injetar no ERP) e <kbd>Esc</kbd> (para cancelar).
- **Digitação Limpa (Do Zero)**: Todos os campos de dimensão começam limpos sem placeholders para evitar erros operacionais.
- **Conversão Automática de Frações**: Aceita decimais (ex: `12.7`) e converte automaticamente frações em polegadas (ex: `1/2"`, `3/8`, `1 1/2`) para milímetros ($mm$).
- **Resultado Instantâneo**: Cálculo dinâmico em tempo real de Volume ($mm^3$), Volume ($cm^3$), Peso Unitário ($kg$), e Peso Total com Margem de Perda ($kg$), com 3 casas decimais para peças abaixo de 1 kg.

---

## 🌐 Módulo Autônomo Single-File (Para Incorporar em Websites)

Caso você deseje utilizar e incorporar esta calculadora inteira em **seu próprio website, e-commerce, portal de clientes, intranet ou Landing Page**, o projeto disponibiliza uma versão **Single-File Standalone** (arquivo único `.html` totalmente independente).

### ⚡ Benefícios da Versão Standalone (`standalone/index.html`):
- **100% Autônomo e Independente**: Todo o código React, CSS, ícones, Esquema Técnico 3D, lógica matemática e logotipos em Base64 estão gravados dentro de um **único arquivo HTML**.
- **Zero Dependências de Servidor**: Não exige Node.js, npm ou infraestrutura backend.
- **Instalação em Qualquer Website**: Basta copiar o arquivo `standalone/index.html` para a pasta do seu site ou incorporá-lo usando uma tag `<iframe>`:
  ```html
  <iframe src="caminho/para/standalone/index.html" width="100%" height="900px" frameborder="0"></iframe>
  ```
- **Execução Offline por Duplo Clique**: Funciona perfeitamente em qualquer computador mesmo totalmente sem internet e abrindo direto pelo navegador (`file://`).

> 💡 **Como regerar a versão standalone**:  
> Se alterar o código do projeto e quiser atualizar a versão autônoma de arquivo único, basta rodar:
> ```bash
> node scripts/build_standalone.js
> ```

---

## ✨ Funcionalidades Principais

| Recurso | Descrição |
| :--- | :--- |
| 🎲 **Visualizador 3D Isométrico** | Modelo 3D vetorial SVG que reorienta a câmera ($X, Y, Z$) e ilumina a cota ativa (Comprimento, Diâmetro, Largura, Espessura). |
| 🛡️ **Guardrails Físicos Automáticos** | Validação em tempo real impedindo geometrias impossíveis ($D_{int} \ge D_{ext}$, $e \ge A$, $2tf \ge H$). |
| 📐 **Conversão Automática de Frações** | Identifica frações de polegada (ex: `1/2"`, `3/8`, `1 1/2`) e converte instantaneamente para milímetros ($mm$). |
| 📦 **Margem de Perda** | Configuração rápida de percentual de retalho/perda ($0\% \text{ a } 30\%$). |
| 📝 **Gerador de Nomenclatura Comercial** | Padronização automática de descrição para itens de cotação/pedido ERP. |

---

## 📐 Catálogo de Geometrias (14)

O sistema suporta **14 perfis geométricos industriais** organizados em 4 categorias principais:

```
├── 📄 Chapas & Bobinas
│   ├── Chapa / Bloco / Retalho (V = e × L × C)
│   └── Bobina / Tira / Fita (V = e × L × C)
│
├── 🔴 Barras Maciças
│   ├── Barra Redonda / Tarugo (V = π × D² / 4 × C)
│   ├── Barra Quadrada (V = A² × C)
│   ├── Barra Retangular / Chata (V = L × e × C)
│   └── Barra Sextavada (V = √3 / 2 × S² × C)
│
├── ⭕ Tubos & Buchas
│   ├── Tubo Redondo (V = π × (Dext - e) × e × C)
│   ├── Bucha / Tubo Mecânico (V = π × (Dext² - Dint²) / 4 × C)
│   ├── Tubo Quadrado (V = 4 × e × (A - e) × C)
│   └── Tubo Retangular (V = 2 × e × (A + B - 2e) × C)
│
└── 🏗️ Perfis Estruturais
    ├── Perfil L / Cantoneira (V = e × (2A - e) × C)
    ├── Perfil T (V = e × (A + B - e) × C)
    ├── Perfil U Dobrado (V = e × (H + 2B - 2e) × C)
    └── Perfil I / H - Viga (V = [2 × B × tf + (H - 2tf) × tw] × C)
```

---

## 🧪 Biblioteca de Materiais (30+)

Tabela de densidades ($\rho$) industriais cadastradas e editáveis:

- **Aços & Ferrosos**: Aço Carbono ($7.85$), Aço Inox 304 ($7.93$), Aço Inox 316 ($7.98$), Aço Ferramenta ($7.81$), Ferro Fundido ($7.15 \text{ a } 7.30$).
- **Ligas de Alumínio**: Alumínio Puro ($2.70$), 6061 ($2.70$), 7075 ($2.81$).
- **Ligas de Cobre & Latão**: Cobre Puro ($8.96$), Bronze Comum ($8.80$), Latão Amarelo ($8.47$).
- **Outros Metais**: Titânio Grau 5 ($4.43$), Chumbo ($11.34$), Ouro ($19.32$), Prata ($10.49$), Níquel ($8.90$).
- **Polímeros & Plásticos Técnicos**: PTFE Teflon ($2.20$), Nylon PA6 ($1.14$), Policarbonato PC ($1.20$), PVC Rígido ($1.40$), PEAD ($0.95$), PP ($0.90$), ABS ($1.05$).

---

## 🎲 Esquema Técnico 3D Interativo

O componente `TechnicalDiagram.jsx` oferece:
- **Câmera 3D Reclinável**: Ao focar no campo *Comprimento ($C$)*, o modelo ajusta o ângulo para demonstrar a extrusão longitudinal no eixo Z.
- **Rotação Manual**: Botão <kbd>Girar 3D</kbd> para girar o modelo em passos de $30^\circ$.
- **Modo 2D/3D**: Alternância rápida entre a perspectiva tridimensional e o desenho técnico de corte transversal.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: React 19 + Vite 8
- **Estilização**: Vanilla CSS3 com tokens de design (tema escuro grafite `#111214`, acentos cobre e aço)
- **Ícones**: Lucide React
- **Tipografia**: Google Fonts (*Plus Jakarta Sans*)

---

## 📁 Estrutura do Projeto

```
calculadora_metais/
├── index.html
├── package.json
├── README.md
├── scripts/
│   └── build_standalone.js     # Script compilador da versão HTML autônoma de arquivo único
├── standalone/
│   └── index.html              # Calculadora 100% autônoma em arquivo único para websites
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css            # Tokens, base e botões
│   ├── components.css       # Estilos dos componentes e regras responsivas
│   ├── assets/
│   │   ├── softcomp_logo.png
│   │   └── SOFTCOMP-Logo-horizontal.png
│   ├── components/
│   │   ├── Header.jsx           # Cabeçalho sticky com marca e seletores de liga/densidade
│   │   ├── ShapeSelector.jsx    # Cartões vetoriais de seleção de geometria
│   │   ├── CalculatorForm.jsx   # Formulário limpo de dimensões e quantidade com auto-conversão
│   │   ├── TechnicalDiagram.jsx # Esquema Técnico 3D isométrico e cotas
│   │   ├── ResultCard.jsx       # Painel de resultados em tempo real
│   │   └── FooterERP.jsx        # Rodapé com ações (Limpar / Enviar ao pedido) e marca Softcomp
│   ├── data/
│   │   ├── metals.js            # Tabela de materiais e densidades g/cm³
│   │   └── shapes.js            # Especificação JSON de geometrias e calculadores
│   └── utils/
│       └── calculations.js      # Calculador de peso, auto-conversor de frações e guardrails
```

---

## 💻 Como Executar

### Pré-requisitos
- Node.js `18+` instalado
- npm ou yarn

### Passos
1. **Clonar o repositório**:
   ```bash
   git clone https://github.com/seu-usuario/calculadora-metais-softcomp.git
   cd calculadora-metais-softcomp
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Executar ambiente de desenvolvimento**:
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:5173/`

4. **Gerar bundle de produção Web e Versão Standalone**:
   ```bash
   npm run build
   node scripts/build_standalone.js
   ```

---

## 🧮 Especificação Matemática

O peso teórico unitário ($P_{\text{unit}}$) em quilos ($kg$) é calculated por:

$$P_{\text{unit}} = \frac{V_{\text{mm}^3} \times \rho_{\text{g/cm}^3}}{1.000.000}$$

O peso total com margem de perda ($\% \text{perda}$) e quantidade ($N$):

$$P_{\text{total}} = P_{\text{unit}} \times N \times \left(1 + \frac{\%\text{perda}}{100}\right)$$

---

## 📄 Licença

Este projeto é disponibilizado sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <sub>Desenvolvido por Bielecky para <b>SOFTCOMP Tecnologia em Sistemas</b></sub>
</div>

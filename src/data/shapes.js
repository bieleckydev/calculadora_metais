export const GEOMETRIAS_SPEC = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "descricao": "Especificação de Geometrias para Cálculo de Peso Teórico de Metais",
  "unidades_padrao_input": "milímetros (mm)",
  "unidade_resultado_volume": "mm³",
  "observacao_calculo_peso": "Para obter o peso em quilogramas (kg): Peso = (Volume_mm3 * Densidade_g_cm3) / 1000000",
  "geometrias": [
    {
      "id": "chapa_bloco_retalho",
      "nome": "Chapa / Bloco / Retalho",
      "nome_curto": "Chapa",
      "categoria": "chapa",
      "icon": "Layers",
      "variaveis_entrada": [
        { "id": "espessura", "nome": "Espessura (e)", "unidade": "mm", "simbolo": "e", "default": 10 },
        { "id": "largura", "nome": "Largura (L)", "unidade": "mm", "simbolo": "L", "default": 100 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "espessura * largura * comprimento",
      "descricao_formula": "V = e × L × C"
    },
    {
      "id": "bobina",
      "nome": "Bobina / Tira / Fita",
      "nome_curto": "Bobina / Fita",
      "categoria": "chapa",
      "icon": "Disc",
      "variaveis_entrada": [
        { "id": "espessura", "nome": "Espessura (e)", "unidade": "mm", "simbolo": "e", "default": 1 },
        { "id": "largura", "nome": "Largura da Fita (L)", "unidade": "mm", "simbolo": "L", "default": 100 },
        { "id": "comprimento", "nome": "Comprimento Linear (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "espessura * largura * comprimento",
      "descricao_formula": "V = e × L × C"
    },
    {
      "id": "barra_redonda_tarugo",
      "nome": "Barra Redonda / Tarugo",
      "nome_curto": "Redonda",
      "categoria": "barra",
      "icon": "Circle",
      "variaveis_entrada": [
        { "id": "diametro", "nome": "Diâmetro (D)", "unidade": "mm", "simbolo": "D", "default": 50 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "(Math.PI * Math.pow(diametro, 2) / 4) * comprimento",
      "descricao_formula": "V = (π × D² / 4) × C"
    },
    {
      "id": "barra_quadrada",
      "nome": "Barra Quadrada",
      "nome_curto": "Quadrada",
      "categoria": "barra",
      "icon": "Square",
      "variaveis_entrada": [
        { "id": "lado", "nome": "Lado / Bitola (A)", "unidade": "mm", "simbolo": "A", "default": 40 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "Math.pow(lado, 2) * comprimento",
      "descricao_formula": "V = A² × C"
    },
    {
      "id": "barra_retangular_chata",
      "nome": "Barra Retangular / Chata",
      "nome_curto": "Barra Chata",
      "categoria": "barra",
      "icon": "RectangleHorizontal",
      "variaveis_entrada": [
        { "id": "largura", "nome": "Largura (L)", "unidade": "mm", "simbolo": "L", "default": 50 },
        { "id": "espessura", "nome": "Espessura (e)", "unidade": "mm", "simbolo": "e", "default": 10 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "largura * espessura * comprimento",
      "descricao_formula": "V = L × e × C"
    },
    {
      "id": "barra_sextavada",
      "nome": "Barra Sextavada",
      "nome_curto": "Sextavada",
      "categoria": "barra",
      "icon": "Hexagon",
      "variaveis_entrada": [
        { "id": "bitola", "nome": "Bitola / Entre Faces (S)", "unidade": "mm", "simbolo": "S", "default": 30 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "((Math.sqrt(3) / 2) * Math.pow(bitola, 2)) * comprimento",
      "descricao_formula": "V = (√3 / 2) × S² × C ≈ 0.866025 × S² × C"
    },
    {
      "id": "tubo_redondo",
      "nome": "Tubo Redondo",
      "nome_curto": "Tubo Red.",
      "categoria": "tubo",
      "icon": "Disc",
      "variaveis_entrada": [
        { "id": "diametro_externo", "nome": "Diâmetro Externo (Dext)", "unidade": "mm", "simbolo": "Dext", "default": 60 },
        { "id": "parede", "nome": "Espessura da Parede (e)", "unidade": "mm", "simbolo": "e", "default": 5 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "(Math.PI * (diametro_externo - parede) * parede) * comprimento",
      "descricao_formula": "V = π × (Dext - e) × e × C"
    },
    {
      "id": "bucha_tubo_mecanico",
      "nome": "Bucha / Tubo Mecânico",
      "nome_curto": "Bucha / Tubo",
      "categoria": "tubo",
      "icon": "CircleDot",
      "variaveis_entrada": [
        { "id": "diametro_externo", "nome": "Diâmetro Externo (Dext)", "unidade": "mm", "simbolo": "Dext", "default": 80 },
        { "id": "diametro_interno", "nome": "Diâmetro Interno (Dint)", "unidade": "mm", "simbolo": "Dint", "default": 50 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "((Math.PI * (Math.pow(diametro_externo, 2) - Math.pow(diametro_interno, 2))) / 4) * comprimento",
      "descricao_formula": "V = [π × (Dext² - Dint²) / 4] × C"
    },
    {
      "id": "tubo_quadrado",
      "nome": "Tubo Quadrado",
      "nome_curto": "Tubo Quad.",
      "categoria": "tubo",
      "icon": "Box",
      "variaveis_entrada": [
        { "id": "lado", "nome": "Lado / Bitola (A)", "unidade": "mm", "simbolo": "A", "default": 50 },
        { "id": "parede", "nome": "Espessura da Parede (e)", "unidade": "mm", "simbolo": "e", "default": 3 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "(4 * parede * (lado - parede)) * comprimento",
      "descricao_formula": "V = 4 × e × (A - e) × C"
    },
    {
      "id": "tubo_retangular",
      "nome": "Tubo Retangular",
      "nome_curto": "Tubo Ret.",
      "categoria": "tubo",
      "icon": "Maximize2",
      "variaveis_entrada": [
        { "id": "lado_maior", "nome": "Lado Maior (A)", "unidade": "mm", "simbolo": "A", "default": 80 },
        { "id": "lado_menor", "nome": "Lado Menor (B)", "unidade": "mm", "simbolo": "B", "default": 40 },
        { "id": "parede", "nome": "Espessura da Parede (e)", "unidade": "mm", "simbolo": "e", "default": 3 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "(2 * parede * (lado_maior + lado_menor - (2 * parede))) * comprimento",
      "descricao_formula": "V = 2 × e × (A + B - 2e) × C"
    },
    {
      "id": "perfil_l_cantoneira",
      "nome": "Perfil L / Cantoneira",
      "nome_curto": "Cantoneira L",
      "categoria": "perfil",
      "icon": "CornerDownRight",
      "variaveis_entrada": [
        { "id": "aba", "nome": "Largura da Aba (A)", "unidade": "mm", "simbolo": "A", "default": 50 },
        { "id": "espessura", "nome": "Espessura (e)", "unidade": "mm", "simbolo": "e", "default": 5 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "(espessura * (aba + (aba_b || aba) - espessura)) * comprimento",
      "descricao_formula": "V = e × (A + B - e) × C  [B = A se aba simétrica]"
    },
    {
      "id": "perfil_t",
      "nome": "Perfil T",
      "nome_curto": "Perfil T",
      "categoria": "perfil",
      "icon": "Split",
      "variaveis_entrada": [
        { "id": "mesa", "nome": "Largura da Mesa (A)", "unidade": "mm", "simbolo": "A", "default": 50 },
        { "id": "altura", "nome": "Altura do Perfil (B)", "unidade": "mm", "simbolo": "B", "default": 50 },
        { "id": "espessura", "nome": "Espessura (e)", "unidade": "mm", "simbolo": "e", "default": 5 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "(espessura * (mesa + altura - espessura)) * comprimento",
      "descricao_formula": "V = e × (A + B - e) × C"
    },
    {
      "id": "perfil_u",
      "nome": "Perfil U (Dobrado)",
      "nome_curto": "Perfil U",
      "categoria": "perfil",
      "icon": "UnfoldVertical",
      "variaveis_entrada": [
        { "id": "altura", "nome": "Altura / Alma (H)", "unidade": "mm", "simbolo": "H", "default": 80 },
        { "id": "aba", "nome": "Largura da Aba (B)", "unidade": "mm", "simbolo": "B", "default": 40 },
        { "id": "espessura", "nome": "Espessura (e)", "unidade": "mm", "simbolo": "e", "default": 4 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "(espessura * (altura + (2 * aba) - (2 * espessura))) * comprimento",
      "descricao_formula": "V = e × (H + 2B - 2e) × C"
    },
    {
      "id": "perfil_i_h",
      "nome": "Perfil I / Perfil H (Viga)",
      "nome_curto": "Viga I / H",
      "categoria": "perfil",
      "icon": "Columns",
      "variaveis_entrada": [
        { "id": "altura", "nome": "Altura do Perfil (H)", "unidade": "mm", "simbolo": "H", "default": 150 },
        { "id": "largura_aba", "nome": "Largura da Aba (B)", "unidade": "mm", "simbolo": "B", "default": 75 },
        { "id": "espessura_alma", "nome": "Espessura da Alma (tw)", "unidade": "mm", "simbolo": "tw", "default": 5 },
        { "id": "espessura_aba", "nome": "Espessura da Aba (tf)", "unidade": "mm", "simbolo": "tf", "default": 7 },
        { "id": "comprimento", "nome": "Comprimento (C)", "unidade": "mm", "simbolo": "C", "default": 1000 }
      ],
      "formula_volume_mm3": "((2 * largura_aba * espessura_aba) + ((altura - (2 * espessura_aba)) * espessura_alma)) * comprimento",
      "descricao_formula": "V = [2 × B × tf + (H - 2tf) × tw] × C"
    }
  ]
};

// Functions to compute volume for each geometry based on formula specs
const shapeCalculators = {
  chapa_bloco_retalho: ({ espessura, largura, comprimento }) => {
    const e = parseFloat(espessura) || 0;
    const L = parseFloat(largura) || 0;
    const C = parseFloat(comprimento) || 0;
    return e * L * C;
  },
  bobina: ({ espessura, largura, comprimento }) => {
    const e = parseFloat(espessura) || 0;
    const L = parseFloat(largura) || 0;
    const C = parseFloat(comprimento) || 0;
    return e * L * C;
  },
  barra_redonda_tarugo: ({ diametro, comprimento }) => {
    const D = parseFloat(diametro) || 0;
    const C = parseFloat(comprimento) || 0;
    return (Math.PI * Math.pow(D, 2) / 4) * C;
  },
  barra_quadrada: ({ lado, comprimento }) => {
    const A = parseFloat(lado) || 0;
    const C = parseFloat(comprimento) || 0;
    return Math.pow(A, 2) * C;
  },
  barra_retangular_chata: ({ largura, espessura, comprimento }) => {
    const L = parseFloat(largura) || 0;
    const e = parseFloat(espessura) || 0;
    const C = parseFloat(comprimento) || 0;
    return L * e * C;
  },
  barra_sextavada: ({ bitola, comprimento }) => {
    const S = parseFloat(bitola) || 0;
    const C = parseFloat(comprimento) || 0;
    return ((Math.sqrt(3) / 2) * Math.pow(S, 2)) * C;
  },
  tubo_redondo: ({ diametro_externo, parede, comprimento }) => {
    const Dext = parseFloat(diametro_externo) || 0;
    const e = parseFloat(parede) || 0;
    const C = parseFloat(comprimento) || 0;
    return (Math.PI * (Dext - e) * e) * C;
  },
  bucha_tubo_mecanico: ({ diametro_externo, diametro_interno, comprimento }) => {
    const Dext = parseFloat(diametro_externo) || 0;
    const Dint = parseFloat(diametro_interno) || 0;
    const C = parseFloat(comprimento) || 0;
    return ((Math.PI * (Math.pow(Dext, 2) - Math.pow(Dint, 2))) / 4) * C;
  },
  tubo_quadrado: ({ lado, parede, comprimento }) => {
    const A = parseFloat(lado) || 0;
    const e = parseFloat(parede) || 0;
    const C = parseFloat(comprimento) || 0;
    return (4 * e * (A - e)) * C;
  },
  tubo_retangular: ({ lado_maior, lado_menor, parede, comprimento }) => {
    const A = parseFloat(lado_maior) || 0;
    const B = parseFloat(lado_menor) || 0;
    const e = parseFloat(parede) || 0;
    const C = parseFloat(comprimento) || 0;
    return (2 * e * (A + B - (2 * e))) * C;
  },
  perfil_l_cantoneira: ({ aba, aba_b, espessura, comprimento }) => {
    const A = parseFloat(aba) || 0;
    // Se aba_b foi fornecida e é positiva → cantoneira de aba desigual
    // Caso contrário → aba simétrica (B = A)
    const B = (parseFloat(aba_b) > 0) ? parseFloat(aba_b) : A;
    const e = parseFloat(espessura) || 0;
    const C = parseFloat(comprimento) || 0;
    // V = e × (A + B - e) × C
    // Prova simétrica: B=A → e(A+A-e) = e(2A-e) ✓
    return (e * (A + B - e)) * C;
  },
  perfil_t: ({ mesa, altura, espessura, comprimento }) => {
    const A = parseFloat(mesa) || 0;
    const B = parseFloat(altura) || 0;
    const e = parseFloat(espessura) || 0;
    const C = parseFloat(comprimento) || 0;
    return (e * (A + B - e)) * C;
  },
  perfil_u: ({ altura, aba, espessura, comprimento }) => {
    const H = parseFloat(altura) || 0;
    const B = parseFloat(aba) || 0;
    const e = parseFloat(espessura) || 0;
    const C = parseFloat(comprimento) || 0;
    return (e * (H + (2 * B) - (2 * e))) * C;
  },
  perfil_i_h: ({ altura, largura_aba, espessura_alma, espessura_aba, comprimento }) => {
    const H = parseFloat(altura) || 0;
    const B = parseFloat(largura_aba) || 0;
    const tw = parseFloat(espessura_alma) || 0;
    const tf = parseFloat(espessura_aba) || 0;
    const C = parseFloat(comprimento) || 0;
    return ((2 * B * tf) + ((H - (2 * tf)) * tw)) * C;
  }
};

// Map specification list to SHAPES objects expected by UI components
export const SHAPES = GEOMETRIAS_SPEC.geometrias.map(geom => ({
  id: geom.id,
  name: geom.nome,
  shortName: geom.nome_curto || geom.nome,
  categoria: geom.categoria,
  icon: geom.icon,
  descricaoFormula: geom.descricao_formula,
  inputs: geom.variaveis_entrada.map(v => ({
    id: v.id,
    label: v.nome,
    unit: v.unidade,
    simbolo: v.simbolo,
    default: v.default
  })),
  calculateVolumeMm3: shapeCalculators[geom.id] || (() => 0)
}));

/**
 * Utilitários de Cálculo de Peso Teórico de Metais, Conversão Automática de Frações em Polegadas para mm e Guardrails Físicos
 */

/**
 * Identifica e converte automaticamente frações em polegadas (ex: "1/2", "1 1/2", "3/8", '1/2"') para milímetros (mm)
 */
export function parseDimensionValue(inputVal) {
  if (typeof inputVal === 'number') return inputVal;
  if (!inputVal || typeof inputVal !== 'string') return 0;

  const clean = inputVal.trim().replace(/"/g, '').replace(/,/g, '.');
  if (clean === '') return 0;

  // Se for fração composta em polegadas (ex: "1 1/2" ou "2 3/4")
  const compoundMatch = clean.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (compoundMatch) {
    const whole = parseFloat(compoundMatch[1]);
    const num = parseFloat(compoundMatch[2]);
    const den = parseFloat(compoundMatch[3]);
    if (den !== 0) {
      const inches = whole + (num / den);
      return inches * 25.4; // Auto-converte fração de polegada para mm
    }
  }

  // Se for fração simples em polegadas (ex: "1/2", "3/8", "1/4", "3/4")
  const simpleMatch = clean.match(/^(\d+)\/(\d+)$/);
  if (simpleMatch) {
    const num = parseFloat(simpleMatch[1]);
    const den = parseFloat(simpleMatch[2]);
    if (den !== 0) {
      const inches = num / den;
      return inches * 25.4; // Auto-converte fração de polegada para mm
    }
  }

  // Se o usuário digitou número com aspas indicando polegadas (ex: 2" ou 1.5")
  if (inputVal.includes('"') || inputVal.toLowerCase().includes('in')) {
    const num = parseFloat(clean);
    return !isNaN(num) ? num * 25.4 : 0;
  }

  // Se for decimal simples (ex: "12.7" ou "50") -> Já está em mm
  return parseFloat(clean) || 0;
}

/**
 * Converte de mm para polegadas
 */
export function mmToInches(mm) {
  return (parseFloat(mm) || 0) / 25.4;
}

/**
 * Converte de polegadas para mm
 */
export function inchesToMm(inches) {
  return (parseFloat(inches) || 0) * 25.4;
}

/**
 * Validação de Restrições Físicas (Guardrails) para todas as geometrias
 */
export function validatePhysicalConstraints(shapeId, inputs) {
  const errors = {};
  
  const convert = (val) => parseDimensionValue(val);

  if (shapeId === 'tubo_redondo') {
    const Dext = convert(inputs.diametro_externo);
    const parede = convert(inputs.parede);
    if (parede > 0 && Dext > 0 && parede >= Dext / 2) {
      errors.parede = 'A parede não pode ser maior ou igual ao raio da peça (Dext / 2)';
    }
  }

  if (shapeId === 'bucha_tubo_mecanico') {
    const Dext = convert(inputs.diametro_externo);
    const Dint = convert(inputs.diametro_interno);
    if (Dint > 0 && Dext > 0 && Dint >= Dext) {
      errors.diametro_interno = 'O Diâmetro Interno deve ser menor que o Diâmetro Externo';
    }
  }

  if (shapeId === 'tubo_quadrado') {
    const lado = convert(inputs.lado);
    const parede = convert(inputs.parede);
    if (parede > 0 && lado > 0 && parede * 2 >= lado) {
      errors.parede = 'O dobro da espessura da parede deve ser menor que o lado';
    }
  }

  if (shapeId === 'tubo_retangular') {
    const A = convert(inputs.lado_maior);
    const B = convert(inputs.lado_menor);
    const parede = convert(inputs.parede);
    if (parede > 0 && (parede * 2 >= A || parede * 2 >= B)) {
      errors.parede = 'A parede excede os limites físicos do perfil retangular';
    }
  }

  if (shapeId === 'perfil_l_cantoneira') {
    const aba = convert(inputs.aba);
    const aba_b = convert(inputs.aba_b) > 0 ? convert(inputs.aba_b) : aba;
    const espessura = convert(inputs.espessura);
    if (espessura > 0 && aba > 0 && (espessura >= aba || espessura >= aba_b)) {
      errors.espessura = 'A espessura deve ser menor que a largura de ambas as abas (A e B)';
    }
  }

  if (shapeId === 'perfil_t') {
    const mesa = convert(inputs.mesa);
    const altura = convert(inputs.altura);
    const espessura = convert(inputs.espessura);
    if (espessura > 0 && (espessura >= mesa || espessura >= altura)) {
      errors.espessura = 'A espessura deve ser menor que a mesa e a altura do perfil T';
    }
  }

  if (shapeId === 'perfil_u') {
    const altura = convert(inputs.altura);
    const aba = convert(inputs.aba);
    const espessura = convert(inputs.espessura);
    if (espessura > 0 && (espessura * 2 >= altura || espessura >= aba)) {
      errors.espessura = 'A espessura não pode exceder metade da altura da alma ou a largura da aba';
    }
  }

  if (shapeId === 'perfil_i_h') {
    const altura = convert(inputs.altura);
    const larguraAba = convert(inputs.largura_aba);
    const espessuraAlma = convert(inputs.espessura_alma);
    const espessuraAba = convert(inputs.espessura_aba);

    if (espessuraAba > 0 && altura > 0 && espessuraAba * 2 >= altura) {
      errors.espessura_aba = 'O dobro da espessura da aba (2*tf) deve ser menor que a altura do perfil (H)';
    }
    if (espessuraAlma > 0 && larguraAba > 0 && espessuraAlma >= larguraAba) {
      errors.espessura_alma = 'A espessura da alma (tw) deve ser menor que a largura da aba (B)';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Calculador Principal de Peso Teórico de Metais
 */
export function calculateMetalWeight({
  shape,
  inputs,
  densityGcm3,
  pricePerKg = 0,
  quantity = 1,
  lossMarginPct = 0
}) {
  if (!shape || typeof shape.calculateVolumeMm3 !== 'function') {
    return {
      volumeMm3: 0,
      volumeCm3: 0,
      densityGcm3: densityGcm3 || 0,
      weightKg: 0,
      totalWeightKg: 0,
      totalPrice: 0,
      quantity: 1,
      isValid: false,
      errors: {}
    };
  }

  const missingInputs = shape.inputs.some(f => {
    const val = inputs[f.id];
    return val === undefined || val === null || val === '' || parseDimensionValue(val) <= 0;
  });

  if (missingInputs) {
    return {
      volumeMm3: 0,
      volumeCm3: 0,
      densityGcm3: densityGcm3 || 0,
      weightKg: 0,
      totalWeightKg: 0,
      totalPrice: 0,
      quantity: Math.max(1, parseInt(quantity) || 1),
      isValid: false,
      errors: {}
    };
  }

  const physicalCheck = validatePhysicalConstraints(shape.id, inputs);
  if (!physicalCheck.isValid) {
    return {
      volumeMm3: 0,
      volumeCm3: 0,
      densityGcm3: densityGcm3 || 0,
      weightKg: 0,
      totalWeightKg: 0,
      totalPrice: 0,
      quantity: Math.max(1, parseInt(quantity) || 1),
      isValid: false,
      errors: physicalCheck.errors
    };
  }

  const normalizedInputs = {};
  Object.keys(inputs).forEach(key => {
    const raw = inputs[key];
    normalizedInputs[key] = parseDimensionValue(raw); // Converte frações em polegadas para mm automaticamente
  });

  const volumeMm3 = shape.calculateVolumeMm3(normalizedInputs);
  if (volumeMm3 <= 0 || isNaN(volumeMm3)) {
    return {
      volumeMm3: 0,
      volumeCm3: 0,
      densityGcm3: densityGcm3 || 0,
      weightKg: 0,
      totalWeightKg: 0,
      totalPrice: 0,
      quantity: Math.max(1, parseInt(quantity) || 1),
      isValid: false,
      errors: {}
    };
  }

  const volumeCm3 = volumeMm3 / 1000;
  const rho = parseFloat(densityGcm3) || 0;
  const qty = Math.max(1, parseInt(quantity) || 1);
  const lossFactor = 1 + (parseFloat(lossMarginPct) || 0) / 100;
  
  const weightKg = (volumeMm3 * rho) / 1000000;
  const totalWeightKg = weightKg * qty * lossFactor;
  const price = parseFloat(pricePerKg) || 0;
  const totalPrice = totalWeightKg * price;

  return {
    volumeMm3,
    volumeCm3,
    densityGcm3: rho,
    quantity: qty,
    lossMarginPct: parseFloat(lossMarginPct) || 0,
    weightKg,
    totalWeightKg,
    totalPrice,
    isValid: true,
    errors: {}
  };
}

/**
 * Gera a nomenclatura comercial descritiva padrão do item
 */
export function generateCommercialDescription({ shape, metal, inputs, results }) {
  if (!shape || !metal || !results || !results.isValid) {
    return 'Selecione as dimensões para gerar a descrição comercial...';
  }

  const qty = results.quantity;
  const formatVal = (val) => {
    const num = parseDimensionValue(val);
    return `${formatNumber(num, 2)}mm`;
  };

  let dimStr = '';
  if (shape.id === 'chapa_bloco_retalho') {
    dimStr = `${formatVal(inputs.espessura)} x ${formatVal(inputs.largura)} x ${formatVal(inputs.comprimento)}`;
  } else if (shape.id === 'bobina') {
    dimStr = `Fita/Bobina e ${formatVal(inputs.espessura)} x L ${formatVal(inputs.largura)} x C ${formatVal(inputs.comprimento)}`;
  } else if (shape.id === 'barra_redonda_tarugo') {
    dimStr = `ø${formatVal(inputs.diametro)} x ${formatVal(inputs.comprimento)}`;
  } else if (shape.id === 'tubo_redondo') {
    dimStr = `ø${formatVal(inputs.diametro_externo)} x Parede ${formatVal(inputs.parede)} x ${formatVal(inputs.comprimento)}`;
  } else if (shape.id === 'bucha_tubo_mecanico') {
    dimStr = `Ext ø${formatVal(inputs.diametro_externo)} x Int ø${formatVal(inputs.diametro_interno)} x ${formatVal(inputs.comprimento)}`;
  } else if (shape.id === 'barra_quadrada') {
    dimStr = `${formatVal(inputs.lado)} x ${formatVal(inputs.comprimento)}`;
  } else if (shape.id === 'tubo_quadrado') {
    dimStr = `${formatVal(inputs.lado)} x Parede ${formatVal(inputs.parede)} x ${formatVal(inputs.comprimento)}`;
  } else if (shape.id === 'perfil_l_cantoneira') {
    const hasAbaB = inputs.aba_b && parseDimensionValue(inputs.aba_b) > 0;
    if (hasAbaB) {
      dimStr = `A ${formatVal(inputs.aba)} x B ${formatVal(inputs.aba_b)} x e ${formatVal(inputs.espessura)} x C ${formatVal(inputs.comprimento)}`;
    } else {
      dimStr = `Aba ${formatVal(inputs.aba)} x e ${formatVal(inputs.espessura)} x C ${formatVal(inputs.comprimento)}`;
    }
  } else if (shape.id === 'perfil_t') {
    dimStr = `Mesa ${formatVal(inputs.mesa)} x Altura ${formatVal(inputs.altura)} x e ${formatVal(inputs.espessura)} x C ${formatVal(inputs.comprimento)}`;
  } else if (shape.id === 'perfil_u') {
    dimStr = `Alma ${formatVal(inputs.altura)} x Aba ${formatVal(inputs.aba)} x e ${formatVal(inputs.espessura)} x C ${formatVal(inputs.comprimento)}`;
  } else if (shape.id === 'perfil_i_h') {
    dimStr = `H ${formatVal(inputs.altura)} x B ${formatVal(inputs.largura_aba)} x tw ${formatVal(inputs.espessura_alma)} x tf ${formatVal(inputs.espessura_aba)} x C ${formatVal(inputs.comprimento)}`;
  } else {
    dimStr = Object.values(inputs).map(v => formatVal(v)).join(' x ');
  }

  return `${qty}x ${shape.name} ${metal.name} - ${dimStr} | Peso Est.: ${formatWeight(results.totalWeightKg)} kg`;
}

export function formatNumber(val, decimals = 2) {
  if (isNaN(val) || val === null || val === undefined) return '0,00';
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(val);
}

/**
 * Peso em kg com precisão conforme o tamanho: abaixo de 1 kg usa 3 casas
 * (0,008 kg em vez de 0,00 kg), acima usa 2
 */
export function formatWeight(kg) {
  const abs = Math.abs(kg);
  const decimals = abs > 0 && abs < 1 ? 3 : 2;
  return formatNumber(kg, decimals);
}

export function formatCurrency(val) {
  if (isNaN(val) || val === null || val === undefined) return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(val);
}

/**
 * Motor 3D leve do esquema técnico, sem dependências.
 *
 * Toda geometria do catálogo é uma seção 2D extrudada ao longo do comprimento
 * (a bobina é um anel com a fita saindo dele). O fluxo é:
 *   buildSection  → seção em mm (laços externos/furos) + cotas 2D
 *   buildModel    → malha 3D normalizada (raio 1) + cotas 3D
 *   projectScene  → polígonos SVG ordenados (algoritmo do pintor) e cotas
 *
 * Projeção ortográfica: as cotas não sofrem distorção de perspectiva.
 */
import { parseDimensionValue, validatePhysicalConstraints } from './calculations.js';

const SEGMENTS = 40;
const DEG = Math.PI / 180;
const THICKNESS_FIELDS = ['parede', 'espessura', 'espessura_alma', 'espessura_aba'];

// ── Geometria 2D ────────────────────────────────────────────────────────────

const circle = (d) => Array.from({ length: SEGMENTS }, (_, i) => {
  const a = (i / SEGMENTS) * 2 * Math.PI;
  return [(d / 2) * Math.cos(a), (d / 2) * Math.sin(a)];
});

const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const centeredRect = (w, h) => rect(-w / 2, -h / 2, w / 2, h / 2);

export function signedArea(loop) {
  let s = 0;
  for (let i = 0; i < loop.length; i++) {
    const [x1, y1] = loop[i];
    const [x2, y2] = loop[(i + 1) % loop.length];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

const counterClockwise = (loop) => (signedArea(loop) >= 0 ? loop : [...loop].reverse());
const clockwise = (loop) => (signedArea(loop) <= 0 ? loop : [...loop].reverse());

/**
 * Seção transversal em mm a partir das medidas (números).
 * parts: [{ outer, holes, smooth }] · dims: cotas da seção · depth: extrusão
 * Cota com `side` usa a caixa da seção; com `a`/`b` usa pontos e `shift`
 * (deslocamento em unidades do afastamento padrão das cotas).
 */
export function buildSection(shapeId, v) {
  switch (shapeId) {
    case 'chapa_bloco_retalho':
    case 'barra_retangular_chata':
      return {
        parts: [{ outer: centeredRect(v.largura, v.espessura) }],
        dims: [
          { fields: ['largura'], symbol: 'L', side: 'top' },
          { fields: ['espessura'], symbol: 'e', side: 'left' }
        ],
        depth: v.comprimento
      };

    case 'barra_redonda_tarugo':
      return {
        parts: [{ outer: circle(v.diametro), smooth: true }],
        dims: [{ fields: ['diametro'], symbol: 'D', side: 'top' }],
        depth: v.comprimento
      };

    case 'barra_quadrada':
      return {
        parts: [{ outer: centeredRect(v.lado, v.lado) }],
        dims: [{ fields: ['lado'], symbol: 'A', side: 'top' }],
        depth: v.comprimento
      };

    case 'barra_sextavada': {
      // Vértice no eixo x: faces paralelas em cima e embaixo, distantes S
      const R = v.bitola / Math.sqrt(3);
      const hex = Array.from({ length: 6 }, (_, i) => [R * Math.cos(i * 60 * DEG), R * Math.sin(i * 60 * DEG)]);
      return {
        parts: [{ outer: hex }],
        dims: [{ fields: ['bitola'], symbol: 'S', side: 'left' }],
        depth: v.comprimento
      };
    }

    case 'tubo_redondo': {
      const R = v.diametro_externo / 2;
      const Ri = R - v.parede;
      return {
        parts: [{ outer: circle(2 * R), holes: [circle(2 * Ri)], smooth: true }],
        dims: [
          { fields: ['diametro_externo'], symbol: 'Dext', side: 'top' },
          { fields: ['parede'], symbol: 'e', a: [Ri, 0], b: [R, 0] }
        ],
        depth: v.comprimento
      };
    }

    case 'bucha_tubo_mecanico': {
      const Ri = v.diametro_interno / 2;
      return {
        parts: [{ outer: circle(v.diametro_externo), holes: [circle(v.diametro_interno)], smooth: true }],
        dims: [
          { fields: ['diametro_externo'], symbol: 'Dext', side: 'top' },
          { fields: ['diametro_interno'], symbol: 'Dint', a: [-Ri, 0], b: [Ri, 0] }
        ],
        depth: v.comprimento
      };
    }

    case 'tubo_quadrado': {
      const A = v.lado;
      const e = v.parede;
      return {
        parts: [{ outer: centeredRect(A, A), holes: [centeredRect(A - 2 * e, A - 2 * e)] }],
        dims: [
          { fields: ['lado'], symbol: 'A', side: 'top' },
          { fields: ['parede'], symbol: 'e', a: [A / 2 - e, 0], b: [A / 2, 0] }
        ],
        depth: v.comprimento
      };
    }

    case 'tubo_retangular': {
      const A = v.lado_maior;
      const B = v.lado_menor;
      const e = v.parede;
      return {
        parts: [{ outer: centeredRect(A, B), holes: [centeredRect(A - 2 * e, B - 2 * e)] }],
        dims: [
          { fields: ['lado_maior'], symbol: 'A', side: 'top' },
          { fields: ['lado_menor'], symbol: 'B', side: 'left' },
          { fields: ['parede'], symbol: 'e', a: [A / 2 - e, 0], b: [A / 2, 0] }
        ],
        depth: v.comprimento
      };
    }

    case 'perfil_l_cantoneira': {
      const A = v.aba;
      const hasB = v.aba_b > 0;
      const B = hasB ? v.aba_b : A;
      const e = v.espessura;
      return {
        parts: [{ outer: [[0, 0], [A, 0], [A, e], [e, e], [e, B], [0, B]] }],
        dims: [
          { fields: ['aba'], symbol: 'A', side: 'bottom' },
          // Simétrica: a aba vertical também é a medida A
          { fields: [hasB ? 'aba_b' : 'aba'], symbol: hasB ? 'B' : 'A', side: 'left' },
          { fields: ['espessura'], symbol: 'e', a: [0, B], b: [e, B], shift: [0, 1] }
        ],
        depth: v.comprimento
      };
    }

    case 'perfil_t': {
      const A = v.mesa;
      const B = v.altura;
      const e = v.espessura;
      return {
        parts: [{
          outer: [
            [-e / 2, 0], [e / 2, 0], [e / 2, B - e], [A / 2, B - e],
            [A / 2, B], [-A / 2, B], [-A / 2, B - e], [-e / 2, B - e]
          ]
        }],
        dims: [
          { fields: ['mesa'], symbol: 'A', side: 'top' },
          { fields: ['altura'], symbol: 'B', side: 'left' },
          { fields: ['espessura'], symbol: 'e', a: [-e / 2, 0], b: [e / 2, 0], shift: [0, -1] }
        ],
        depth: v.comprimento
      };
    }

    case 'perfil_u': {
      const H = v.altura;
      const B = v.aba;
      const e = v.espessura;
      return {
        parts: [{ outer: [[0, 0], [B, 0], [B, e], [e, e], [e, H - e], [B, H - e], [B, H], [0, H]] }],
        dims: [
          { fields: ['altura'], symbol: 'H', side: 'left' },
          { fields: ['aba'], symbol: 'B', side: 'top' },
          { fields: ['espessura'], symbol: 'e', a: [B, 0], b: [B, e], shift: [1, 0] }
        ],
        depth: v.comprimento
      };
    }

    case 'perfil_i_h': {
      const H = v.altura;
      const B = v.largura_aba;
      const tw = v.espessura_alma;
      const tf = v.espessura_aba;
      return {
        parts: [{
          outer: [
            [-B / 2, 0], [B / 2, 0], [B / 2, tf], [tw / 2, tf], [tw / 2, H - tf], [B / 2, H - tf],
            [B / 2, H], [-B / 2, H], [-B / 2, H - tf], [-tw / 2, H - tf], [-tw / 2, tf], [-B / 2, tf]
          ]
        }],
        dims: [
          { fields: ['altura'], symbol: 'H', side: 'left' },
          { fields: ['largura_aba'], symbol: 'B', side: 'top' },
          { fields: ['espessura_alma'], symbol: 'tw', a: [-tw / 2, H / 2], b: [tw / 2, H / 2] },
          { fields: ['espessura_aba'], symbol: 'tf', a: [B / 2, H - tf], b: [B / 2, H], shift: [1, 0] }
        ],
        depth: v.comprimento
      };
    }

    case 'bobina': {
      // Esquemático: o diâmetro da bobina não é informado; usa proporção fixa
      // com a largura L (eixo da bobina = extrusão) e a fita saindo por baixo
      const L = v.largura;
      const R = L;
      const ev = v.espessura;
      const strip = Math.min(Math.max(v.comprimento, 0.8 * R), 3.2 * R);
      return {
        parts: [
          { outer: circle(2 * R), holes: [circle(0.9 * R)], smooth: true },
          { outer: rect(0, -R - ev, strip, -R) }
        ],
        dims: [
          { fields: ['comprimento'], symbol: 'C', a: [0, -R - ev], b: [strip, -R - ev], shift: [0, -1] },
          { fields: ['espessura'], symbol: 'e', a: [strip, -R - ev], b: [strip, -R], shift: [1, 0] }
        ],
        depth: L,
        lengthDim: { fields: ['largura'], symbol: 'L', at: [0, R], shift: [0, 1], keepDepth: true }
      };
    }

    default:
      return null;
  }
}

// ── Modelo 3D ───────────────────────────────────────────────────────────────

const normalize = ([x, y, z]) => {
  const len = Math.hypot(x, y, z) || 1;
  return [x / len, y / len, z / len];
};

/**
 * Lê as medidas digitadas. Campo vazio ou inválido usa o valor padrão da
 * geometria; se a combinação for fisicamente impossível, usa todos os padrões.
 * `provided` marca o que veio do usuário (só esses mostram valor na cota).
 */
export function resolveValues(shape, inputs = {}) {
  const ids = shape.inputs.map(f => f.id);
  const defaults = Object.fromEntries(shape.inputs.map(f => [f.id, Number(f.default)]));
  const values = { ...defaults };
  const provided = {};

  for (const id of [...ids, 'aba_b']) {
    const mm = parseDimensionValue(inputs[id]);
    if (mm > 0) {
      values[id] = mm;
      provided[id] = true;
    }
  }

  if (!validatePhysicalConstraints(shape.id, values).isValid) {
    return { values: defaults, provided: {} };
  }
  return { values, provided };
}

/**
 * Valores só para o desenho: paredes muito finas ganham espessura mínima
 * visível (3,5% da maior medida da seção), mantendo a geometria válida
 */
function displayValues(shapeId, values) {
  const sectionSize = Math.max(...Object.entries(values)
    .filter(([id]) => id !== 'comprimento' && !THICKNESS_FIELDS.includes(id))
    .map(([, val]) => val));
  const minThickness = 0.035 * sectionSize;

  const adjusted = { ...values };
  THICKNESS_FIELDS.forEach(id => {
    if (adjusted[id] > 0 && adjusted[id] < minThickness) adjusted[id] = minThickness;
  });
  return validatePhysicalConstraints(shapeId, adjusted).isValid ? adjusted : values;
}

const formatMm = (mm) => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(mm);

/**
 * Malha 3D normalizada (cabe numa esfera de raio 1 centrada na origem).
 * faces: { loops (laços 3D), n (normal), smooth, cap }
 * dims:  { fields, label, a, b } com pontos 3D
 */
export function buildModel(shape, inputs = {}) {
  const { values, provided } = resolveValues(shape, inputs);
  const section = buildSection(shape.id, displayValues(shape.id, values));
  if (!section) return { faces: [], dims: [] };

  // Caixa da seção para centralizar e posicionar as cotas
  const allPoints = section.parts.flatMap(p => p.outer);
  const xs = allPoints.map(p => p[0]);
  const ys = allPoints.map(p => p[1]);
  const bb = { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  const size = Math.max(bb.maxX - bb.minX, bb.maxY - bb.minY);
  const gap = 0.16 * size;
  const cx = (bb.minX + bb.maxX) / 2;
  const cy = (bb.minY + bb.maxY) / 2;

  // Comprimento visual: peças longas são encurtadas no desenho (a cota mostra
  // o valor real); peças curtas, como arruelas, ficam na proporção real
  const zHalf = (section.lengthDim?.keepDepth
    ? section.depth
    : Math.min(Math.max(section.depth, 0.08 * size), 2.4 * size)) / 2;

  const faces = [];
  section.parts.forEach(part => {
    const outer = counterClockwise(part.outer);
    const holes = (part.holes || []).map(clockwise);

    [outer, ...holes].forEach(loop => {
      for (let i = 0; i < loop.length; i++) {
        const [x1, y1] = loop[i];
        const [x2, y2] = loop[(i + 1) % loop.length];
        faces.push({
          loops: [[[x1, y1, -zHalf], [x2, y2, -zHalf], [x2, y2, zHalf], [x1, y1, zHalf]]],
          n: normalize([y2 - y1, -(x2 - x1), 0]),
          smooth: Boolean(part.smooth)
        });
      }
    });

    const capLoops = (z) => [outer, ...holes].map(loop => loop.map(([x, y]) => [x, y, z]));
    faces.push({ loops: capLoops(zHalf), n: [0, 0, 1], cap: true });
    faces.push({ loops: capLoops(-zHalf), n: [0, 0, -1], cap: true });
  });

  const labelFor = (dim) => {
    const field = dim.fields[0];
    return provided[field] ? `${dim.symbol} ${formatMm(values[field])}` : dim.symbol;
  };

  const SIDES = {
    top: [[bb.minX, bb.maxY], [bb.maxX, bb.maxY], [0, 1]],
    bottom: [[bb.minX, bb.minY], [bb.maxX, bb.minY], [0, -1]],
    left: [[bb.minX, bb.minY], [bb.minX, bb.maxY], [-1, 0]],
    right: [[bb.maxX, bb.minY], [bb.maxX, bb.maxY], [1, 0]]
  };

  const dims = section.dims.map(dim => {
    const [a, b, shift] = dim.side ? SIDES[dim.side] : [dim.a, dim.b, dim.shift || [0, 0]];
    const offset = [shift[0] * gap, shift[1] * gap];
    return {
      fields: dim.fields,
      label: labelFor(dim),
      a: [a[0] + offset[0], a[1] + offset[1], zHalf],
      b: [b[0] + offset[0], b[1] + offset[1], zHalf]
    };
  });

  // Cota do comprimento (extrusão), por padrão no canto inferior direito
  const lengthDim = section.lengthDim || { fields: ['comprimento'], symbol: 'C', at: [bb.maxX, bb.minY], shift: [1, 0] };
  const lx = lengthDim.at[0] + lengthDim.shift[0] * gap;
  const ly = lengthDim.at[1] + lengthDim.shift[1] * gap;
  dims.push({ fields: lengthDim.fields, label: labelFor(lengthDim), a: [lx, ly, zHalf], b: [lx, ly, -zHalf] });

  // Centraliza e normaliza para raio 1
  const centered = ([x, y, z]) => [x - cx, y - cy, z];
  faces.forEach(f => { f.loops = f.loops.map(loop => loop.map(centered)); });
  dims.forEach(d => { d.a = centered(d.a); d.b = centered(d.b); });

  const radius = Math.max(...faces.flatMap(f => f.loops.flat().map(p => Math.hypot(...p)))) || 1;
  const scaled = (p) => p.map(c => c / radius);
  faces.forEach(f => { f.loops = f.loops.map(loop => loop.map(scaled)); });
  dims.forEach(d => { d.a = scaled(d.a); d.b = scaled(d.b); });

  return { faces, dims };
}

// ── Projeção ────────────────────────────────────────────────────────────────

export const DEFAULT_VIEW = { yaw: -35, pitch: 20, zoom: 1 };
export const SECTION_VIEW = { yaw: 0, pitch: 0, zoom: 1 };

const LIGHT = normalize([-0.45, 0.65, 0.62]);
const BASE_COLOR = [150, 163, 180];

/**
 * Projeta o modelo para a tela.
 * view: { yaw, pitch, zoom } em graus · viewport: { cx, cy, scale } em px
 * Devolve polígonos visíveis do fundo para a frente e as cotas em 2D.
 */
export function projectScene(model, view, viewport) {
  const cosY = Math.cos(view.yaw * DEG);
  const sinY = Math.sin(view.yaw * DEG);
  const cosP = Math.cos(view.pitch * DEG);
  const sinP = Math.sin(view.pitch * DEG);
  const k = viewport.scale * view.zoom;

  // Gira em torno de Y (yaw) e depois de X (pitch); +z aponta para quem olha
  const rotate = ([x, y, z]) => {
    const x1 = x * cosY + z * sinY;
    const z1 = -x * sinY + z * cosY;
    return [x1, y * cosP - z1 * sinP, y * sinP + z1 * cosP];
  };
  const toScreen = ([x, y]) => [viewport.cx + x * k, viewport.cy - y * k];
  const fmt = (n) => Math.round(n * 10) / 10;

  const polys = [];
  model.faces.forEach(face => {
    const n = rotate(face.n);
    if (n[2] <= 1e-6) return; // face de costas

    const loops = face.loops.map(loop => loop.map(rotate));
    const pts = loops[0];
    const depth = pts.reduce((s, p) => s + p[2], 0) / pts.length;

    const light = 0.3 + 0.7 * Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2]);
    const [r, g, b] = BASE_COLOR.map(c => Math.round(c * light));

    const d = loops.map(loop => 'M' + loop.map(p => toScreen(p).map(fmt).join(',')).join('L') + 'Z').join('');
    polys.push({ d, depth, fill: `rgb(${r},${g},${b})`, smooth: Boolean(face.smooth), cap: Boolean(face.cap) });
  });
  polys.sort((p, q) => p.depth - q.depth);

  const dims = model.dims.map(dim => {
    const [x1, y1] = toScreen(rotate(dim.a));
    const [x2, y2] = toScreen(rotate(dim.b));
    return { fields: dim.fields, label: dim.label, x1: fmt(x1), y1: fmt(y1), x2: fmt(x2), y2: fmt(y2) };
  });

  return { polys, dims };
}

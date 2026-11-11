export const DENSIDADES = {
  // Metais Ferrosos e Aços
  "aco_carbono": 7.85,
  "aco_ferramenta": 7.81,
  "aco_galvanizado": 7.85,
  "aco_inox_304": 7.93,
  "aco_inox_316": 7.98,
  "aco_inox_430": 7.75,
  "ferro_fundido_cinzento": 7.15,
  "ferro_fundido_nodular": 7.30,
  "ferro_puro": 7.87,

  // Ligas de Cobre
  "bronze_comum": 8.80,
  "bronze_aluminio": 7.70,
  "cobre_puro": 8.96,
  "latao_amarelo": 8.47,
  "latao_comum": 8.50,

  // Ligas de Alumínio
  "aluminio_puro": 2.70,
  "aluminio_6061": 2.70,
  "aluminio_7075": 2.81,

  // Outros Metais e Ligas Industriais
  "chumbo": 11.34,
  "estanho": 7.31,
  "magnésio": 1.74,
  "niquel": 8.90,
  "ouro": 19.32,
  "prata": 10.49,
  "titanio_grau_5": 4.43,
  "titanio_puro": 4.51,
  "zinco": 7.14,

  // Plásticos e Polímeros Técnicos
  "abs": 1.05,
  "acrilico_pmma": 1.18,
  "nylon_pa6": 1.14,
  "policarbonato_pc": 1.20,
  "polietileno_pead": 0.95,
  "polipropileno_pp": 0.90,
  "ptfe_teflon": 2.20,
  "pvc_rigido": 1.40,

  // Outros Materiais de Engenharia
  "fibra_de_carbono": 1.60, // laminado carbono/epóxi (a fibra pura tem ~1,75–1,80)
  "vidro_comum": 2.50
};

export const METALS_METADATA = [
  // Metais Ferrosos e Aços
  { id: 'aco_carbono', name: 'Aço Carbono / Estrutural', category: 'Metais Ferrosos e Aços', description: 'Aço SAE 1020/1045, A36 e ligas de construção mecânica.' },
  { id: 'aco_ferramenta', name: 'Aço Ferramenta', category: 'Metais Ferrosos e Aços', description: 'Aços para matrizes, moldes e ferramentas de corte (Ex: D2, O1, M2).' },
  { id: 'aco_galvanizado', name: 'Aço Galvanizado', category: 'Metais Ferrosos e Aços', description: 'Aço carbono revestido com camada protetora de zinco.' },
  { id: 'aco_inox_304', name: 'Aço Inox 304', category: 'Metais Ferrosos e Aços', description: 'Aço inoxidável austenítico resistente à corrosão padrão.' },
  { id: 'aco_inox_316', name: 'Aço Inox 316', category: 'Metais Ferrosos e Aços', description: 'Aço inox de alta resistência química e marinha com molibdênio.' },
  { id: 'aco_inox_430', name: 'Aço Inox 430', category: 'Metais Ferrosos e Aços', description: 'Aço inoxidável ferrítico magnético de boa conformabilidade.' },
  { id: 'ferro_fundido_cinzento', name: 'Ferro Fundido Cinzento', category: 'Metais Ferrosos e Aços', description: 'Excelente amortecimento de vibrações e fácil usinabilidade.' },
  { id: 'ferro_fundido_nodular', name: 'Ferro Fundido Nodular', category: 'Metais Ferrosos e Aços', description: 'Maior tenacidade e ductilidade comparado ao cinzento.' },
  { id: 'ferro_puro', name: 'Ferro Puro (Fe)', category: 'Metais Ferrosos e Aços', description: 'Elemento ferro primário sem adições significante de liga.' },

  // Ligas de Cobre
  { id: 'bronze_comum', name: 'Bronze Comum / Comercial', category: 'Ligas de Cobre', description: 'Liga de Cobre e Estanho resistente ao desgaste e corrosão.' },
  { id: 'bronze_aluminio', name: 'Bronze Alumínio', category: 'Ligas de Cobre', description: 'Liga de alta resistência mecânica e à corrosão por água do mar.' },
  { id: 'cobre_puro', name: 'Cobre Puro (Cu)', category: 'Ligas de Cobre', description: 'Excepcional condutividade elétrica e térmica.' },
  { id: 'latao_amarelo', name: 'Latão Amarelo', category: 'Ligas de Cobre', description: 'Liga Cobre-Zinco versátil para estampagem e peças ornamentais.' },
  { id: 'latao_comum', name: 'Latão Comum (C3600 / CLA)', category: 'Ligas de Cobre', description: 'Excelente usinabilidade em tornos automáticos e CNC.' },

  // Ligas de Alumínio
  { id: 'aluminio_puro', name: 'Alumínio Puro (Al)', category: 'Ligas de Alumínio', description: 'Elevada condutividade e resistência à corrosão.' },
  { id: 'aluminio_6061', name: 'Alumínio 6061', category: 'Ligas de Alumínio', description: 'Liga estrutural tratável termicamente de uso geral e naval.' },
  { id: 'aluminio_7075', name: 'Alumínio 7075 (Ergal)', category: 'Ligas de Alumínio', description: 'Liga de altíssima resistência mecânica de uso aeronáutico.' },

  // Outros Metais e Ligas Industriais
  { id: 'chumbo', name: 'Chumbo (Pb)', category: 'Outros Metais Industriais', description: 'Metal pesado macio usado em proteção radiológica e contrapesos.' },
  { id: 'estanho', name: 'Estanho (Sn)', category: 'Outros Metais Industriais', description: 'Metal maleável usado em soldas elétricas e revestimentos.' },
  { id: 'magnésio', name: 'Magnésio (Mg)', category: 'Outros Metais Industriais', description: 'Metal estrutural mais leve existente na indústria.' },
  { id: 'niquel', name: 'Níquel (Ni)', category: 'Outros Metais Industriais', description: 'Metal resistente a altas temperaturas e meio corrosivo.' },
  { id: 'ouro', name: 'Ouro Puro 24k (Au)', category: 'Outros Metais Industriais', description: 'Metal precioso inoxidável de altíssima densidade.' },
  { id: 'prata', name: 'Prata Pura (Ag)', category: 'Outros Metais Industriais', description: 'Maior condutividade elétrica e térmica de todos os metais.' },
  { id: 'titanio_grau_5', name: 'Titânio Grau 5 (Ti-6Al-4V)', category: 'Outros Metais Industriais', description: 'Liga de titânio aeroespacial e médica de alta resistência.' },
  { id: 'titanio_puro', name: 'Titânio Puro Grau 2', category: 'Outros Metais Industriais', description: 'Titânio comercialmente puro para indústria química e médica.' },
  { id: 'zinco', name: 'Zinco (Zn)', category: 'Outros Metais Industriais', description: 'Utilizado principalmente em galvanização e fundição Zamak.' },

  // Plásticos e Polímeros Técnicos
  { id: 'abs', name: 'Plástico ABS', category: 'Plásticos e Polímeros Técnicos', description: 'Termoplástico rígido de boa resistência a impactos.' },
  { id: 'acrilico_pmma', name: 'Acrílico (PMMA)', category: 'Plásticos e Polímeros Técnicos', description: 'Polímero transparente de alta qualidade óptica.' },
  { id: 'nylon_pa6', name: 'Nylon / Poliamida (PA 6)', category: 'Plásticos e Polímeros Técnicos', description: 'Plástico de engenharia para buchas, engrenagens e roletes.' },
  { id: 'policarbonato_pc', name: 'Policarbonato (PC)', category: 'Plásticos e Polímeros Técnicos', description: 'Extremamente resistente a impactos e transparente.' },
  { id: 'polietileno_pead', name: 'Polietileno (PEAD)', category: 'Plásticos e Polímeros Técnicos', description: 'Excelente resistência química e baixo coeficiente de atrito.' },
  { id: 'polipropileno_pp', name: 'Polipropileno (PP)', category: 'Plásticos e Polímeros Técnicos', description: 'Polímero leve resistente a produtos químicos e fadiga.' },
  { id: 'ptfe_teflon', name: 'Teflon (PTFE)', category: 'Plásticos e Polímeros Técnicos', description: 'Inércia química quase total e excelente anti-aderência.' },
  { id: 'pvc_rigido', name: 'PVC Rígido', category: 'Plásticos e Polímeros Técnicos', description: 'Termoplástico versátil e auto-extinguível.' },

  // Outros Materiais de Engenharia
  { id: 'fibra_de_carbono', name: 'Fibra de Carbono (Composto)', category: 'Outros Materiais de Engenharia', description: 'Laminado carbono/epóxi (~60% fibra) de altíssima rigidez e ultraleve.' },
  { id: 'vidro_comum', name: 'Vidro Comum (Silicato)', category: 'Outros Materiais de Engenharia', description: 'Material cerâmico inorgânico transparente.' }
];

// Re-export METALS array with density merged from DENSIDADES constant
export const METALS = METALS_METADATA.map(item => ({
  ...item,
  density: DENSIDADES[item.id] || 7.85
}));

// Família de atalho: os aços inox também pertencem a "Metais Ferrosos e Aços"
export const INOX_FAMILY = 'Aço Inox';

// Famílias do seletor, na ordem em que aparecem nos dados
export const MATERIAL_FAMILIES = [
  INOX_FAMILY,
  ...new Set(METALS.map(m => m.category))
];

export function getMetalsByFamily(family) {
  if (family === INOX_FAMILY) {
    return METALS.filter(m => m.id.includes('inox'));
  }
  return METALS.filter(m => m.category === family);
}

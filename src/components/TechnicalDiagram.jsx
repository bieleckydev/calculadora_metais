import React, { useMemo, useRef } from 'react';
import { Target, Box, RotateCcw, Square } from 'lucide-react';
import Viewer3D from './Viewer3D';
import { buildModel, DEFAULT_VIEW, SECTION_VIEW } from '../utils/scene3d';

/**
 * Descrição de cada cota, exibida quando o campo correspondente está em foco
 */
const FIELD_DESCRIPTIONS = {
  diametro_externo: { label: 'Diâmetro Externo (Dext)', desc: 'Cota Dext: diâmetro externo total da seção circular' },
  diametro_interno: { label: 'Diâmetro Interno (Dint)', desc: 'Cota Dint: diâmetro do furo da bucha / tubo' },
  parede: { label: 'Espessura da Parede (e)', desc: 'Cota e: espessura da parede do tubo' },
  diametro: { label: 'Diâmetro (D)', desc: 'Cota D: diâmetro total da seção' },
  largura: { label: 'Largura (L)', desc: 'Cota L: largura da chapa, barra ou fita' },
  espessura: { label: 'Espessura (e)', desc: 'Cota e: espessura da chapa, fita ou perfil' },
  comprimento: { label: 'Comprimento (C)', desc: 'Cota C: comprimento da peça (peças longas aparecem encurtadas)' },
  lado: { label: 'Lado / Bitola (A)', desc: 'Cota A: lado do quadrado' },
  lado_maior: { label: 'Lado Maior (A)', desc: 'Cota A: lado maior da seção retangular' },
  lado_menor: { label: 'Lado Menor (B)', desc: 'Cota B: lado menor da seção retangular' },
  bitola: { label: 'Bitola Entre Faces (S)', desc: 'Cota S: distância entre faces paralelas do sextavado' },
  aba: { label: 'Largura da Aba (A)', desc: 'Cota A: largura da aba (no L simétrico vale para as duas)' },
  aba_b: { label: 'Largura da Aba B', desc: 'Cota B: largura da segunda aba da cantoneira desigual' },
  largura_aba: { label: 'Largura da Aba (B)', desc: 'Cota B: largura das abas da viga I/H' },
  mesa: { label: 'Largura da Mesa (A)', desc: 'Cota A: largura da mesa do perfil T' },
  altura: { label: 'Altura (H)', desc: 'Cota de altura total do perfil' },
  espessura_alma: { label: 'Espessura da Alma (tw)', desc: 'Cota tw: espessura da alma da viga I/H' },
  espessura_aba: { label: 'Espessura da Aba (tf)', desc: 'Cota tf: espessura das abas da viga I/H' }
};

export default function TechnicalDiagram({ shape, inputs, activeField }) {
  const viewerRef = useRef(null);
  const activeInfo = activeField ? FIELD_DESCRIPTIONS[activeField] : null;

  // A malha só é refeita quando a geometria ou as medidas mudam
  const model = useMemo(() => buildModel(shape, inputs), [shape, inputs]);

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">
          <Box size={16} />
          Esquema técnico
        </h2>

        <div className="view-buttons">
          <button
            type="button"
            className="small-btn"
            onClick={() => viewerRef.current?.animateTo(SECTION_VIEW)}
            title="Ver a seção de frente"
          >
            <Square size={12} />
            <span>Seção</span>
          </button>
          <button
            type="button"
            className="small-btn"
            onClick={() => viewerRef.current?.animateTo(DEFAULT_VIEW)}
            title="Voltar à vista 3D inicial"
          >
            <RotateCcw size={12} />
            <span>Vista 3D</span>
          </button>
        </div>
      </div>

      <div className={`diagram-info${activeInfo ? ' is-active' : ''}`} aria-live="polite">
        <Target size={16} />
        <span>
          {activeInfo ? activeInfo.desc : 'Selecione ou edite um campo para destacar a cota no desenho'}
        </span>
      </div>

      <div className="diagram-canvas">
        <Viewer3D
          ref={viewerRef}
          model={model}
          activeField={activeField}
          ariaLabel={`Modelo 3D: ${shape.name}${activeInfo ? `, cota ${activeInfo.label} em destaque` : ''}. Use as setas para girar e + ou − para zoom.`}
        />
      </div>

      <p className="diagram-hint">Arraste para girar · roda do mouse ou pinça para zoom · duplo clique centraliza</p>
    </section>
  );
}

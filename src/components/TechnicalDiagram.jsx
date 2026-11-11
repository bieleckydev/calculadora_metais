import React, { useState } from 'react';
import { Target, Box, RotateCw } from 'lucide-react';


/**
 * Dicionário de descrições e símbolos de cotas para todas as geometrias (incluindo Bobina e Perfil I/H)
 */
const FIELD_DESCRIPTIONS = {
  diametro_externo: { symbol: 'Dext', label: 'Diâmetro Externo (Dext)', desc: 'Cota Dext: Diâmetro externo total da seção circular em 3D' },
  diametro_interno: { symbol: 'Dint', label: 'Diâmetro Interno (Dint)', desc: 'Cota Dint: Diâmetro do furo interno do tubo/bucha 3D' },
  parede: { symbol: 'e', label: 'Espessura da Parede (e)', desc: 'Cota e: Espessura da parede do perfil em 3D' },
  diametro: { symbol: 'D', label: 'Diâmetro (D)', desc: 'Cota D: Diâmetro total da seção transversal 3D' },
  largura: { symbol: 'L', label: 'Largura (L)', desc: 'Cota L: Largura da fita/chapa/peça no espaço 3D' },
  espessura: { symbol: 'e', label: 'Espessura (e)', desc: 'Cota e: Espessura da fita/chapa/perfil em 3D' },
  comprimento: { symbol: 'C', label: 'Comprimento (C)', desc: 'Cota C: Comprimento total de extrusão/desenrolamento ao longo do eixo Z 3D' },
  lado: { symbol: 'A', label: 'Lado / Bitola (A)', desc: 'Cota A: Dimensão do lado do quadrado em 3D' },
  lado_maior: { symbol: 'A', label: 'Lado Maior (A)', desc: 'Cota A: Lado maior da seção retangular 3D' },
  lado_menor: { symbol: 'B', label: 'Lado Menor (B)', desc: 'Cota B: Lado menor da seção retangular 3D' },
  bitola: { symbol: 'S', label: 'Bitola Entre Faces (S)', desc: 'Cota S: Medida entre faces hexagonais paralelas' },
  aba: { symbol: 'A', label: 'Largura da Aba A', desc: 'Cota A: Largura da aba da cantoneira ou perfil em 3D' },
  aba_b: { symbol: 'B', label: 'Largura da Aba B', desc: 'Cota B: Largura da segunda aba (aba desigual) da cantoneira em 3D' },
  largura_aba: { symbol: 'B', label: 'Largura da Aba (B)', desc: 'Cota B: Largura da aba superior/inferior da viga I/H em 3D' },
  mesa: { symbol: 'A', label: 'Largura da Mesa (A)', desc: 'Cota A: Largura da mesa superior do perfil T em 3D' },
  altura: { symbol: 'H', label: 'Altura / Alma (H)', desc: 'Cota H: Altura total do perfil I/H/T/U em 3D' },
  espessura_alma: { symbol: 'tw', label: 'Espessura da Alma (tw)', desc: 'Cota tw: Espessura da alma vertical central da viga I/H' },
  espessura_aba: { symbol: 'tf', label: 'Espessura da Aba (tf)', desc: 'Cota tf: Espessura das abas superiores/inferiores da viga I/H' }
};


export default function TechnicalDiagram({ shapeId, activeField }) {
  const [userRotationAngle, setUserRotationAngle] = useState(0);

  const isFocused = (fieldKey) => activeField === fieldKey;
  const activeInfo = activeField ? FIELD_DESCRIPTIONS[activeField] : null;

  const getCameraTransform = () => {
    if (activeField === 'comprimento') {
      return {
        scale: 0.9,
        extLength: 130,
        angleOffset: 25 + userRotationAngle,
        focusType: 'comprimento'
      };
    } else if (activeField === 'espessura' || activeField === 'parede' || activeField === 'espessura_alma' || activeField === 'espessura_aba') {
      return {
        scale: 1.1,
        extLength: 80,
        angleOffset: 45 + userRotationAngle,
        focusType: 'espessura'
      };
    } else {
      return {
        scale: 1.0,
        extLength: 100,
        angleOffset: 35 + userRotationAngle,
        focusType: 'secao'
      };
    }
  };

  const camera = getCameraTransform();

  const render3DModelSvg = () => {
    const isLengthFocused = isFocused('comprimento');
    const isThicknessFocused = isFocused('espessura') || isFocused('parede') || isFocused('espessura_alma') || isFocused('espessura_aba');
    const isWidthFocused = isFocused('largura') || isFocused('lado') || isFocused('lado_maior') || isFocused('aba') || isFocused('mesa') || isFocused('largura_aba');
    const isHeightFocused = isFocused('altura') || isFocused('lado_menor');

    const extX = camera.extLength * Math.cos((camera.angleOffset * Math.PI) / 180);
    const extY = -camera.extLength * Math.sin((camera.angleOffset * Math.PI) / 180) * 0.5;

    switch (shapeId) {
      case 'bobina': {
        const thickFocused = isFocused('espessura');
        const widthFocused = isFocused('largura');

        return (
          <g transform={`translate(${110 - extX * 0.2}, ${110 - extY * 0.2}) scale(${camera.scale})`}>
            {/* Unrolled Strip (Fita desenrolando da bobina ao longo do Comprimento C) */}
            <path
              d={`M -20,25 L ${-20 + extX},${25 + extY} L ${40 + extX},${25 + extY} L 40,25 Z`}
              fill="rgba(140, 156, 176, 0.15)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth={isLengthFocused ? '3' : '1.5'}
            />
            {/* Strip Front Edge (Espessura e) */}
            <path
              d={`M ${-20 + extX},${25 + extY} L ${-20 + extX},${28 + extY} L ${40 + extX},${28 + extY} L ${40 + extX},${25 + extY} Z`}
              fill="rgba(229, 103, 90, 0.4)"
              stroke={thickFocused ? 'var(--diagram-thickness)' : 'var(--diagram-stroke)'}
              strokeWidth={thickFocused ? '2.5' : '1'}
            />

            {/* 3D Rolled Coil Cylinder Body (Corpo Cilíndrico da Bobina) */}
            <path
              d={`M -30,-40 L 20,-40 A 35,40 0 0,1 20,40 L -30,40 A 35,40 0 0,0 -30,-40 Z`}
              fill="rgba(140, 156, 176, 0.12)"
              stroke={widthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'}
              strokeWidth={widthFocused ? '2.5' : '1.5'}
            />

            {/* Front Coil Ellipse Face (Face Frontal da Bobina) */}
            <ellipse
              cx="-30"
              cy="0"
              rx="35"
              ry="40"
              fill="rgba(17, 18, 20, 0.9)"
              stroke={thickFocused || widthFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth={thickFocused || widthFocused ? '3' : '2'}
            />

            {/* Concentric Winding Rings (Espirais de Enrolamento da Fita) */}
            <ellipse cx="-30" cy="0" rx="27" ry="31" fill="none" stroke="var(--diagram-focus)" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />
            <ellipse cx="-30" cy="0" rx="20" ry="23" fill="none" stroke="var(--diagram-focus)" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />

            {/* Inner Core Hole / Mandrel (Furo Central do Carretel) */}
            <ellipse
              cx="-30"
              cy="0"
              rx="13"
              ry="15"
              fill="var(--diagram-hole)"
              stroke="var(--diagram-dim)"
              strokeWidth="2"
            />

            {/* Rear Coil Ellipse Outline */}
            <ellipse cx="20" cy="0" rx="35" ry="40" fill="none" stroke="var(--diagram-edge-muted)" strokeWidth="1.5" strokeDasharray="2 2" />

            {/* Cota Z (Comprimento Linear C da Fita) */}
            <line x1="40" y1="25" x2={40 + extX} y2={25 + extY} stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={40 + extX / 2 + 10} y={25 + extY / 2 - 5} fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento Linear)
            </text>

            {/* Cota X (Largura da Fita L) */}
            <line x1="-30" y1="-48" x2="20" y2="-48" stroke={widthFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={widthFocused ? '2.5' : '1.5'} />
            <text x="-5" y="-53" fill={widthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={widthFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              L (Largura da Fita)
            </text>

            {/* Cota Y (Espessura e da Fita) */}
            <line x1={40 + extX + 8} y1={25 + extY} x2={40 + extX + 8} y2={28 + extY} stroke={thickFocused ? 'var(--diagram-thickness)' : 'var(--diagram-dim)'} strokeWidth={thickFocused ? '2.5' : '1.5'} />
            <text x={40 + extX + 14} y={28 + extY} fill={thickFocused ? 'var(--diagram-thickness)' : 'var(--diagram-label)'} fontSize={thickFocused ? '12' : '10'} fontWeight="700">
              e
            </text>
          </g>
        );
      }

      case 'perfil_i_h': {
        const altFocused = isFocused('altura');
        const abaFocused = isFocused('largura_aba');
        const twFocused = isFocused('espessura_alma');
        const tfFocused = isFocused('espessura_aba');

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${115 - extY * 0.3}) scale(${camera.scale})`}>
            {/* Top Flange Extrusion */}
            <polygon
              points={`-45,-50 ${-45 + extX},${-50 + extY} ${45 + extX},${-50 + extY} 45,-50`}
              fill="rgba(140, 156, 176, 0.12)"
              stroke={abaFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'}
              strokeWidth="1.5"
            />

            {/* Front 3D I/H Beam Cross-Section Face */}
            <path
              d="M -45,-50 L 45,-50 L 45,-36 L 8,-36 L 8,36 L 45,36 L 45,50 L -45,50 L -45,36 L -8,36 L -8,-36 L -45,-36 Z"
              fill="rgba(140, 156, 176, 0.18)"
              stroke={altFocused || abaFocused || twFocused || tfFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth={altFocused || abaFocused || twFocused || tfFocused ? '3.5' : '2.5'}
            />

            {/* Side Web Extrusion */}
            <polygon
              points={`45,50 ${45 + extX},${50 + extY} ${-45 + extX},${50 + extY} -45,50`}
              fill="rgba(140, 156, 176, 0.05)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'}
              strokeWidth={isLengthFocused ? '3' : '1.5'}
            />

            {/* Cota Z (Comprimento C) */}
            <line x1="45" y1="-50" x2={45 + extX} y2={-50 + extY} stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={45 + extX / 2 + 10} y={-50 + extY / 2} fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>

            {/* Altura H */}
            <line x1="-57" y1="-50" x2="-57" y2="50" stroke={altFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={altFocused ? '2.5' : '1.5'} />
            <text x="-65" y="4" fill={altFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={altFocused ? '12' : '10'} fontWeight="700" textAnchor="end">
              H (Altura)
            </text>

            {/* Largura da Aba B */}
            <line x1="-45" y1="-62" x2="45" y2="-62" stroke={abaFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={abaFocused ? '2.5' : '1.5'} />
            <text x="0" y="-67" fill={abaFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={abaFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              B (Aba)
            </text>

            {/* Espessura tf & tw */}
            {tfFocused && (
              <text x="25" y="-40" fill="var(--diagram-thickness)" fontSize="10" fontWeight="700">tf</text>
            )}
            {twFocused && (
              <text x="12" y="0" fill="var(--diagram-thickness)" fontSize="10" fontWeight="700">tw</text>
            )}
          </g>
        );
      }

      case 'perfil_l_cantoneira': {
        const abaAFocused = isFocused('aba');
        const abaBFocused = isFocused('aba_b');
        const thickFocused = isThicknessFocused;

        return (
          <g transform={`translate(${110 - extX * 0.3}, ${120 - extY * 0.3}) scale(${camera.scale})`}>
            {/* Extrusão vertical traseira */}
            <path
              d={`M -40,30 L ${-40 + extX},${30 + extY} L ${-40 + extX},${-50 + extY} L -40,-50 Z`}
              fill="rgba(140, 156, 176, 0.06)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge-muted)'}
              strokeWidth="1.5"
            />
            {/* Extrusão horizontal traseira */}
            <path
              d={`M -40,30 L ${-40 + extX},${30 + extY} L ${40 + extX},${30 + extY} L 40,30 Z`}
              fill="rgba(140, 156, 176, 0.08)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge-muted)'}
              strokeWidth="1.5"
            />
            {/* Seção frontal do perfil L */}
            <path
              d="M -40,30 L -40,-50 L -22,-50 L -22,12 L 40,12 L 40,30 Z"
              fill="rgba(26, 27, 31, 0.9)"
              stroke={abaAFocused || abaBFocused || thickFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth={abaAFocused || abaBFocused || thickFocused ? '3.5' : '2.5'}
            />
            {/* Cota Z (Comprimento) */}
            <line x1="40" y1="30" x2={40 + extX} y2={30 + extY} stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={40 + extX / 2 + 10} y={30 + extY / 2} fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            {/* Cota Aba A (horizontal) */}
            <line x1="-40" y1="42" x2="40" y2="42" stroke={abaAFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth={abaAFocused ? '2.5' : '1.5'} />
            <text x="0" y="55" fill={abaAFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={abaAFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              A (Aba A)
            </text>
            {/* Cota Aba B / Altura vertical */}
            <line x1="-52" y1="-50" x2="-52" y2="30" stroke={abaBFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth={abaBFocused ? '2.5' : '1.2'} strokeDasharray={abaBFocused ? 'none' : '3 2'} />
            <text x="-58" y="-10" fill={abaBFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={abaBFocused ? '12' : '10'} fontWeight="700" textAnchor="end">
              B
            </text>
            {/* Cota Espessura e */}
            <line x1="-22" y1="-58" x2="-40" y2="-58" stroke={thickFocused ? 'var(--diagram-thickness)' : 'var(--diagram-stroke)'} strokeWidth={thickFocused ? '2.5' : '1.5'} />
            <text x="-31" y="-63" fill={thickFocused ? 'var(--diagram-thickness)' : 'var(--diagram-label)'} fontSize={thickFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              e
            </text>
          </g>
        );
      }


      case 'perfil_t': {
        const mesaFocused = isWidthFocused;
        const altFocused = isHeightFocused;
        const thickFocused = isThicknessFocused;

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${115 - extY * 0.3}) scale(${camera.scale})`}>
            <polygon
              points={`-50,-40 ${-50 + extX},${-40 + extY} ${50 + extX},${-40 + extY} 50,-40`}
              fill="rgba(140, 156, 176, 0.12)"
              stroke={mesaFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'}
              strokeWidth="1.5"
            />
            <path
              d="M -50,-40 L 50,-40 L 50,-22 L 10,-22 L 10,40 L -10,40 L -10,-22 L -50,-22 Z"
              fill="rgba(140, 156, 176, 0.15)"
              stroke={mesaFocused || altFocused || thickFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth={mesaFocused || altFocused || thickFocused ? '3.5' : '2.5'}
            />
            <polygon
              points={`10,40 ${10 + extX},${40 + extY} ${-10 + extX},${40 + extY} -10,40`}
              fill="rgba(140, 156, 176, 0.06)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'}
              strokeWidth={isLengthFocused ? '3' : '1.5'}
            />
            <line x1="50" y1="-40" x2={50 + extX} y2={-40 + extY} stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={50 + extX / 2 + 10} y={-40 + extY / 2} fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-50" y1="-52" x2="50" y2="-52" stroke={mesaFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={mesaFocused ? '2.5' : '1.5'} />
            <text x="0" y="-57" fill={mesaFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={mesaFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              A (Largura da Mesa)
            </text>
            <line x1="62" y1="-40" x2="62" y2="40" stroke={altFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={altFocused ? '2.5' : '1.5'} />
            <text x="70" y="4" fill={altFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={altFocused ? '12' : '10'} fontWeight="700">
              B (Altura)
            </text>
          </g>
        );
      }

      case 'perfil_u': {
        const altFocused = isHeightFocused;
        const abaFocused = isWidthFocused;
        const thickFocused = isThicknessFocused;

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${115 - extY * 0.3}) scale(${camera.scale})`}>
            <path
              d={`M -45,-45 L ${-45 + extX},${-45 + extY} L ${-45 + extX},${45 + extY} -45,45 Z`}
              fill="rgba(140, 156, 176, 0.06)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'}
              strokeWidth="1.5"
            />
            <path
              d="M -45,-45 L -45,45 L 35,45 L 35,27 L -27,27 L -27,-27 L 35,-27 L 35,-45 Z"
              fill="rgba(140, 156, 176, 0.15)"
              stroke={altFocused || abaFocused || thickFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth={altFocused || abaFocused || thickFocused ? '3.5' : '2.5'}
            />
            <line x1="35" y1="45" x2={35 + extX} y2={45 + extY} stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={35 + extX / 2 + 10} y={45 + extY / 2} fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-57" y1="-45" x2="-57" y2="45" stroke={altFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={altFocused ? '2.5' : '1.5'} />
            <text x="-65" y="4" fill={altFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={altFocused ? '12' : '10'} fontWeight="700" textAnchor="end">
              H (Alma)
            </text>
            <line x1="-45" y1="57" x2="35" y2="57" stroke={abaFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={abaFocused ? '2.5' : '1.5'} />
            <text x="-5" y="70" fill={abaFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={abaFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              B (Aba)
            </text>
          </g>
        );
      }

      case 'tubo_redondo':
      case 'bucha_tubo_mecanico': {
        const extFocused = isFocused('diametro') || isFocused('diametro_externo');
        const wallFocused = isThicknessFocused || isFocused('diametro_interno');

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${110 - extY * 0.3}) scale(${camera.scale})`}>
            <path
              d={`M -40,-40 L ${-40 + extX},${-40 + extY} A 45,25 0 0,0 ${40 + extX},${40 + extY} L 40,40 A 45,25 0 0,1 -40,-40 Z`}
              fill="rgba(140, 156, 176, 0.08)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'}
              strokeWidth={isLengthFocused ? '3' : '1.5'}
            />
            <ellipse cx={extX} cy={extY} rx="45" ry="25" fill="none" stroke="var(--diagram-edge-muted)" strokeWidth="1.5" strokeDasharray="3 3" />
            <ellipse cx="0" cy="0" rx="45" ry="25" fill="rgba(17, 18, 20, 0.85)" stroke={extFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth={extFocused ? '4' : '3'} />
            <ellipse cx="0" cy="0" rx="28" ry="15" fill="var(--diagram-hole)" stroke={wallFocused ? 'var(--diagram-thickness)' : 'var(--diagram-dim)'} strokeWidth={wallFocused ? '3.5' : '2'} strokeDasharray={wallFocused ? 'none' : '3 2'} />
            <line x1="45" y1="25" x2={45 + extX} y2={25 + extY} stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={45 + extX / 2 + 12} y={25 + extY / 2} fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-45" y1="0" x2="45" y2="0" stroke={extFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={extFocused ? '2.5' : '1.5'} strokeDasharray="2 2" />
            <text x="0" y="-8" fill={extFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={extFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              Dext (Diâmetro)
            </text>
          </g>
        );
      }

      case 'barra_redonda_tarugo': {
        const isDiameterFocused = isFocused('diametro');
        return (
          <g transform={`translate(${130 - extX * 0.3}, ${110 - extY * 0.3}) scale(${camera.scale})`}>
            <path
              d={`M -45,0 L ${-45 + extX},${extY} A 45,25 0 0,0 ${45 + extX},${extY} L 45,0 A 45,25 0 0,1 -45,0 Z`}
              fill="rgba(140, 156, 176, 0.12)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'}
              strokeWidth={isLengthFocused ? '3' : '1.5'}
            />
            <ellipse cx="0" cy="0" rx="45" ry="25" fill="rgba(140, 156, 176, 0.2)" stroke={isDiameterFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth={isDiameterFocused ? '4' : '3'} />
            <line x1="45" y1="0" x2={45 + extX} y2={extY} stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={45 + extX / 2 + 10} y={extY / 2} fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-45" y1="0" x2="45" y2="0" stroke={isDiameterFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth="2" strokeDasharray="3 3" />
            <text x="0" y="-8" fill={isDiameterFocused ? 'var(--diagram-focus)' : 'var(--diagram-label-strong)'} fontSize={isDiameterFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              D (Diâmetro)
            </text>
          </g>
        );
      }

      case 'chapa_bloco_retalho':
      case 'barra_retangular_chata': {
        const thickFocused = isThicknessFocused;
        const widthFocused = isWidthFocused;

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${110 - extY * 0.3}) scale(${camera.scale})`}>
            <polygon points={`-60,-20 ${-60 + extX},${-20 + extY} ${60 + extX},${-20 + extY} 60,-20`} fill="rgba(140, 156, 176, 0.15)" stroke={widthFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth={widthFocused ? '3' : '1.5'} />
            <polygon points="-60,-20 60,-20 60,20 -60,20" fill="rgba(140, 156, 176, 0.08)" stroke={thickFocused || widthFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth={thickFocused || widthFocused ? '3.5' : '2.5'} />
            <polygon points={`60,-20 ${60 + extX},${-20 + extY} ${60 + extX},${20 + extY} 60,20`} fill="rgba(140, 156, 176, 0.05)" stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <line x1="60" y1="-20" x2={60 + extX} y2={-20 + extY} stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={60 + extX / 2 + 8} y={-20 + extY / 2} fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-60" y1="-28" x2="60" y2="-28" stroke={widthFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={widthFocused ? '2.5' : '1.5'} />
            <text x="0" y="-34" fill={widthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={widthFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              L (Largura)
            </text>
            <line x1="68" y1="-20" x2="68" y2="20" stroke={thickFocused ? 'var(--diagram-thickness)' : 'var(--diagram-dim)'} strokeWidth={thickFocused ? '2.5' : '1.5'} />
            <text x="75" y="4" fill={thickFocused ? 'var(--diagram-thickness)' : 'var(--diagram-label)'} fontSize={thickFocused ? '12' : '10'} fontWeight="700">
              e
            </text>
          </g>
        );
      }

      case 'barra_quadrada':
      case 'tubo_quadrado': {
        const sideFocused = isWidthFocused;
        const wallFocused = isThicknessFocused;

        return (
          <g transform={`translate(${130 - extX * 0.3}, ${110 - extY * 0.3}) scale(${camera.scale})`}>
            <polygon points={`-45,-45 ${-45 + extX},${-45 + extY} ${45 + extX},${-45 + extY} 45,-45`} fill="rgba(140, 156, 176, 0.1)" stroke={sideFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'} strokeWidth="1.5" />
            <rect x="-45" y="-45" width="90" height="90" fill="rgba(17, 18, 20, 0.85)" stroke={sideFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth={sideFocused ? '3.5' : '2.5'} />
            {shapeId === 'tubo_quadrado' && (
              <rect x="-28" y="-28" width="56" height="56" fill="var(--diagram-hole)" stroke={wallFocused ? 'var(--diagram-thickness)' : 'var(--diagram-dim)'} strokeWidth={wallFocused ? '3' : '2'} strokeDasharray={wallFocused ? 'none' : '3 2'} />
            )}
            <polygon points={`45,-45 ${45 + extX},${-45 + extY} ${45 + extX},${45 + extY} 45,45`} fill="rgba(140, 156, 176, 0.05)" stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <line x1="45" y1="-45" x2={45 + extX} y2={-45 + extY} stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={45 + extX / 2 + 10} y={-45 + extY / 2} fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={isLengthFocused ? '12' : '10'} fontWeight="700">
              C (Comprimento)
            </text>
            <line x1="-45" y1="-55" x2="45" y2="-55" stroke={sideFocused ? 'var(--diagram-focus)' : 'var(--diagram-dim)'} strokeWidth={sideFocused ? '2.5' : '1.5'} />
            <text x="0" y="-60" fill={sideFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize={sideFocused ? '12' : '10'} fontWeight="700" textAnchor="middle">
              A (Lado)
            </text>
          </g>
        );
      }

      case 'barra_sextavada': {
        const bitolaFocused = isFocused('bitola');

        // ── Geometria: hexágono regular "flat-top"
        // Vértices a cada 60° a partir de 0° (direita)
        // → v0: direita | v1: inf-dir | v2: inf-esq | v3: esquerda | v4: sup-esq | v5: sup-dir
        // Flat-top = arestas horizontais no topo e na base, vértice nas laterais
        const R = 40;
        const h = R * Math.sqrt(3) / 2; // apótema = metade da "bitola entre faces"

        const v = [
          [ R,    0  ],  // v0 – direita
          [ R/2,  h  ],  // v1 – inferior-direita
          [-R/2,  h  ],  // v2 – inferior-esquerda
          [-R,    0  ],  // v3 – esquerda
          [-R/2, -h  ],  // v4 – superior-esquerda
          [ R/2, -h  ],  // v5 – superior-direita
        ];

        const ex = extX;
        const ey = extY;

        // Helper: converte array de [x,y] em string de pontos SVG
        const p = (arr) => arr.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');

        // Vértices traseiros (face traseira = face frontal deslocada pelo vetor de extrusão)
        const vR = v.map(([x, y]) => [x + ex, y + ey]);

        // ── Faces visíveis da perspectiva superior-esquerda (viewer olha de cima-à-esquerda)
        // Face superior (topo):         v4 → v5 → vR5 → vR4
        // Face superior-direita:        v5 → v0 → vR0 → vR5
        // Face inferior-direita:        v0 → v1 → vR1 → vR0

        const topFace   = p([v[4], v[5], vR[5], vR[4]]);
        const urFace    = p([v[5], v[0], vR[0], vR[5]]);
        const lrFace    = p([v[0], v[1], vR[1], vR[0]]);
        const frontFace = p(v);
        const rearFace  = p(vR);

        return (
          <g transform={`translate(${115 - ex * 0.35}, ${110 - ey * 0.45}) scale(${camera.scale})`}>
            {/* Face traseira – tracejada */}
            <polygon points={rearFace} fill="none" stroke="var(--diagram-edge-muted)" strokeWidth="1" strokeDasharray="3 2" />

            {/* Face inferior-direita – menos iluminada */}
            <polygon
              points={lrFace}
              fill="rgba(140, 156, 176, 0.10)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge)'}
              strokeWidth="1.3"
            />

            {/* Face lateral superior-direita – meia iluminação */}
            <polygon
              points={urFace}
              fill="rgba(192, 200, 212, 0.22)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth="1.5"
            />

            {/* Face superior (topo) – mais iluminada */}
            <polygon
              points={topFace}
              fill="rgba(215, 222, 232, 0.32)"
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth="1.5"
            />

            {/* Arestas laterais visíveis do prisma (v4, v5, v0, v1 → traseiro) */}
            {[4, 5, 0, 1].map(i => (
              <line key={i}
                x1={v[i][0]} y1={v[i][1]}
                x2={vR[i][0]} y2={vR[i][1]}
                stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
                strokeWidth="1.4"
              />
            ))}

            {/* Face frontal – escura como na referência */}
            <polygon
              points={frontFace}
              fill="rgba(17, 18, 20, 0.96)"
              stroke={bitolaFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth={bitolaFocused ? '3' : '2.5'}
            />

            {/* ── Cota C: Comprimento (aresta do vértice direito até o fundo) */}
            <line
              x1={v[0][0]} y1={v[0][1]}
              x2={vR[0][0]} y2={vR[0][1]}
              stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth={isLengthFocused ? '2.5' : '1.5'}
            />
            <text
              x={v[0][0] + ex / 2 + 12} y={v[0][1] + ey / 2}
              fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'}
              fontSize={isLengthFocused ? '12' : '10'} fontWeight="700"
            >
              C (Comprimento)
            </text>

            {/* ── Cota S: Bitola entre faces paralelas (vertical, topo→base da face frontal) */}
            <line
              x1={-R / 2 - 14} y1={-h}
              x2={-R / 2 - 14} y2={h}
              stroke={bitolaFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'}
              strokeWidth={bitolaFocused ? '2.5' : '1.2'}
              strokeDasharray={bitolaFocused ? 'none' : '4 2'}
            />
            {/* Marcas de cota */}
            <line x1={-R / 2 - 18} y1={-h} x2={-R / 2 - 10} y2={-h}
              stroke={bitolaFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth="1.2" />
            <line x1={-R / 2 - 18} y1={h} x2={-R / 2 - 10} y2={h}
              stroke={bitolaFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth="1.2" />
            <text
              x={-R / 2 - 20} y={3}
              fill={bitolaFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'}
              fontSize={bitolaFocused ? '12' : '10'} fontWeight="700" textAnchor="end"
            >
              S (Bitola)
            </text>
          </g>
        );
      }



      default: {
        return (
          <g transform={`translate(${130 - extX * 0.3}, ${110 - extY * 0.3}) scale(${camera.scale})`}>
            <polygon points={`-50,-30 ${-50 + extX},${-30 + extY} ${50 + extX},${-30 + extY} 50,-30`} fill="rgba(140, 156, 176, 0.1)" stroke="var(--diagram-edge)" strokeWidth="2" />
            <rect x="-50" y="-30" width="100" height="60" fill="rgba(26, 27, 31, 0.85)" stroke="var(--diagram-stroke)" strokeWidth="2.5" />
            <polygon points={`50,-30 ${50 + extX},${-30 + extY} ${50 + extX},${30 + extY} 50,30`} fill="rgba(140, 156, 176, 0.05)" stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-edge-muted)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <line x1="50" y1="-30" x2={50 + extX} y2={-30 + extY} stroke={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-stroke)'} strokeWidth={isLengthFocused ? '3' : '1.5'} />
            <text x={50 + extX / 2 + 8} y={-30 + extY / 2} fill={isLengthFocused ? 'var(--diagram-focus)' : 'var(--diagram-label)'} fontSize="11" fontWeight="700">
              C (Comprimento)
            </text>
          </g>
        );
      }
    }
  };

  return (
    <section className="panel">
      <div className="panel__head">
        <h4 className="panel__title">
          <Box size={16} />
          Esquema técnico
        </h4>

        <button
          type="button"
          className="small-btn"
          onClick={() => setUserRotationAngle(prev => (prev + 30) % 360)}
          title="Rotacionar Modelo 3D"
        >
          <RotateCw size={12} />
          <span>Girar 3D</span>
        </button>
      </div>

      <div className={`diagram-info${activeInfo ? ' is-active' : ''}`}>
        <Target size={16} />
        <span>
          {activeInfo ? activeInfo.desc : 'Selecione ou edite um campo para ver a descrição e perspectiva 3D da cota'}
        </span>
      </div>

      <div className="diagram-canvas">
        <svg width="280" height="220" viewBox="0 0 280 220">
          <defs>
            <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

          {render3DModelSvg()}
        </svg>
      </div>
    </section>
  );
}

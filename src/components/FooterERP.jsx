import React, { useEffect, useState } from 'react';
import softcompHorizontal from '../assets/SOFTCOMP-Logo-horizontal.png';

export default function FooterERP({ onCancel, onInject, isValid, notice }) {
  const [transparentBieleckyUrl, setTransparentBieleckyUrl] = useState(null);
  const showBieleckyLogo = false; // Oculto por enquanto

  useEffect(() => {
    if (!showBieleckyLogo) return;
    let cancelled = false;

    // Importação sob demanda: a imagem só entra no carregamento quando o logo está ativo
    import('../assets/bielecky.dev.jpg').then(({ default: bieleckyRaw }) => {
      if (cancelled) return;
      // Process bielecky.dev.jpg to remove the fake checkered / gray background and keep only the dark blue typography
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = bieleckyRaw;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          // Bounding box detection to crop unnecessary padding
          let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;
          let found = false;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Check if pixel is gray/white (the checkered pattern in JPEG is composed of shades of gray ~120-240)
            // The logo itself is deep blue: Blue > Red + 20 or Blue > Green + 15 or low luminance with high blue ratio
            const maxDiff = Math.max(Math.abs(r - g), Math.abs(r - b), Math.abs(g - b));
            const brightness = (r + g + b) / 3;

            // Pure or near neutrals (checkerboard squares) or bright pixels
            const isNeutral = maxDiff < 22 && brightness > 90;
            const isBackground = isNeutral || (brightness > 180);

            if (isBackground) {
              data[i + 3] = 0; // Transparent
            } else {
              // Keep pixel and sharpen opacity
              const x = (i / 4) % canvas.width;
              const y = Math.floor((i / 4) / canvas.width);
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              found = true;
            }
          }

          if (found && maxX > minX && maxY > minY) {
            ctx.putImageData(imgData, 0, 0);
          
            // Crop tightly around the logo text
            const cropCanvas = document.createElement('canvas');
            const padding = 10;
            const cropW = (maxX - minX + 1) + (padding * 2);
            const cropH = (maxY - minY + 1) + (padding * 2);
            cropCanvas.width = cropW;
            cropCanvas.height = cropH;
            const cropCtx = cropCanvas.getContext('2d');
            cropCtx.drawImage(canvas, minX - padding, minY - padding, cropW, cropH, 0, 0, cropW, cropH);

            setTransparentBieleckyUrl(cropCanvas.toDataURL('image/png'));
          } else {
            setTransparentBieleckyUrl(bieleckyRaw);
          }
        } catch (err) {
          console.error('Error processing bielecky logo transparency:', err);
          setTransparentBieleckyUrl(bieleckyRaw);
        }
      };
      img.onerror = () => {
        setTransparentBieleckyUrl(bieleckyRaw);
      };
    });

    return () => { cancelled = true; };
  }, [showBieleckyLogo]);

  return (
    <footer className="erp-footer">
      {/* SOFTCOMP Logo */}
      <div className="erp-footer__brand">
        <img src={softcompHorizontal} alt="SOFTCOMP" />
      </div>

      <div className="erp-footer__actions">
        <p
          className={`erp-footer__status${notice ? ` erp-footer__status--${notice.tone}` : ''}`}
          role="status"
          aria-live="polite"
        >
          {notice ? notice.text : (isValid ? '' : 'Preencha as dimensões para enviar')}
        </p>

        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Limpar <kbd>Esc</kbd>
        </button>
        <button type="button" className="btn btn-primary" onClick={onInject} disabled={!isValid}>
          Enviar ao pedido <kbd>Enter</kbd>
        </button>
      </div>

      {/* Canto Direito Inferior (Total Oposto): bielecky.dev Logo (Oculto por enquanto) */}
      {showBieleckyLogo && transparentBieleckyUrl && (
        <div
          title="bielecky.dev"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease',
            opacity: 0.88,
            userSelect: 'none'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.88'; }}
        >
          <img
            src={transparentBieleckyUrl}
            alt="bielecky.dev"
            style={{
              height: '24px',
              width: 'auto',
              display: 'block',
              objectFit: 'contain',
              filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.5))'
            }}
          />
        </div>
      )}
    </footer>
  );
}

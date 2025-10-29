import type { AdStyle, Platform, Suggestion } from '../types';

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};


export const applyTextAndStyleToImage = (
    baseImageUrl: string,
    suggestion: Suggestion,
    style: AdStyle,
    platform: Platform
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const [ratioW, ratioH] = platform.aspectRatio.split(':').map(Number);
            const canvasWidth = 1080;
            const canvasHeight = (canvasWidth / ratioW) * ratioH;

            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            // Clear canvas
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            // Apply styles before drawing
            ctx.save();

            if (style === 'native_tiktok') {
                // Shaky cam effect
                const angle = (Math.random() - 0.5) * 0.02; // max ~0.5 degrees
                ctx.translate(canvasWidth / 2, canvasHeight / 2);
                ctx.rotate(angle);
                ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
            }
            
            // Draw image to fit canvas
            const imgRatio = img.width / img.height;
            const canvasRatio = canvas.width / canvas.height;
            let drawWidth, drawHeight, offsetX, offsetY;

            if (imgRatio > canvasRatio) { // Image is wider than canvas
                drawHeight = canvas.height;
                drawWidth = drawHeight * imgRatio;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            } else { // Image is taller or same aspect ratio
                drawWidth = canvas.width;
                drawHeight = drawWidth / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            }
            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

            // Restore canvas state after drawing image
            ctx.restore();

            // Apply text based on style
            drawText(ctx, suggestion, style, canvasWidth, canvasHeight);
            
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = (e) => reject(new Error(`Failed to load image: ${e}`));
        img.src = baseImageUrl;
    });
};

function drawText(
    ctx: CanvasRenderingContext2D,
    suggestion: Suggestion,
    style: AdStyle,
    width: number,
    height: number
) {
    const { hook, keyMessages, cta } = suggestion;
    const padding = width * 0.05;

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const wrapText = (text: string, maxWidth: number, font: string, lineHeight: number) => {
        ctx.font = font;
        const words = text.replace(/\\n/g, ' \n ').split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word === '\n') {
                lines.push(currentLine);
                currentLine = '';
                continue;
            }
            const testLine = currentLine + word + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            if (testWidth > maxWidth && i > 0) {
                lines.push(currentLine);
                currentLine = word + ' ';
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);
        return lines.map(line => line.trim());
    };

    if (style === 'polished') {
        // HOOK
        const hookFontSize = Math.round(width / 10);
        const hookLines = wrapText(hook, width - padding * 2, `bold ${hookFontSize}px Anton`, hookFontSize);
        ctx.shadowColor = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 10;
        hookLines.forEach((line, i) => {
            ctx.fillText(line, width / 2, height * 0.2 + i * hookFontSize);
        });

        // CTA
        const ctaFontSize = Math.round(width / 20);
        ctx.font = `bold ${ctaFontSize}px Roboto`;
        ctx.fillStyle = '#030E0F';
        const ctaMetrics = ctx.measureText(cta);
        const ctaBoxWidth = ctaMetrics.width + padding;
        const ctaBoxHeight = ctaFontSize * 1.5;
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = '#0FF4C6';
        ctx.fillRect((width - ctaBoxWidth) / 2, height * 0.8 - ctaBoxHeight / 2, ctaBoxWidth, ctaBoxHeight);
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = '#030E0F';
        ctx.fillText(cta, width / 2, height * 0.8);
        ctx.shadowColor = 'transparent';

    } else if (style === 'native_tiktok') {
        // TikTok font has a thick black stroke
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 8;
        
        // HOOK
        const hookFontSize = Math.round(width / 12);
        ctx.font = `bold ${hookFontSize}px Roboto`;
        const hookLines = wrapText(hook, width - padding * 2, ctx.font, hookFontSize);
        hookLines.forEach((line, i) => {
            const y = height * 0.25 + i * (hookFontSize * 1.1);
            ctx.strokeText(line, width / 2, y);
            ctx.fillText(line, width / 2, y);
        });

    } else if (style === 'ugc_testimonial') {
        // Draw a semi-transparent card
        const cardPadding = width * 0.08;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(cardPadding, height * 0.2, width - cardPadding * 2, height * 0.6);

        const contentWidth = width - cardPadding * 2;
        const textPadding = contentWidth * 0.1;
        
        // Draw fake user profile
        ctx.fillStyle = '#ccc';
        const avatarSize = contentWidth * 0.1;
        ctx.beginPath();
        ctx.arc(cardPadding + textPadding + avatarSize / 2, height * 0.2 + textPadding + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.font = `bold ${avatarSize * 0.4}px Roboto`;
        ctx.fillText("@real_user", cardPadding + textPadding + avatarSize + 10, height * 0.2 + textPadding + avatarSize/2);
        
        // Draw testimonial text (key messages)
        const messageFontSize = Math.round(width / 25);
        ctx.font = `${messageFontSize}px Roboto`;
        ctx.textAlign = 'center';
        const messageLines = wrapText(keyMessages, contentWidth - textPadding * 2, ctx.font, messageFontSize);
        messageLines.forEach((line, i) => {
            ctx.fillText(line, width / 2, height * 0.5 + i * (messageFontSize * 1.4));
        });
    }
}

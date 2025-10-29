export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the data:mime/type;base64, prefix
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

interface TextOverlays {
    hook?: string;
    keyMessages?: string;
    cta?: string;
}

export const addTextOverlayToImage = (
    base64ImageUrl: string,
    { hook, keyMessages, cta }: TextOverlays
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                return reject(new Error('Could not get canvas context'));
            }

            // Draw the original image
            ctx.drawImage(img, 0, 0);

            const drawTextWithBackground = (text: string, x: number, y: number, fontSize: number, maxWidth: number) => {
                ctx.font = `bold ${fontSize}px "Helvetica Neue", Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                const lines = text.split('\n');
                const lineHeight = fontSize * 1.2;
                
                lines.forEach((line, index) => {
                    const textMetrics = ctx.measureText(line);
                    const textWidth = textMetrics.width;
                    const textHeight = lineHeight;
                    const lineY = y + (index * textHeight);

                    // Semi-transparent background
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
                    ctx.fillRect(x - textWidth / 2 - 10, lineY - textHeight / 2, textWidth + 20, textHeight);

                    // White text
                    ctx.fillStyle = 'white';
                    ctx.fillText(line, x, lineY, maxWidth);
                });
            };

            const baseFontSize = canvas.width / 20;
            const maxWidth = canvas.width * 0.9;

            // Draw Hook
            if (hook) {
                drawTextWithBackground(hook, canvas.width / 2, canvas.height * 0.15, baseFontSize * 1.1, maxWidth);
            }

            // Draw Key Messages
            if (keyMessages) {
                drawTextWithBackground(keyMessages, canvas.width / 2, canvas.height * 0.5, baseFontSize * 0.9, maxWidth);
            }
            
            // Draw CTA
            if (cta) {
                drawTextWithBackground(cta, canvas.width / 2, canvas.height * 0.85, baseFontSize, maxWidth);
            }

            resolve(canvas.toDataURL('image/jpeg'));
        };
        img.onerror = reject;
        img.src = base64ImageUrl;
    });
};

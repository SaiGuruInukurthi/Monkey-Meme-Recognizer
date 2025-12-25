import { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { getMonkeyForExpression } from '../utils/expressionMapping';

function Result({ photo, expression, onTryAgain }) {
    const canvasRef = useRef(null);
    const monkey = getMonkeyForExpression(expression);

    // Download combined image
    const handleDownload = useCallback(async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        const imgWidth = 300;
        const imgHeight = 300;
        const padding = 20;
        const gap = 20;

        canvas.width = imgWidth * 2 + padding * 2 + gap;
        canvas.height = imgHeight + padding * 2 + 80;

        // Background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#FF8C00');
        gradient.addColorStop(0.5, '#FFD700');
        gradient.addColorStop(1, '#FFA500');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Load and draw user photo
        const userImg = new Image();
        userImg.crossOrigin = 'anonymous';

        await new Promise((resolve) => {
            userImg.onload = resolve;
            userImg.src = photo;
        });

        // Draw white background for images
        ctx.fillStyle = 'white';
        ctx.roundRect(padding - 5, padding - 5, imgWidth + 10, imgHeight + 10, 16);
        ctx.fill();

        ctx.roundRect(padding + imgWidth + gap - 5, padding - 5, imgWidth + 10, imgHeight + 10, 16);
        ctx.fill();

        // Draw user photo
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(padding, padding, imgWidth, imgHeight, 12);
        ctx.clip();
        ctx.drawImage(userImg, padding, padding, imgWidth, imgHeight);
        ctx.restore();

        // Load and draw monkey image
        const monkeyImg = new Image();
        monkeyImg.crossOrigin = 'anonymous';

        try {
            await new Promise((resolve, reject) => {
                monkeyImg.onload = resolve;
                monkeyImg.onerror = reject;
                monkeyImg.src = monkey.image;
            });

            ctx.save();
            ctx.beginPath();
            ctx.roundRect(padding + imgWidth + gap, padding, imgWidth, imgHeight, 12);
            ctx.clip();
            ctx.drawImage(monkeyImg, padding + imgWidth + gap, padding, imgWidth, imgHeight);
            ctx.restore();
        } catch {
            // If monkey image fails, draw emoji
            ctx.font = '120px serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(monkey.emoji, padding + imgWidth + gap + imgWidth / 2, padding + imgHeight / 2);
        }

        // Draw expression text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`Expression: ${monkey.label} ${monkey.emoji}`, canvas.width / 2, canvas.height - 35);

        // Trigger download
        const link = document.createElement('a');
        link.download = `monkey-match-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }, [photo, monkey]);

    return (
        <div className="card text-center fade-in max-w-2xl w-full">
            {/* Title */}
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Match! 🎯
            </h2>

            {/* Expression badge */}
            <div className="expression-badge inline-block mb-6">
                {monkey.label} {monkey.emoji}
            </div>

            {/* Side by side images */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-6">
                {/* User photo */}
                <div className="result-image">
                    <img
                        src={photo}
                        alt="Your captured photo"
                        className="w-64 h-64 object-cover"
                    />
                    <p className="bg-gray-800 text-white py-2 text-sm font-medium">
                        You
                    </p>
                </div>

                {/* Matched monkey */}
                <div className="result-image bg-orange-50">
                    <img
                        src={monkey.image}
                        alt={monkey.description}
                        className="w-64 h-64 object-contain p-4"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML = `
                <div class="w-64 h-64 flex items-center justify-center text-8xl">${monkey.emoji}</div>
                <p class="bg-gray-800 text-white py-2 text-sm font-medium">${monkey.label} Monkey</p>
              `;
                        }}
                    />
                    <p className="bg-gray-800 text-white py-2 text-sm font-medium">
                        {monkey.label} Monkey
                    </p>
                </div>
            </div>

            {/* Hidden canvas for download generation */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Action buttons */}
            <div className="flex gap-4 justify-center">
                <button
                    onClick={handleDownload}
                    className="btn-primary"
                    id="download-btn"
                >
                    ⬇️ Download
                </button>
                <button
                    onClick={onTryAgain}
                    className="btn-secondary"
                    id="try-again-btn"
                >
                    🔄 Try Again
                </button>
            </div>
        </div>
    );
}

Result.propTypes = {
    photo: PropTypes.string.isRequired,
    expression: PropTypes.string.isRequired,
    onTryAgain: PropTypes.func.isRequired,
};

export default Result;

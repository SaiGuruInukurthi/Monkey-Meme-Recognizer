import { useRef, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import * as faceapi from 'face-api.js';
import { getDominantExpression, getMonkeyForExpression } from '../utils/expressionMapping';

function Camera({ onCapture, onStop }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const animationRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState('Loading AI models...');
    const [error, setError] = useState(null);
    const [currentExpression, setCurrentExpression] = useState('neutral');
    const [modelsLoaded, setModelsLoaded] = useState(false);

    // Load face-api models
    useEffect(() => {
        const loadModels = async () => {
            try {
                setLoadingMessage('Loading AI models...');
                const MODEL_URL = '/models';

                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
                ]);

                setModelsLoaded(true);
                setLoadingMessage('Starting camera...');
            } catch (err) {
                console.error('Error loading models:', err);
                setError('Failed to load AI models. Please refresh and try again.');
                setIsLoading(false);
            }
        };

        loadModels();
    }, []);

    // Start camera after models are loaded
    useEffect(() => {
        if (!modelsLoaded) return;

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 640 },
                        height: { ideal: 480 },
                        facingMode: 'user'
                    }
                });

                streamRef.current = stream;

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    await videoRef.current.play();
                    setIsLoading(false);
                    startDetection();
                }
            } catch (err) {
                console.error('Camera error:', err);
                if (err.name === 'NotAllowedError') {
                    setError('Camera access denied. Please allow camera access and refresh.');
                } else {
                    setError('Could not access camera. Please check your camera connection.');
                }
                setIsLoading(false);
            }
        };

        startCamera();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [modelsLoaded]);

    // Face detection loop
    const startDetection = useCallback(() => {
        const detect = async () => {
            if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
                animationRef.current = requestAnimationFrame(detect);
                return;
            }

            try {
                const detections = await faceapi
                    .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions();

                if (detections) {
                    const expression = getDominantExpression(detections.expressions);
                    setCurrentExpression(expression);
                }
            } catch (err) {
                console.error('Detection error:', err);
            }

            // Run at ~10-15 FPS
            setTimeout(() => {
                animationRef.current = requestAnimationFrame(detect);
            }, 66);
        };

        animationRef.current = requestAnimationFrame(detect);
    }, []);

    // Capture photo
    const handleCapture = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Mirror the image (since we're using front camera)
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);

        const photoDataUrl = canvas.toDataURL('image/png');
        onCapture(photoDataUrl, currentExpression);
    }, [currentExpression, onCapture]);

    // Handle stop
    const handleStop = useCallback(() => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        onStop();
    }, [onStop]);

    const monkey = getMonkeyForExpression(currentExpression);

    // Error state
    if (error) {
        return (
            <div className="card text-center fade-in max-w-md w-full">
                <div className="text-5xl mb-4">😕</div>
                <h2 className="text-xl font-bold text-gray-800 mb-4">Oops!</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button onClick={onStop} className="btn-secondary">
                    Go Back
                </button>
            </div>
        );
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="card text-center fade-in max-w-md w-full">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">{loadingMessage}</p>
            </div>
        );
    }

    return (
        <div className="card fade-in max-w-2xl w-full">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Video feed */}
                <div className="flex-1">
                    <div className="video-container">
                        <video
                            ref={videoRef}
                            className="w-full"
                            style={{ transform: 'scaleX(-1)' }}
                            playsInline
                            muted
                        />
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Live monkey preview */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                    <div className="expression-badge mb-4">
                        {monkey.label} {monkey.emoji}
                    </div>

                    <div className="monkey-preview bg-orange-50 rounded-2xl p-4 w-48 h-48 flex items-center justify-center">
                        <img
                            src={monkey.image}
                            alt={monkey.description}
                            className="max-w-full max-h-full object-contain rounded-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<span class="text-6xl">${monkey.emoji}</span>`;
                            }}
                        />
                    </div>

                    <p className="text-sm text-gray-500 mt-2 text-center">
                        {monkey.description}
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-4 justify-center mt-6">
                <button
                    onClick={handleCapture}
                    className="btn-primary"
                    id="capture-btn"
                >
                    📸 Capture
                </button>
                <button
                    onClick={handleStop}
                    className="btn-secondary"
                    id="stop-btn"
                >
                    ⬅️ Stop
                </button>
            </div>
        </div>
    );
}

Camera.propTypes = {
    onCapture: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
};

export default Camera;

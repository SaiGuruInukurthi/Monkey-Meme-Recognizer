import { useState, useCallback } from 'react';
import Landing from './components/Landing';
import Camera from './components/Camera';
import Result from './components/Result';

function App() {
    // App state: 'landing' | 'camera' | 'result'
    const [appState, setAppState] = useState('landing');

    // Captured data
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [capturedExpression, setCapturedExpression] = useState('neutral');

    // Handler for starting camera
    const handleStartCamera = useCallback(() => {
        setAppState('camera');
    }, []);

    // Handler for capturing photo
    const handleCapture = useCallback((photoDataUrl, expression) => {
        setCapturedPhoto(photoDataUrl);
        setCapturedExpression(expression);
        setAppState('result');
    }, []);

    // Handler for stopping/going back
    const handleStop = useCallback(() => {
        setAppState('landing');
        setCapturedPhoto(null);
        setCapturedExpression('neutral');
    }, []);

    // Handler for trying again
    const handleTryAgain = useCallback(() => {
        setCapturedPhoto(null);
        setCapturedExpression('neutral');
        setAppState('camera');
    }, []);

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
            {appState === 'landing' && (
                <Landing onStartCamera={handleStartCamera} />
            )}

            {appState === 'camera' && (
                <Camera
                    onCapture={handleCapture}
                    onStop={handleStop}
                />
            )}

            {appState === 'result' && (
                <Result
                    photo={capturedPhoto}
                    expression={capturedExpression}
                    onTryAgain={handleTryAgain}
                />
            )}
        </div>
    );
}

export default App;

import PropTypes from 'prop-types';

function Landing({ onStartCamera }) {
    return (
        <div className="card text-center fade-in max-w-md w-full">
            {/* Logo/Icon */}
            <div className="text-7xl mb-6 animate-bounce-slow">
                🐵
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-3">
                Monkey Expression
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                    Matcher
                </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-600 text-lg mb-8">
                Make a face and find your matching monkey meme! 🎭
            </p>

            {/* Expression preview grid */}
            <div className="flex justify-center gap-2 mb-8 flex-wrap">
                {['😄', '😲', '😐', '😢', '😠', '😨', '🤢'].map((emoji, i) => (
                    <span
                        key={i}
                        className="text-2xl p-2 bg-orange-100 rounded-lg transition-transform hover:scale-110"
                    >
                        {emoji}
                    </span>
                ))}
            </div>

            {/* Start button */}
            <button
                onClick={onStartCamera}
                className="btn-primary flex items-center justify-center gap-3 mx-auto"
                id="start-camera-btn"
            >
                <span>Start Camera</span>
                <span className="text-xl">📷</span>
            </button>

            {/* Privacy note */}
            <p className="text-xs text-gray-400 mt-6">
                All processing happens locally in your browser. No images are uploaded.
            </p>
        </div>
    );
}

Landing.propTypes = {
    onStartCamera: PropTypes.func.isRequired,
};

export default Landing;

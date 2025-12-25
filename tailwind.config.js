/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'monkey-orange': '#FF8C00',
                'monkey-yellow': '#FFD700',
                'monkey-brown': '#8B4513',
            },
            animation: {
                'bounce-slow': 'bounce 2s infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
            },
            keyframes: {
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(255, 140, 0, 0.5)' },
                    '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.8)' },
                }
            }
        },
    },
    plugins: [],
}

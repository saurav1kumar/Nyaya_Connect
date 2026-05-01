/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx}"
    ],
    theme: {
        extend: {
            colors: {
                clay: {
                    50: '#f8f9fc',
                    100: '#eef1f7',
                    200: '#dde3ef',
                    300: '#c4cde1',
                    400: '#a8b4d0',
                    500: '#8d9bbf',
                    600: '#7683ad',
                    700: '#636e95',
                    800: '#535c7a',
                    900: '#474e64',
                    950: '#2d3142',
                },
                accent: {
                    DEFAULT: '#6366f1',
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                surface: {
                    light: 'rgba(255, 255, 255, 0.65)',
                    dark: 'rgba(15, 23, 42, 0.65)',
                },
            },
            backdropBlur: {
                xs: '4px',
                clay: '20px',
            },
            boxShadow: {
                clay: '8px 8px 16px rgba(0,0,0,0.1), -4px -4px 12px rgba(255,255,255,0.6)',
                'clay-dark': '8px 8px 16px rgba(0,0,0,0.4), -4px -4px 12px rgba(255,255,255,0.05)',
                'clay-inset': 'inset 4px 4px 8px rgba(0,0,0,0.08), inset -4px -4px 8px rgba(255,255,255,0.5)',
                'clay-inset-dark': 'inset 4px 4px 8px rgba(0,0,0,0.3), inset -4px -4px 8px rgba(255,255,255,0.03)',
                'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'shimmer': 'shimmer 1.5s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
        },
    },
    plugins: [],
}
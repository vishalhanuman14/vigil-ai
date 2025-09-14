/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'qualcomm-blue': '#0070f0',   // pick your actual hex
                'qualcomm-dark': '#1a1a1a',
                'qualcomm-gray': '#f2f2f2',
                'qualcomm-red': '#e60000',
            }
        }
    },
    plugins: [],
}
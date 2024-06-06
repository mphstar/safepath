/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
    ],
    theme: {
        extend: {
            container: {
                center: true,
            },
            // poppins font
            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
            },
            colors: {
                primary: "#2338A5",
                colorText: "#393736",
            },
        },
    },
    plugins: [
      require('daisyui'),
    ],
};

module.exports = {
    plugins: {
        "@tailwindcss/postcss7-compat": {},
        autoprefixer: {},
        ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
    },
};

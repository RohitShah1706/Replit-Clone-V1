module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {

                targets: {

                    node: 'current',

                },

            },

        ],

        '@babel/preset-react', // Adds support for JSX
        // '@babel/plugin-syntax-flow',

    ],

    plugins: [],

};
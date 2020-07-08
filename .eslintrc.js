module.exports = {
    'env': {
        'commonjs': true,
        'es2020': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 11
    },
    'rules': {
        'eqeqeq' : 'error',
        'no-trailing-spaces' : 'error',
        'arrow-spacing' : [
            'error' , { 'before' : true, 'after' : true }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'no-console' : 0
    }
}

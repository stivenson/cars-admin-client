module.exports = {
    files: {
        javascripts: {
            joinTo: {
                'vendor.js': /^(?!app)/,
                'app.js': /^app/
            }
        },
        stylesheets: {
            joinTo: {
                'app.css': /^app/,
                'vendor.css': /^(?!app)/,
            },
            order: {
                before: [
                    'vendor/css/bootstrap.css',
                    'vendor/css/hint.css',
                    'vendor/css/blueprint.css',
                    'vendor/js/*.css'
                ]
            }
        }
    },
    plugins: {
        babel: {
            presets: ['es2015', 'stage-0'],
            plugins: ['mjsx']
        },
        postcss: {
            processors: [
                require('postcss-import')(),
                require('postcss-cssnext')(),
            ]
        }
    }
};

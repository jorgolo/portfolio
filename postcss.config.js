const postCssImport = require('postcss-import');
const PostcssPresetEnv = require('postcss-preset-env');
const CSSNano = require('cssnano');

module.exports = {
  plugins: [
    postCssImport(),
    PostcssPresetEnv(),
    CSSNano({
      preset: [ 'advanced',
        {
          calc: false,
        }
      ]
    }),
  ],
};
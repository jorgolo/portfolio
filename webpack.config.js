// archivos del core de node JS
const path = require('path');
const fs = require('fs');

// plugins de webpack
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const CopyPlugin = require("copy-webpack-plugin");
const WebpackShellPluginNext = require("webpack-shell-plugin-next");

// Obtenemos el modo en el que se ejecuta webpack con una variable de Ambiente
const isProduction = (process.env.NODE_ENV === 'production');
console.log("mode", process.env.NODE_ENV);

// Borramos la carpeta de ./dist/assets, para volver a construirla
if (fs.existsSync(path.resolve('./dist/assets'))) {
  fs.rmSync(path.resolve('./dist/assets'), { recursive: true });
  console.log('./dist/assets folder deleted');
} 

// creamos las configuraciones generales
const general_configuration = {
  mode: isProduction ? 'production' : 'development',
  context: path.resolve(__dirname),
  watchOptions: {
    ignored: /node_modules/,
  }
}

// creamos las configuraciones para los archivos JS
const js_configuration = {
  name: "scripts",
  devtool: isProduction ? undefined : 'eval-source-map',
  entry: {
    'critical': path.resolve('./src/js/main.js'),
  },
  output: {
    path: path.resolve('./dist/assets/js/' ),
    filename: 'bundle.[name].js',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 0,
      name: 'commons'
    }
  }
};

// creamos las configuraciones para los archivos CSS
const css_configuration = {
  name: "styles",
  entry: {
    'critical': path.resolve('./src/styles/critical.css'),
    'about-us': path.resolve('./src/styles/about-us-section/index.css'),
    'tech-section': path.resolve('./src/styles/tech-section/index.css'),
  },
  output: {
    path: path.resolve('./dist/assets/css/' ),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          { 
            loader: 'css-loader',
            options: {
              url: false,
              import: false,
            }
          },
          'postcss-loader',
        ],
      }
    ]
  },
  plugins: [
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'bundle.[name].css',
    }),
  ],
};

// configuracion para transladar archivos
const static_assets_configuration = {
  name: "static assets",
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve('./src/images'),
          to: path.resolve('./dist/assets/images')
        },
        {
          from: path.resolve('./src/fonts'),
          to: path.resolve('./dist/assets/fonts')
        }
      ],
    }),
    new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: [
          () => {
            fs.unlinkSync(path.resolve("./dist/main.js"));
          },
        ],
      },
    }),
  ],
};

// Juntamos las configuraciones
const js_final_confirguration = {...general_configuration , ...js_configuration};
const css_final_confirguration = {...general_configuration , ...css_configuration};

// Le damos las configuraciones a webpack
module.exports = [js_final_confirguration, css_final_confirguration, static_assets_configuration];

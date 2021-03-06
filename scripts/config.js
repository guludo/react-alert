const resolve = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-uglify')

const getPlugins = env => {
  const plugins = [
    resolve()
  ]

  if (env) {
    plugins.push(
      replace({
        'process.env.NODE_ENV': JSON.stringify(env)
      })
    )
  }

  plugins.push(
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: [
        ['env', { modules: false }],
        'stage-1',
        'react'
      ],
      plugins: ['external-helpers']
    }),
    commonjs({
      include: /node_modules/
    })
  )

  if (env === 'production') {
    plugins.push(uglify())
  }

  return plugins
}

const config = {
  input: 'src/index.js',
  output: {
    globals: {
      'react': 'React',
      'prop-types': 'PropTypes',
      'react-dom': 'ReactDOM',
      'react-transition-group': 'ReactTransitionGroup'
    }
  },
  external: [
    'react',
    'prop-types',
    'react-dom',
    'react-transition-group'
  ],
  plugins: getPlugins(process.env.BUILD_ENV)
}

if (process.env.BUILD_NAME) {
  config.output.name = process.env.BUILD_NAME
}

module.exports = config

module.exports = {
  compilerOptions: {
    baseUrl: './',
    paths: {
      'ts/*': ['./src/ts/*'],
      'components/*': ['./src/ts/components/*'],
    },
    outDir: './dist',
    target: 'es5',
    module: 'es6',
    jsx: 'react',
    noImplicitAny: true,
    allowSyntheticDefaultImports: true,
    moduleResolution: 'node',
    lib: ['dom', 'esnext'],
    esModuleInterop: true,
  },
}

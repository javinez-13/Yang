import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { transform } from 'esbuild';

const jsAsJsxPlugin = () => ({
  name: 'js-as-jsx',
  enforce: 'pre',
  async transform(code, id) {
    if (!id.endsWith('.js') || id.includes('node_modules')) {
      return null;
    }

    const result = await transform(code, {
      loader: 'jsx',
      jsx: 'automatic',
      jsxImportSource: 'react',
      sourcemap: true,
      sourcefile: id,
    });

    return {
      code: result.code,
      map: result.map,
    };
  },
});

export default defineConfig({
  plugins: [jsAsJsxPlugin(), react({ include: /\.(js|jsx)$/ })],
  resolve: {
    extensions: ['.js', '.json'],
  },
  esbuild: {
    loader: 'jsx',
    include: /\.(js|jsx)$/,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});



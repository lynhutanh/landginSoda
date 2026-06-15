module.exports = {
  api: {
    input: '../api/swagger.json',
    output: {
      mode: 'split',
      target: './src/services/api-sdk.ts',
      schemas: './src/services/api-schemas',
      client: 'swr',
      mock: false,
    },
  },
};

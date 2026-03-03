module.exports = {
  'task-project': {
    input: {
      // local
      target: 'http://localhost:8080/v3/api-docs',
    },
    output: {
      mode: 'tags-split', // API 태그별로 파일(User, Task, Collect)을 나눠서 생성
      target: 'src/api/generated/endpoints',
      schemas: 'src/api/generated/models',
      client: 'react-query',
      mock: false, // 일단은 false로 두고 필요할 때 켜세요
      prettier: true,
      override: {
        mutator: {
          path: './src/api/axios-instance.ts', // 내 커스텀 Axios 연결
          name: 'customInstance',
        },
      },
    },
  },
};

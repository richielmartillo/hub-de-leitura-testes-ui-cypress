const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'http://localhost:3000/',
    projectId: 'vxujf3',
    video: true,
    env: {
      testUserEmail: process.env.TEST_USER_EMAIL || '',
      testUserPassword: process.env.TEST_USER_PASSWORD || '',
      adminEmail: process.env.TEST_ADMIN_EMAIL || '',
      adminPassword: process.env.TEST_ADMIN_PASSWORD || '',
    },
  },
});

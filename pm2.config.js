module.exports = {
  apps: [
    {
      name: 'thebrainyinsights',
      script: 'pnpm',
      args: 'start',
      cwd: 'apps/web',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    },
  ],
};

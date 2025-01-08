module.exports = {
  apps: [
    {
      name: "daao_ai",
      script: "bun",
      args: "run start",
      cwd: __dirname,
      autorestart: true,
    },
  ],
};


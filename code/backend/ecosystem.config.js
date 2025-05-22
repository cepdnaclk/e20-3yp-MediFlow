module.exports = {
  apps: [
    {
      name: "mediflow-backend",
      script: "./src/index.js", 
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};

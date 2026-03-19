module.exports = {
  apps: [
    {
      name: "edufund",
      script: ".dist/server.js",
      interpreter: "/root/.bun/bin/bun",
      env: {
        NODE_ENV: "production",
        DATABASE_URL:
          "postgresql://lottery_app:eduLot2iznotjoke@localhost:5432/lottery?schema=public",
        PORT: 3000,
        JWT_SECRET: "LOTTIZNOTJOKE",
        X_API_KEY: "EDULOTTFOROPEN",
        DO_SPACES_KEY: "DO00EPK4Y39G23GC9K4K",
        DO_SPACES_SECRET: "nb8O6yERE5kopk6pYBU3Ofh/5qkHLSfGwAbwP17QRRM",
        DO_SPACES_BUCKET: "ts-space",
        DO_SPACES_REGION: "sgp1",
        DO_SPACES_ENDPOINT: "https://sgp1.digitaloceanspaces.com",
      },
    },
  ],
};
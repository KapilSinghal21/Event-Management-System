module.exports = {
  apps: [
    {
      name: "event-backend",
      script: "./src/server.js",
      cwd: "./backend",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5050,
        // Make sure backend is accessible
        HOST: "0.0.0.0"
      },
      error_file: "./logs/backend-error.log",
      out_file: "./logs/backend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    },
    {
      name: "event-frontend",
      script: "./server.js",
      cwd: "./frontend",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,  // Standard HTTP port for web
        // Optional: Use 3000 if you don't have root access
        // PORT: 3000,
        HOST: "0.0.0.0"
      },
      error_file: "./logs/frontend-error.log",
      out_file: "./logs/frontend-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z"
    }
  ]
};

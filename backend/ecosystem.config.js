module.exports = {
  apps: [{
    name: 'servigo-backend',
    script: './index.js',
    instances: 'max',  // Cluster mode for stability
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Low crash: Auto restart
    max_memory_restart: '1G',
    restart_delay: 3000,
    kill_timeout: 5000,
    listen_timeout: 3000,
    // Logs
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};


const axios = require('axios');

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = [
  // Backend only
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service',
  // Frontend only
  'api', 'hook', 'page', 'state', 'style',
  // Both
  'auth', 'config', 'middleware', 'utils'
];

const ACCESS_CODE = process.env.ACCESS_CODE;

async function Log(stack, level, packageName, message) {
  if (!VALID_STACKS.includes(stack)) return;
  if (!VALID_LEVELS.includes(level)) return;
  if (!VALID_PACKAGES.includes(packageName)) return;

  const logData = {
    stack,
    level,
    package: packageName,
    message,
    timestamp: new Date().toISOString()
  };

  try {
    await axios.post('http://20.244.56.144/evaluation-service/logs', logData, {
      headers: {
        'Content-Type': 'application/json',
        'access-code': ACCESS_CODE
      }
    });
  } catch (error) {
    // Do not use console.log
  }
}

module.exports = { Log }; 
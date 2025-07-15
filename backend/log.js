const axios = require('axios');

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];
const VALID_PACKAGES = [
 
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service',
  
  'api', 'hook', 'page', 'state', 'style',
  
  'auth', 'config', 'middleware', 'utils'
];

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
        'access-code': 'QAhDUr'
      }
    });
  } catch (error) {
    // Do not use console.log
  }
}

module.exports = { Log }; 
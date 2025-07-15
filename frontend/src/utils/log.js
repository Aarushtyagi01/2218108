import axios from 'axios';

export const Log = async (stack, level, packageName, message) => {
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
    // Error handling can be done here if needed, but do not use console.log
  }
}; 
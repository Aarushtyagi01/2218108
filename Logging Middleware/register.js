const axios = require('axios');

(async () => {
  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/register', {
      email: 'tyagiaarush555@gmail.com',
      name: 'aarush tyagi',
      mobileNo: '9997919846',
      githubUsername: 'arushtyagi01',
      rollNo: '2218108',
      accessCode: 'QAhDUr'
    });
    console.log('clientID:', response.data.clientID);
    console.log('clientSecret:', response.data.clientSecret);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
})();

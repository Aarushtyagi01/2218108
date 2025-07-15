const axios = require('axios');

(async () => {
  try {
    const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
      clientID: 'b6043635-c57e-4079-9268-a02dbe1fa3f1',     
      clientSecret: 'GMfjyqSpHxaQvdgv',                     
      accessCode: 'QAhDUr',                                  
      email: 'tyagiaarush555@gmail.com',                     
      name: 'aarush tyagi',                                 
      rollNo: '2218108'                                      
    });
    console.log('access_token:', response.data.access_token);
  } catch (error) {
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
})();
const axios = require('axios');

const API = "http://20.244.56.144/evaluation-service/logs";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ0eWFnaWFhcnVzaDU1NUBnbWFpbC5jb20iLCJleHAiOjE3NTI1NTkxNjMsImlhdCI6MTc1MjU1ODI2MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijc1NWZiZWNkLTFjMGQtNGMyMC05OWNlLTM1NTlhOTEzOTExZSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFhcnVzaCB0eWFnaSIsInN1YiI6ImI2MDQzNjM1LWM1N2UtNDA3OS05MjY4LWEwMmRiZTFmYTNmMSJ9LCJlbWFpbCI6InR5YWdpYWFydXNoNTU1QGdtYWlsLmNvbSIsIm5hbWUiOiJhYXJ1c2ggdHlhZ2kiLCJyb2xsTm8iOiIyMjE4MTA4IiwiYWNjZXNzQ29kZSI6IlFBaERVciIsImNsaWVudElEIjoiYjYwNDM2MzUtYzU3ZS00MDc5LTkyNjgtYTAyZGJlMWZhM2YxIiwiY2xpZW50U2VjcmV0IjoiR01manlxU3BIeGFRdmRndiJ9.ZEb-RdR2t5a25PJdeleuyyvt-Sn_lpp2SHLvk-dm60c";

async function Log(
  stack, 
  level, 
  pkg,
  message
) {
  try {
    const res = await axios.post(API, {
      stack,
      level,
      package: pkg,
      message
    }, {
      headers: {
        Authorization: TOKEN,
        "Content-Type": "application/json"
      }
    });
    return res.data;
  } catch (err) {
   
  }
}

module.exports = { Log };
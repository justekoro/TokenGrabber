const axios = require('axios').default;

module.exports = async () => {
  return await axios.get('http://ip-api.com/json/')
    .then(res => {
      if (res.status !== 200) return;
      return res.data;
    });
};

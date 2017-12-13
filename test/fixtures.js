const DirectConnection = require('../index');

console.log('found fixtures');

module.exports = {
     connection: new DirectConnection({
          name: "directConnection"
     })
};

const assert = require('assert');
const fixtures = require('../fixtures');

describe('DirectConnection', function() {
    it('can queue and dequeue messages', done => {
         fixtures.connection.start(err => {
            fixtures.connection.stream((err, message) => {
                assert(!err);
                assert(message);
                assert(message.body.number, 1);

                done();
            });

            fixtures.connection.enqueue([{
                body: {
                    number: 1
                }
            }], err => {
                assert(!err);
            });
         });
     });
});

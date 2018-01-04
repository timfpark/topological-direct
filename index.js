const async = require('async'),
      { Connection } = require("topological");

class DirectConnection extends Connection {
    constructor(config) {
        super(config);

        this.awaitingMessage = [];
    }

    start(callback) {
        super.start(err => {
            this.messages = [];
            return callback(err);
        });
    }

    failed(message, callback) {
        this.enqueue(message, callback);
    }

    enqueue(messages, callback) {
        console.log(`${this.id}: enqueuing ${JSON.stringify(messages)}`);
        this.messages = this.messages.concat(messages);

        this.handleAnyWaitingRequests();

        return callback();
    }

    handleAnyWaitingRequests() {
        if (this.awaitingMessage.length > 0) {
            let oldestRequest = this.awaitingMessage.shift();
            this.dequeue(oldestRequest);
        }
    }

    stream(callback) {
        async.whilst(
            () => {
                return this.started;
            }, iterationCallback => {
                this.dequeue( (err, message) => {
                    callback(err, message);
                    return iterationCallback();
                });
            }, err => {
                console.log(`${this.id}: message loop for input stopping. err: ${err}`);
            }
        );
    }

    dequeue(callback) {
        if (!this.paused && this.messages.length > 0) {
            let message = this.messages.shift();
            console.log(`${this.id}: dequeuing ${JSON.stringify(message)}`);
            return callback(null, message);
        } else {
            this.awaitingMessage.push(callback);
        }
    }

    resume(callback) {
        super.resume(err => {
            if (err) return callback(err);

            this.handleAnyWaitingRequests();

            if (callback) return callback();
        });
    }
}

module.exports = DirectConnection;

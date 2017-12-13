const { Connection } = require("topological");

class DirectConnection extends Connection {
    constructor(config) {
        super(config);

        this.awaitingDequeue = [];
    }

    start(callback) {
        this.messages = [];
        return callback();
    }

    failed(message, callback) {
        this.enqueue(message, callback);
    }

    enqueue(messages, callback) {
        console.log(`${this.id}: enqueuing ${JSON.stringify(messages)}`);
        this.messages = this.messages.concat(messages);

        if (this.awaitingDequeue.length > 0) {
            let oldestWaiter = this.awaitingDequeue.shift();
            this.dequeue(oldestWaiter);
        }

        return callback();
    }

    dequeue(callback) {
        if (this.messages.length > 0) {
            let message = this.messages.shift();
            console.log(`${this.id}: dequeuing ${JSON.stringify(message)}`);
            return callback(null, message);
        } else {
            this.awaitingDequeue.push(callback);
        }
    }
}

module.exports = DirectConnection;

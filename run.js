'use strict';

const createTestCafe = require('./lib');
let runner           = null;

process.on('unhandledRejection', function(reason, p){
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

createTestCafe('localhost', 1337, 1338)
    .then(testcafe => {
        runner = testcafe.createRunner();
    })
    .then(() => {
        return runner
            .src('test.js')
            .browsers(['chrome'])
            .run();
    })
    .then(failedCount => {
        process.exit(failedCount);
    })
    .catch((err) => console.log(err));

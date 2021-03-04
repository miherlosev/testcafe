process.argv = [
    process.argv0,
    'testcafe',
    'chrome --auto-open-devtools-for-tabs',
    'test.js'
];

require('./lib/cli');

fixture `test`
    .page('http://mail.ru/');

test('test', async t => {
    await t.click('body');
});

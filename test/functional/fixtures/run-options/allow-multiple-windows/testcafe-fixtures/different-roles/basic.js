import { Role, Selector } from 'testcafe';

const loginPageModel = {
    url:    'http://localhost:3000/fixtures/run-options/allow-multiple-windows/pages/different-roles/login.html',
    user:   Selector('input[type=text]'),
    submit: Selector('input[type=submit]')
};

const indexPageModel = {
    url:      'http://localhost:3000/fixtures/run-options/allow-multiple-windows/pages/different-roles/index.html',
    loggedAs: Selector('#logged-as')
};

const userRole = Role(loginPageModel.url, async t => {
    await t
        .typeText(loginPageModel.user, 'user')
        .click(loginPageModel.submit);
});

const adminRole = Role(loginPageModel.url, async t => {
    await t
        .typeText(loginPageModel.user, 'admin')
        .click(loginPageModel.submit);
});

fixture `Different roles`
    .page(indexPageModel.url);

test('basic', async t => {
    await t
        .expect(indexPageModel.loggedAs.innerText).eql('')
        .useRole(userRole)
        .expect(indexPageModel.loggedAs.innerText).eql('user')
        .openWindow(indexPageModel.url)
        .expect(indexPageModel.loggedAs.innerText).eql('user')
        .useRole(adminRole)
        .expect(indexPageModel.loggedAs.innerText).eql('admin');
});

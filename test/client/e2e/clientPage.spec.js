const expect = require('chai').expect,
			protractor = require('protractor');

describe('Страница клиента', function () {
	let authModal;

	before(() => {
		browser.get('http://localhost:3000/#!/');
		authModal = element(by.css('#authModal'));
	});

	it('Модал регистрации', function () {
		authModal.isPresent().then(isExists => {
			expect(isExists).to.equal(true);
		});
	});

	it('Проверить необходимые поля', () => {
		let reqs = $$('input:required');
		reqs.each((req, i) => {
			req.sendKeys('###').clear();
			expect((req).getAttribute('class')).eventually.to.contain('ng-invalid-required');
		})
	});

	it('Заполнить необходимые поля', () => {
		let reqs = $$('input:required'),
			EC = protractor.ExpectedConditions;
		$$('input#userName').sendKeys('Ann');
		$$('input#userEmail').sendKeys('Ann@mail.ru');
		element(by.css('button[type=submit]')).click();
		browser.wait(EC.invisibilityOf(authModal), 3000);
	});
});
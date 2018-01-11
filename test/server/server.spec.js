const appUrl = 'http://localhost:3000';

let server = require('../../server/index');

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('Сервер', () => {
	let seed = Math.random()*10,
		user = {
			name: 'Ann' + seed,
			email: 'ann' + seed + '@test.com'
		},
		dish = {
			"title": "Cheese Popovers",
			"image": "https://spoonacular.com/recipeImages/Cheese-Popovers-517616.jpg",
			"id": 517616,
			"rating": 188,
			"ingredients": [
				"eggs",
				"flour",
				"milk",
				"paprika",
				"parmesan cheese",
				"salt",
				"salted butter"
			],
			"price": 27
		},
		orderId,
		clientId;

	describe('Аутентификация', () => {
		it('Регистрация нового пользователя', (done) => {
			chai.request(appUrl)
				.post('/auth/')
				.send(user)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('_id');
					clientId = res.body._id ? res.body._id : '';
					res.body.should.have.property('balance');
					res.body.name.should.deep.equal(user.name);
					res.body.email.should.deep.equal(user.email);
					done();
				});
		});
	});

	describe('Меню', () => {
		it('Получение меню', (done) => {
			chai.request(appUrl)
				.get('/menu/')
				.send()
				.end((err, res) => {
					// console.log(res);
					res.should.have.status(200);
					(JSON.parse(res.text)).should.be.a('array');
					(JSON.parse(res.text)).length.should.equal(50);
					done();
				});
		});
	});

	describe('Клиент', () => {
		it('Получение информации о клиенте', (done) => {
			chai.request(appUrl)
				.get('/client/' + clientId)
				.send()
				.end((err, res) => {
					// console.log(res);
					res.should.have.status(200);
					res.body.name.should.deep.equal(user.name);
					res.body.email.should.deep.equal(user.email);
					done();
				});
		});

		it('Получение заказов клиента', (done) => {
			chai.request(appUrl)
				.get('/client/' + clientId + '/orders')
				.send()
				.end((err, res) => {
					// console.log(res);
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});

		it('Создание заказа клиента', (done) => {
			chai.request(appUrl)
				.post('/client/' + clientId + '/orders')
				.send({dish: dish})
				.end((err, res) => {
					// console.log(res);
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('_id');
					orderId = res.body._id ? res.body._id : '';
					res.body.dish.title.should.equal(dish.title);
					done();
				});
		});
	});

	describe('Кухня', () => {
		it('Получение списка заказов', (done) => {
			chai.request(appUrl)
				.get('/kitchen/orders/ordered')
				.send()
				.end((err, res) => {
					// console.log(res);
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});

		it('Получение списка готовки', (done) => {
			chai.request(appUrl)
				.get('/kitchen/orders/cooking')
				.send()
				.end((err, res) => {
					// console.log(res);
					res.should.have.status(200);
					res.body.should.be.a('array');
					done();
				});
		});

		it('Изменение статуса заказа', (done) => {
			const status = 'cooking';
			chai.request(appUrl)
				.put('/kitchen/orders/' + orderId)
				.send({status: status})
				.end((err, res) => {
					// console.log(res.body);
					res.should.have.status(200);
					res.body.status.should.equal(status);
					done();
				});
		});
	});

});
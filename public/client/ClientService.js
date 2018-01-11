angular
	.module('droneCafeApp')
	.factory('ClientService', function($http, $sessionStorage, AuthService) {
		var client = {};

		client.getClientId = function() {
			return $sessionStorage.clientDC ? $sessionStorage.clientDC.id : '';
		};

		client.getCurrentInfo = function() {
			return $http.get('/client/' + client.id)
				.then(function(res) {
					return res.data;
				})
		};

		client.updateBalanceBy = function(balanceValue) {
			var data = {
				balance: balanceValue
			};
			return $http.put('/client/' + client.getClientId(), JSON.stringify(data))
				.then(function(res) {
					return res.data;
				})
		};

		client.updateLocalData = function(dataObject) {
			$sessionStorage.clientDC = dataObject;
		};

		client.getMenu = function () {
			return $http.get('/menu')
				.then(function(res) {
					return res.data;
				})
		};

		client.orderDish = function(clientId, dish) {
			var data = JSON.stringify({dish: dish});
			return $http.post('/client/' + clientId + '/orders', data)
				.then(function(res) {
					return client.updateBalanceBy(-dish.price)
				})
		};

		client.getOrders = function(clientId) {
			return $http.get('/client/' + clientId + '/orders')
				.then(function(res) {
					return res.data;
				})
		};

		return client;
	});
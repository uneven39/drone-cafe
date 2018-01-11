angular
	.module('droneCafeApp')
	.factory('KitchenService', function($http, ) {
		var kitchen = {};

		kitchen.getOrdersByStatus = function (status) {
			if ((status === 'ordered') || (status === 'cooking')) {
				return $http.get('/kitchen/orders/' + status)
					.then(function(res) {
						return res.data;
					})
			} else {
				return new Error('invalid orders status');
			}
		};

		kitchen.updateOrderStatus = function(orderId, newStatus) {
			var data = {
				status: newStatus
			};
			return $http.put('/kitchen/orders/' + orderId, JSON.stringify(data))
				.then(function(res) {
					return res.data;
				});
		};

		return kitchen;
	});
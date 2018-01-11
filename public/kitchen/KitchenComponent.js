angular
	.module('droneCafeApp')
	.component('kitchenComponent', {
		templateUrl: 'kitchen/KitchenComponent.html',
		controller: function (KitchenService) {
			var vm = this,
				socket = io();

			vm.$onInit = function () {
				vm.updateOrdersLists();
			};

			vm.updateOrdersLists = function () {
				KitchenService.getOrdersByStatus('ordered')
					.then(function(res) {
						// console.log('all ordered dishes: ', res);
						vm.orders = res;
					})
					.catch(function(error) {
						console.warn('get all orders error: ', error);
					});
				KitchenService.getOrdersByStatus('cooking')
					.then(function(res) {
						// console.log('all ordered dishes: ', res);
						vm.ordersCooking = res;
					})
					.catch(function(error) {
						console.warn('get all cooking orders error: ', error);
					})
			};

			vm.startCooking = function (order) {
				KitchenService.updateOrderStatus(order._id, 'cooking')
					.then(function(res) {
						console.log(res);
						socket.emit('orderStarted', order.clientId);
					})
					.catch(function(error) {
						console.warn('start order cooking error: ', error);
					})
			};

			vm.finishCooking = function (order) {
				KitchenService.updateOrderStatus(order._id, 'delivering')
					.then(function(res) {
						console.log(res);
						socket.emit('orderFinished', order.clientId);
					})
					.catch(function(error) {
						console.warn('finish order cooking error: ', error);
					})
			};

			socket.on('ordersUpdated', function(clientId) {
				console.log('ordersUpdated: ', clientId);
				vm.updateOrdersLists();
			})
		}
	});
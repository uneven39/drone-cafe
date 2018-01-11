angular
	.module('droneCafeApp')
	.component('clientComponent', {
		templateUrl: 'client/ClientComponent.html',
		controller: function(AuthService, ClientService, $sessionStorage) {
			var vm = this,
				socket = io();

			vm.$onInit = function () {
				vm.isLoggedIn = AuthService.isLogged();
				$('#authModal').modal();
				if (vm.isLoggedIn) {
					$('#authModal').modal('close');
					vm.initAccount(true);
				} else {
					$('#authModal').modal('open');
				}
			};

			vm.initAccount = function(logged) {
				if (logged) {
					$('#authModal').modal('close');
					socket.emit('connection');
					vm.isLoggedIn = true;
					vm.clientInfo = $sessionStorage.clientDC;
					vm.clientOrders = [];
					vm.menuIsFilled = false;
					ClientService.getMenu()
						.then(function(res) {
							console.log(res);
							vm.menu = res;
						})
						.catch(error => {
							console.warn(error);
						});
					vm.updateOrders();
				}
			};

			vm.menuLoaded = function () {
				vm.menuIsFilled = true;
			};

			vm.updateOrders = function () {
				ClientService.getOrders(vm.clientInfo.id)
					.then(function(res) {
						// console.log('client orders: ', res);
						vm.clientOrders = res;
					})
					.catch(error => {
						console.warn(error);
					});
			};

			vm.updateBalanceBy = function (value) {
				ClientService.updateBalanceBy(value)
					.then(res => {
						// console.log(res);
						vm.clientInfo.balance = res.balance;
						ClientService.updateLocalData(vm.clientInfo);
					})
					.catch(error => {
						console.warn(error);
					})
			};

			vm.orderItem = function(dish) {
				ClientService.orderDish(vm.clientInfo.id, dish)
					.then(function(res) {
						// console.log('after order: ', res);
						vm.clientInfo.balance = res.balance;
						ClientService.updateLocalData(vm.clientInfo);
						socket.emit('orderCreated', vm.clientInfo.id);
						vm.updateOrders();
					})
					.catch(function(error) {
						console.warn('order error: ', error)
					})
			};

			socket.on('ordersUpdated', function(clientId) {
				if (clientId === vm.clientInfo.id) {
					console.log('ordersUpdated: ', clientId);
					vm.updateOrders();
				}
			})

		}
	});
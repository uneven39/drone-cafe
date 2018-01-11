angular
	.module('droneCafeApp')
	.component('authComponent', {
		templateUrl: 'auth/AuthComponent.html',
		bindings: {
			initAccount: '<'
		},
		controller: function(AuthService) {
			var vm = this;

			console.log(AuthService.isLogged());

			vm.login = function(name, email){
				AuthService.logIn(name, email)
					.then(function (res) {
						vm.initAccount(true);
					})
					.catch(function(error) {
						console.warn(error);
						vm.initAccount(false);
					})
			}
			}
	});
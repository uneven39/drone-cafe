'use strict';

angular
	.module('droneCafeApp')
	.component('mainMenuComponent', {
		templateUrl: 'mainMenu/MainMenuComponent.html',
		controller: function (AuthService) {
			var vm = this;

			vm.isLogged = AuthService.isLogged();

			vm.logout = function() {
				AuthService.logOut();
				vm.isLogged = false;
			};
		}
	});
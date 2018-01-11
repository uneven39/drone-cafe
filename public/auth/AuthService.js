angular
	.module('droneCafeApp')
	.factory('AuthService', function($http, $sessionStorage) {
		var auth = {},
			localName = $sessionStorage.clientDC ? $sessionStorage.clientDC.name : '',
			localEmail = $sessionStorage.clientDC ? $sessionStorage.clientDC.email : '';

		auth.isLogged = function() {
			console.log($sessionStorage.clientDC);
			return !!(localName && localEmail);
		};

		auth.logIn = function(login, email) {
			return $http.post('/auth',
				JSON.stringify({name: login, email: email}),
				{headers : {'Content-Type': 'application/json; charset=utf-8'}})
				.then(function(res) {
					console.log('success: ', res);
						$sessionStorage.clientDC = {
							name:			res.data.name,
							email:		res.data.email,
							id:				res.data._id,
							balance:	res.data.balance
						};
					return $sessionStorage.clientDC;
					})
		};

		auth.logOut = function() {
			console.log('log out');
			delete $sessionStorage.clientDC;
		};

		return auth;
	});
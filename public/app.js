var routeConfig = function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state({
			name: 'main',
			url: '/',
			component: 'clientComponent'
		})
		.state({
			name: 'kitchen',
			url: '/kitchen',
			component: 'kitchenComponent'
		})
		.state({
			name: 'auth',
			url: '/auth',
			component: 'authComponent'
		});

	$urlRouterProvider
		.when('', '/')
		.otherwise('/');
};

angular
	.module('droneCafeApp', ['ui.router', 'ngMessages', 'ngStorage'])
	.config(routeConfig);
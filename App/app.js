var myNinjaApp = angular.module('myNinjaApp', ['ngRoute']);

myNinjaApp.config(['$routeProvider', function($routeProvider){

    $routeProvider
        .when('/home', {
            templateUrl: 'views/home.html'})
        .when('/teams', {
                templateUrl: 'views/teams.html',
                controller: 'NinjaController'})
        .when('/standings', {
            templateUrl: 'views/standings.html',
            controller: 'NinjaController'})
        .otherwise({
            redirectTo: '/home'
        });

}]);

myNinjaApp.controller('NinjaController', ['$scope', '$http', function($scope,$http){



$http.get('data/owners.json').then(function(response){
$scope.owners = response.data;
});

$http.get('data/teams.json').then(function(response){
    $scope.teams = response.data;
    });
    

}]);
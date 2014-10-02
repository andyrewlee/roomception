var myApp = angular.module('myApp', ['ngRoute']);

myApp.config(function($routeProvider){
  $routeProvider
    .when('/',
    {
      templateUrl: './../views/partials/login.html'
    })
    .otherwise(
    {
      redirectTo: '/'
    });
});

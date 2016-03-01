angular.module('app', [])
  .directive('simpleDirective', SimpleDirective);



function SimpleDirective() {
  return {
    restrict: 'E',
    template: '<div>{{greeting}}</div>',
    controller: function($scope) {
      $scope.greeting = "Hello World";
    }
  }
}

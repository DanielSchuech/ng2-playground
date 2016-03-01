angular.module('app', [])
  .directive('simple', SimpleDirective);



function SimpleDirective() {
  return {
    restrict: 'E',
    template: '<div>{{vm.greeting}}</div>',
    controller: function() {
      this.greeting = "Hello World";
    },
    controllerAs: 'vm'
  }
};


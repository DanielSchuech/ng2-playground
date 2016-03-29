angular.module('app', [])
  .directive('simple', SimpleDirective)
  .directive('highlight', Highlight);



function SimpleDirective() {
  return {
    restrict: 'E',
    template: '<div highlight>{{vm.greeting}}</div>',
    controller: function() {
      this.greeting = "Hello World";
    },
    controllerAs: 'vm'
  }
};

function Highlight() {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      var el = element[0];
      el.addEventListener('mouseover', function() {
        element.addClass('testclass');
      });
      el.addEventListener('mouseout', function() {
        element.removeClass('testclass');
      });
    },
    template: ''
  };
}


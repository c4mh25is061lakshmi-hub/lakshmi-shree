
var app = angular.module("myApp", []);

app.controller("myCtrl", function($scope) {

    $scope.student = {};
    $scope.submitted = false;

    $scope.submit = function(form) {

        if (form.$valid) {
            $scope.submitted = true;
        }

    };

});

// Custom Filter
app.filter("uppercaseText", function() {

    return function(input) {
        return input ? input.toUpperCase() : "";
    };

});

// Custom Directive
app.directive("highlight", function() {

    return {
        restrict: "A",

        link: function(scope, element) {
            element.css({
                "color": "blue",
                "background-color": "yellow",
                "padding": "10px"
            });
        }
    };

});

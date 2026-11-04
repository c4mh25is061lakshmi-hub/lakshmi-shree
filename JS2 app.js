var app = angular.module('studentApp', []);

// Parent Controller
app.controller('CollegeController', ['$scope', function($scope) {
    $scope.collegeName = "Maharaja Institute of Technology";
}]);

// Child Controller
app.controller('StudentController', ['$scope', function($scope) {
    // Initial array containing at least three sample student names
    $scope.students = ['Mahalakshmi', 'Neelashree', 'Lakshmi'];

    // Initial visibility state for details section (hidden by default)
    $scope.showDetails = false;

    // Toggle function for show/hide details
    $scope.toggleDetails = function() {
        $scope.showDetails = !$scope.showDetails;
    };

    // Add student function using ng-click
    $scope.addStudent = function() {
        if ($scope.inputName && $scope.inputName.trim() !== "") {
            // Push name (or formatted details) to the list
            let studentInfo = $scope.inputName + ($scope.inputDepartment ? " (" + $scope.inputDepartment + ")" : "");
            $scope.students.push(studentInfo);

            // Clear the name input (and other inputs if desired) after adding
            $scope.inputName = "";
            $scope.inputDepartment = "";
            $scope.inputSemester = "";
        }
    };
}]);



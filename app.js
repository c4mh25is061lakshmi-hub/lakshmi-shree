var app = angular.module("studentApp", []);

app.controller("StudentController", function ($scope, $http) {
    var SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
    var SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY";
    var USE_SUPABASE = false;
    var API_URL = SUPABASE_URL + "/rest/v1/students";

    function headers(prefer) {
        var h = {
            "apikey": SUPABASE_KEY,
            "Authorization": "Bearer " + SUPABASE_KEY,
            "Content-Type": "application/json"
        };
        if (prefer) h["Prefer"] = prefer;
        return h;
    }

    // Sample Data
    $scope.students = [
        { id: 1, roll_no: "CS101", name: "Ananya Rao", branch: "CS", gpa: 8.9, email: "ananya@univ.edu", gender: "Female" },
        { id: 2, roll_no: "EC204", name: "Vikram Das", branch: "EC", gpa: 7.4, email: "vikram@univ.edu", gender: "Male" },
        { id: 3, roll_no: "ME305", name: "Rahul Kumar", branch: "ME", gpa: 8.1, email: "rahul@univ.edu", gender: "Male" },
        { id: 4, roll_no: "IS401", name: "Priya Sharma", branch: "IS", gpa: 9.2, email: "priya@univ.edu", gender: "Female" }
    ];

    // Form & UI States
    $scope.newStudent = {};
    $scope.editingStudent = false;
    $scope.loading = false;
    $scope.searchText = "";
    $scope.branchFilter = "";
    $scope.sortColumn = "name";
    $scope.reverseSort = false;
    $scope.message = "";
    $scope.errorMessage = "";

    // Load from Supabase
    $scope.loadStudents = function () {
        if (!USE_SUPABASE) return;
        $scope.loading = true;
        $http.get(API_URL + "?select=*", { headers: headers() })
            .then(res => { $scope.students = res.data; $scope.loading = false; })
            .catch(() => { $scope.loading = false; $scope.errorMessage = "Unable to load students."; });
    };

    // Save (Add or Update)
    $scope.saveStudent = function () {
        $scope.message = $scope.errorMessage = "";
        var s = angular.copy($scope.newStudent);

        if (!s.name || !s.roll_no || !s.branch || !s.email || s.gpa == null || !s.gender) {
            $scope.errorMessage = "Please fill all fields."; return;
        }
        if (s.gpa < 0 || s.gpa > 10) {
            $scope.errorMessage = "GPA must be between 0 and 10."; return;
        }

        if ($scope.editingStudent) {
            if (!USE_SUPABASE) {
                var idx = $scope.students.findIndex(x => x.id === s.id);
                if (idx !== -1) $scope.students[idx] = s;
                $scope.finishSave("Student updated successfully!");
                return;
            }
            var updateData = angular.copy(s); delete updateData.id; delete updateData.created_at;
            $http.patch(API_URL + "?id=eq." + encodeURIComponent(s.id), updateData, { headers: headers("return=representation") })
                .then(res => {
                    if (!res.data.length) throw new Error();
                    $scope.loadStudents(); $scope.finishSave("Student updated successfully!");
                })
                .catch(err => { $scope.errorMessage = err.data?.message || "Unable to update student."; });
        } else {
            if (!USE_SUPABASE) {
                if ($scope.students.some(x => x.roll_no.toLowerCase() === s.roll_no.toLowerCase())) {
                    $scope.errorMessage = "Roll number already exists!"; return;
                }
                s.id = Date.now();
                $scope.students.push(s);
                $scope.finishSave("Student added successfully!");
                return;
            }
            delete s.id;
            $http.post(API_URL, s, { headers: headers("return=representation") })
                .then(() => { $scope.loadStudents(); $scope.finishSave("Student added successfully!"); })
                .catch(err => { $scope.errorMessage = err.data?.message || "Unable to add student."; });
        }
    };

    $scope.finishSave = function (text) {
        $scope.message = text;
        $scope.newStudent = {};
        $scope.editingStudent = false;
    };

    $scope.editStudent = function (student) {
        $scope.newStudent = angular.copy(student);
        $scope.editingStudent = true;
        $scope.message = $scope.errorMessage = "";
        window.scrollTo(0, 0);
    };

    $scope.cancelEdit = function () {
        $scope.newStudent = {};
        $scope.editingStudent = false;
        $scope.message = $scope.errorMessage = "";
    };

    $scope.deleteStudent = function (student) {
        if (!window.confirm("Are you sure you want to delete " + student.name + "?")) return;

        if (!USE_SUPABASE) {
            $scope.students = $scope.students.filter(s => s.id !== student.id);
            $scope.message = "Student deleted successfully!";
            return;
        }

        $http.delete(API_URL + "?id=eq." + encodeURIComponent(student.id), { headers: headers("return=representation") })
            .then(res => {
                if (!res.data.length) { $scope.errorMessage = "Student could not be deleted."; return; }
                $scope.loadStudents(); $scope.message = "Student deleted successfully!";
            })
            .catch(err => { $scope.errorMessage = err.data?.message || "Unable to delete student."; });
    };

    // Filters & Counts
    $scope.branchFilterFn = function (student) {
        return !$scope.branchFilter || student.branch === $scope.branchFilter;
    };

    $scope.getBranchCount = function (branch) {
        return $scope.students.filter(s => s.branch === branch).length;
    };

    $scope.getGenderCount = function (gender) {
        return $scope.students.filter(s => s.gender === gender).length;
    };

    $scope.filteredCount = function () {
        var search = ($scope.searchText || "").toLowerCase();
        return $scope.students.filter(s => {
            var matchSearch = !search || s.name.toLowerCase().includes(search) || s.roll_no.toLowerCase().includes(search) || s.email.toLowerCase().includes(search) || s.branch.toLowerCase().includes(search);
            var matchBranch = !$scope.branchFilter || s.branch === $scope.branchFilter;
            return matchSearch && matchBranch;
        }).length;
    };

    // Init
    $scope.loadStudents();
});
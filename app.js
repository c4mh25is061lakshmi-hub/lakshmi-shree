/**
 * @file app.js
 * Student Cohort Management Portal - AngularJS Controller
 */

// 1. Initialize AngularJS Application Module
var app = angular.module('studentPortalApp', []);

// 2. Custom Pagination Filter: startFrom
// Slices array based on start index for pagination
app.filter('startFrom', function() {
  return function(input, start) {
    if (!input || !input.length) return [];
    start = +start;
    return input.slice(start);
  };
});

// 3. Main Controller with $scope and $http
app.controller('StudentController', function($scope, $http) {

  // Initial Sample Cohort Data (Matches lab syllabus specification)
  $scope.defaultStudents = [
    { id: 1, rollNo: "CS101", name: "Ananya Rao", branch: "CS", gpa: 8.9, email: "ananya@univ.edu", gender: "Female" },
    { id: 2, rollNo: "EC204", name: "Vikram Das", branch: "EC", gpa: 7.4, email: "vikram@univ.edu", gender: "Male" },
    { id: 3, rollNo: "IS305", name: "Priyanka Sen", branch: "IS", gpa: 9.3, email: "priyanka.sen@univ.edu", gender: "Female" },
    { id: 4, rollNo: "ME402", name: "Rohan Kulkarni", branch: "ME", gpa: 6.8, email: "rohan.k@univ.edu", gender: "Male" },
    { id: 5, rollNo: "CS110", name: "Devika Nair", branch: "CS", gpa: 9.1, email: "devika.nair@univ.edu", gender: "Female" },
    { id: 6, rollNo: "AI108", name: "Arjun Mehta", branch: "AI", gpa: 8.4, email: "arjun.m@univ.edu", gender: "Male" },
    { id: 7, rollNo: "EC215", name: "Sneha Chawla", branch: "EC", gpa: 8.2, email: "sneha.c@univ.edu", gender: "Female" },
    { id: 8, rollNo: "IS312", name: "Karthik Subramanian", branch: "IS", gpa: 7.9, email: "karthik.s@univ.edu", gender: "Male" },
    { id: 9, rollNo: "CS125", name: "Tanvi Agarwal", branch: "CS", gpa: 8.7, email: "tanvi.a@univ.edu", gender: "Female" },
    { id: 10, rollNo: "ME418", name: "Aditya Verma", branch: "ME", gpa: 7.2, email: "aditya.v@univ.edu", gender: "Male" },
    { id: 11, rollNo: "AI115", name: "Meera Nambiar", branch: "AI", gpa: 9.5, email: "meera.n@univ.edu", gender: "Female" },
    { id: 12, rollNo: "EC220", name: "Farhan Siddiqui", branch: "EC", gpa: 6.9, email: "farhan.s@univ.edu", gender: "Male" }
  ];

  // Load from browser localStorage, or fallback to default dataset
  var saved = localStorage.getItem('cohort_students');
  if (saved) {
    try {
      $scope.students = JSON.parse(saved);
    } catch(e) {
      $scope.students = angular.copy($scope.defaultStudents);
    }
  } else {
    $scope.students = angular.copy($scope.defaultStudents);
  }

  // Branch Departments
  $scope.branches = ['CS', 'EC', 'ME', 'IS', 'AI'];

  $scope.getBranchFullName = function(code) {
    var map = {
      'CS': 'Computer Science',
      'EC': 'Electronics & Communication',
      'ME': 'Mechanical Engineering',
      'IS': 'Information Science',
      'AI': 'Artificial Intelligence'
    };
    return map[code] || code;
  };

  // Form State & Two-way Binding Models
  $scope.isEditing = false;
  $scope.currentEditId = null;
  $scope.currentEditRollNo = '';
  $scope.formSubmitted = false;
  $scope.duplicateRollError = false;

  $scope.resetForm = function() {
    $scope.formData = {
      name: '',
      rollNo: '',
      branch: '',
      gpa: '',
      email: '',
      gender: 'Female'
    };
    $scope.isEditing = false;
    $scope.currentEditId = null;
    $scope.currentEditRollNo = '';
    $scope.formSubmitted = false;
    $scope.duplicateRollError = false;
  };

  $scope.resetForm();

  // Search, Filter, and Sort Controls
  $scope.searchText = '';
  $scope.selectedBranch = '';
  $scope.sortField = 'rollNo';
  $scope.reverseSort = false;

  // Custom filter for instant search across Name, RollNo, Email & Branch
  $scope.customFilter = function(student) {
    if ($scope.selectedBranch && student.branch !== $scope.selectedBranch) {
      return false;
    }

    if (!$scope.searchText) {
      return true;
    }

    var query = $scope.searchText.toLowerCase();
    var matchName = student.name.toLowerCase().indexOf(query) !== -1;
    var matchRoll = student.rollNo.toLowerCase().indexOf(query) !== -1;
    var matchEmail = student.email.toLowerCase().indexOf(query) !== -1;
    var matchBranch = student.branch.toLowerCase().indexOf(query) !== -1;

    return matchName || matchRoll || matchEmail || matchBranch;
  };

  $scope.sortBy = function(field) {
    if ($scope.sortField === field) {
      $scope.reverseSort = !$scope.reverseSort;
    } else {
      $scope.sortField = field;
      $scope.reverseSort = false;
    }
  };

  // Pagination Logic (10 per page)
  $scope.currentPage = 1;
  $scope.pageSize = 10;

  $scope.getFilteredStudents = function() {
    return $scope.students.filter($scope.customFilter);
  };

  $scope.numberOfPages = function() {
    var filtered = $scope.getFilteredStudents();
    return Math.ceil(filtered.length / $scope.pageSize) || 1;
  };

  $scope.getUpperBound = function() {
    var totalFiltered = $scope.getFilteredStudents().length;
    var end = $scope.currentPage * $scope.pageSize;
    return end > totalFiltered ? totalFiltered : end;
  };

  // Save / Register / In-Place Edit with Validation
  $scope.saveStudent = function() {
    $scope.formSubmitted = true;
    $scope.duplicateRollError = false;

    if ($scope.studentFormEl.$invalid) {
      return;
    }

    var cleanRoll = $scope.formData.rollNo.trim().toUpperCase();
    var parsedGpa = parseFloat($scope.formData.gpa);

    // Roll number uniqueness validation
    var duplicate = $scope.students.some(function(s) {
      return s.rollNo.toUpperCase() === cleanRoll && s.id !== $scope.currentEditId;
    });

    if (duplicate) {
      $scope.duplicateRollError = true;
      return;
    }

    if ($scope.isEditing) {
      // In-place edit
      for (var i = 0; i < $scope.students.length; i++) {
        if ($scope.students[i].id === $scope.currentEditId) {
          $scope.students[i].name = $scope.formData.name.trim();
          $scope.students[i].rollNo = cleanRoll;
          $scope.students[i].branch = $scope.formData.branch;
          $scope.students[i].gpa = parsedGpa;
          $scope.students[i].email = $scope.formData.email.trim();
          $scope.students[i].gender = $scope.formData.gender;
          break;
        }
      }
    } else {
      // New Registration
      var newStudent = {
        id: Date.now(),
        rollNo: cleanRoll,
        name: $scope.formData.name.trim(),
        branch: $scope.formData.branch,
        gpa: parsedGpa,
        email: $scope.formData.email.trim(),
        gender: $scope.formData.gender
      };
      $scope.students.unshift(newStudent);
    }

    $scope.saveToStorage();
    $scope.resetForm();
  };

  // In-place edit button handler
  $scope.editStudent = function(student) {
    $scope.isEditing = true;
    $scope.currentEditId = student.id;
    $scope.currentEditRollNo = student.rollNo;
    $scope.formData = {
      name: student.name,
      rollNo: student.rollNo,
      branch: student.branch,
      gpa: student.gpa,
      email: student.email,
      gender: student.gender || 'Female'
    };
    $scope.formSubmitted = false;
    $scope.duplicateRollError = false;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  $scope.cancelEdit = function() {
    $scope.resetForm();
  };

  // Deletion Safeguard Confirmation
  $scope.showDeleteModal = false;
  $scope.studentToDelete = null;

  $scope.promptDelete = function(student) {
    $scope.studentToDelete = student;
    $scope.showDeleteModal = true;
  };

  $scope.cancelDelete = function() {
    $scope.showDeleteModal = false;
    $scope.studentToDelete = null;
  };

  $scope.confirmDelete = function() {
    if (!$scope.studentToDelete) return;

    var index = $scope.students.indexOf($scope.studentToDelete);
    if (index !== -1) {
      $scope.students.splice(index, 1);
      $scope.saveToStorage();

      if ($scope.currentEditId === $scope.studentToDelete.id) {
        $scope.resetForm();
      }
    }

    $scope.showDeleteModal = false;
    $scope.studentToDelete = null;
  };

  // Live Metrics
  $scope.getBranchCount = function(branchCode) {
    return $scope.students.filter(function(s) { return s.branch === branchCode; }).length;
  };

  $scope.getAverageGPA = function() {
    if (!$scope.students.length) return '0.0';
    var total = $scope.students.reduce(function(acc, s) { return acc + (Number(s.gpa) || 0); }, 0);
    return (total / $scope.students.length).toFixed(1);
  };

  $scope.getHonorsCount = function() {
    return $scope.students.filter(function(s) { return Number(s.gpa) >= 8.5; }).length;
  };

  $scope.getGenderCount = function(gender) {
    return $scope.students.filter(function(s) { return s.gender === gender; }).length;
  };

  $scope.getFemalePercentage = function() {
    if (!$scope.students.length) return 0;
    var count = $scope.getGenderCount('Female');
    return Math.round((count / $scope.students.length) * 100);
  };

  // Helpers
  $scope.getGPABadgeClass = function(gpa) {
    var val = Number(gpa);
    if (val >= 8.5) return 'gpa-honor';
    if (val >= 7.0) return 'gpa-good';
    return 'gpa-warning';
  };

  $scope.getAvatarColor = function(name) {
    var colors = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#e11d48', '#0891b2'];
    var hash = 0;
    for (var i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  // CSV Export Capability
  $scope.exportCSV = function() {
    var filtered = $scope.getFilteredStudents();
    if (!filtered.length) {
      alert('No student records to export!');
      return;
    }

    var headers = ['ID', 'Roll Number', 'Full Name', 'Branch', 'GPA', 'Email', 'Gender'];
    var rows = filtered.map(function(s) {
      return [
        s.id,
        '"' + s.rollNo + '"',
        '"' + s.name + '"',
        '"' + s.branch + '"',
        s.gpa,
        '"' + s.email + '"',
        '"' + s.gender + '"'
      ].join(',');
    });

    var csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), rows.join('\n')].join('\n');
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'student_cohort_directory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  $scope.resetToSampleData = function() {
    if (confirm('Reset cohort data back to default sample records?')) {
      $scope.students = angular.copy($scope.defaultStudents);
      $scope.saveToStorage();
      $scope.resetForm();
    }
  };

  $scope.saveToStorage = function() {
    try {
      localStorage.setItem('cohort_students', JSON.stringify($scope.students));
    } catch(e) {
      console.warn('Storage not available', e);
    }
  };

  // Optional: Supabase REST Extension ($http.get)
  $scope.fetchFromSupabase = function(supabaseUrl, supabaseAnonKey) {
    if (!supabaseUrl || !supabaseAnonKey) return;
    $http({
      method: 'GET',
      url: supabaseUrl + '/rest/v1/students?select=*',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': 'Bearer ' + supabaseAnonKey
      }
    }).then(function(response) {
      console.log('Synchronized with Supabase:', response.data);
    }, function(error) {
      console.error('Supabase fetch failed:', error);
    });
  };

});
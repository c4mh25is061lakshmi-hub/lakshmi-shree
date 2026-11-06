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
app.controller('StudentController', function($scope, $http, $q) {
  var supabaseConfig = window.SUPABASE_CONFIG || {};
  var supabaseUrl = (supabaseConfig.url || '').replace(/\/+$/, '') + '/rest/v1/students';
  var supabaseAnonKey = supabaseConfig.anonKey || '';

  function supabaseRequest(method, query, data, prefer) {
    if (!supabaseConfig.url || !supabaseAnonKey || supabaseAnonKey === 'PASTE_YOUR_SUPABASE_ANON_KEY_HERE') {
      return $q.reject(new Error('Add your current Supabase anon/public key to supabase-config.js.'));
    }

    var headers = {
      apikey: supabaseAnonKey,
      Authorization: 'Bearer ' + supabaseAnonKey,
      'Content-Type': 'application/json'
    };

    if (prefer) {
      headers.Prefer = prefer;
    }

    return $http({
      method: method,
      url: supabaseUrl + (query ? '?' + query : ''),
      headers: headers,
      data: data
    });
  }

  function mapStudent(row) {
    return {
      id: row.id,
      rollNo: row.roll_no,
      name: row.name,
      branch: row.branch,
      gpa: Number(row.gpa),
      email: row.email,
      gender: row.gender
    };
  }

  function getRequestError(error) {
    var details = error.data;
    if (details && typeof details === 'object') {
      if (details.code === '23505') {
        return 'That roll number is already registered.';
      }
      return details.message || details.details || details.hint || error.statusText;
    }
    return details || error.statusText || 'Unknown Supabase error.';
  }

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

  $scope.students = [];
  $scope.isLoading = true;
  $scope.isSaving = false;
  $scope.isDeleting = false;
  $scope.connectionStatus = 'Connecting to Supabase...';
  $scope.connectionError = '';
  $scope.formError = '';

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
  $scope.nameValidationError = false;
  $scope.successMessage = '';

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
    $scope.nameValidationError = false;
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
    $scope.nameValidationError = !$scope.formData.name || !$scope.formData.name.trim();
    $scope.successMessage = '';
    $scope.formError = '';

    if ($scope.isSaving || $scope.studentFormEl.$invalid || $scope.nameValidationError) {
      return;
    }

    var cleanName = $scope.formData.name.trim();
    var cleanRoll = $scope.formData.rollNo.trim().toUpperCase();
    var comparableRoll = cleanRoll.replace(/-/g, '');
    var parsedGpa = Number($scope.formData.gpa);
    var wasEditing = $scope.isEditing;
    var payload = {
      roll_no: cleanRoll,
      name: cleanName,
      branch: $scope.formData.branch,
      gpa: parsedGpa,
      email: $scope.formData.email.trim(),
      gender: $scope.formData.gender
    };

    // Roll number uniqueness validation
    var duplicate = $scope.students.some(function(s) {
      return String(s.rollNo).toUpperCase().replace(/-/g, '') === comparableRoll &&
        String(s.id) !== String($scope.currentEditId);
    });

    if (duplicate) {
      $scope.duplicateRollError = true;
      return;
    }

    $scope.isSaving = true;
    var request = wasEditing
      ? supabaseRequest('PATCH', 'id=eq.' + encodeURIComponent($scope.currentEditId) + '&select=*', payload, 'return=representation')
      : supabaseRequest('POST', 'select=*', payload, 'return=representation');

    request.then(function(response) {
      if (!response.data || !response.data.length) {
        throw new Error(wasEditing
          ? 'No student was updated. The record may have been removed.'
          : 'Supabase did not return the new student record.');
      }

      var savedStudent = mapStudent(response.data[0]);
      if (wasEditing) {
        var index = $scope.students.findIndex(function(student) {
          return String(student.id) === String(savedStudent.id);
        });
        if (index === -1) {
          $scope.students.push(savedStudent);
        } else {
          $scope.students[index] = savedStudent;
        }
      } else {
        $scope.students.unshift(savedStudent);
        $scope.currentPage = 1;
      }

      $scope.connectionStatus = 'Connected to Supabase';
      $scope.successMessage = wasEditing
        ? 'Student record updated successfully.'
        : 'Student registered successfully.';
      $scope.resetForm();
    }).catch(function(error) {
      console.error('Supabase save failed:', error);
      $scope.formError = error.message || getRequestError(error);
      if (error.status) {
        $scope.formError = getRequestError(error);
      }
      $scope.connectionError = $scope.formError;
      $scope.connectionStatus = 'Supabase request failed';
    }).finally(function() {
      $scope.isSaving = false;
    });
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
    $scope.formError = '';

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
    if (!$scope.studentToDelete || $scope.isDeleting) return;

    var student = $scope.studentToDelete;
    $scope.isDeleting = true;
    $scope.connectionError = '';
    supabaseRequest('DELETE', 'id=eq.' + encodeURIComponent(student.id) + '&select=id', null, 'return=representation')
      .then(function(response) {
        if (!response.data || !response.data.length) {
          throw new Error('No student was deleted. The record may already be gone.');
        }
        $scope.students = $scope.students.filter(function(item) {
          return String(item.id) !== String(student.id);
        });
        if (String($scope.currentEditId) === String(student.id)) {
          $scope.resetForm();
        }
        $scope.currentPage = Math.min($scope.currentPage, $scope.numberOfPages());
        $scope.showDeleteModal = false;
        $scope.studentToDelete = null;
        $scope.connectionStatus = 'Connected to Supabase';
      })
      .catch(function(error) {
        console.error('Supabase delete failed:', error);
        $scope.connectionError = error.message || getRequestError(error);
        if (error.status) {
          $scope.connectionError = getRequestError(error);
        }
        $scope.connectionStatus = 'Supabase request failed';
      })
      .finally(function() {
        $scope.isDeleting = false;
      });
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
    if (!confirm('Restore any missing sample students? Existing student records will not be changed.')) {
      return;
    }

    var samples = $scope.defaultStudents.map(function(student) {
      return {
        roll_no: student.rollNo,
        name: student.name,
        branch: student.branch,
        gpa: student.gpa,
        email: student.email,
        gender: student.gender
      };
    });
    $scope.connectionError = '';
    $scope.connectionStatus = 'Restoring sample students...';

    supabaseRequest(
      'POST',
      'on_conflict=roll_no&select=*',
      samples,
      'resolution=ignore-duplicates,return=representation'
    ).then(function() {
      return $scope.loadStudents();
    }).then(function() {
      $scope.successMessage = 'Sample students restored. Existing records were kept.';
      $scope.connectionStatus = 'Connected to Supabase';
    }).catch(function(error) {
      console.error('Supabase sample restore failed:', error);
      $scope.connectionError = error.message || getRequestError(error);
      if (error.status) {
        $scope.connectionError = getRequestError(error);
      }
      $scope.connectionStatus = 'Supabase request failed';
    });
  };

  $scope.loadStudents = function() {
    $scope.isLoading = true;
    $scope.connectionError = '';
    $scope.connectionStatus = 'Loading students from Supabase...';

    return supabaseRequest('GET', 'select=*&order=id.asc')
      .then(function(response) {
        if (!Array.isArray(response.data)) {
          throw new Error('Supabase returned an invalid student list.');
        }
        $scope.students = response.data.map(mapStudent);
        $scope.connectionStatus = 'Connected to Supabase';
      })
      .catch(function(error) {
        console.error('Supabase load failed:', error);
        $scope.students = [];
        $scope.connectionError = error.message || getRequestError(error);
        if (error.status) {
          $scope.connectionError = getRequestError(error);
        }
        $scope.connectionStatus = 'Supabase connection failed';
      })
      .finally(function() {
        $scope.isLoading = false;
      });
  };

  $scope.loadStudents();

});
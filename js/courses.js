'use strict';

var Courses = (function (Courses, nil) {

	var courseNames;

	// All the elements that contain course names that we replace in replaceCourseNames.
	var MENU_COURSES_SELECTOR = '#menu_enrollments .customListItem a';
	var COURSE_NAME_ELEMENTS = [
		MENU_COURSES_SELECTOR, // dropdown menu
		'.course_details.student_grades .course a', // Grades tab
		'a.canvasmod-course' // anything we create
	]

	var COURSE_NAME_REGEX = /\/courses\/(\d+)/;
	Courses.COURSE_NAME_REGEX = COURSE_NAME_REGEX;

	function eachCourseNameEl (fn) {
		COURSE_NAME_ELEMENTS.forEach(function (selector) {
			$(selector).each(fn);
		})
	}

	function loadCustomCourseNames () {
		bg('get', 'course_names').then(function (names) {
			courseNames = names;
			if (names.length) replaceCourseNames();
		})
	}
	Courses.loadCustomCourseNames = loadCustomCourseNames;

	function replaceCourseNames () {
		eachCourseNameEl(function (i, elem) {
			var $elem = $(elem);
			var courseId = $elem.attr('href').match(COURSE_NAME_REGEX)[1];
			bg('get', 'courses.' + courseId).then(function (name) {
				if (name) $elem.text(name);
				})
		})
	}
	Courses.replaceCourseNames = replaceCourseNames;

	// Mark the courses in the most recent semester.
	var TERMS = ['Spring', 'Summer', 'Fall'];
	function cmpSemesters (a, b) {
		var a_ = a.split(' '),
			b_ = b.split(' ');

		// compare years (implicit numeric conversion)
		if (a_[1] > b_[1])
			return 1;
		if (a_[1] < b_[1])
			return -1;

		// compare semesters
		var a_term = TERMS.indexOf(a_[0]),
			b_term = TERMS.indexOf(b_[0]);
		return a_term - b_term; // ??? if term not found
	}

	function getIdFromHref ($a) {
		return $a.attr('href').match(COURSE_NAME_REGEX)[1];
	}
	Courses.getIdFromHref = getIdFromHref;

	var CURRENT_COURSES = {};
	Courses.CURRENT_COURSES = CURRENT_COURSES;
	function loadCourseCurrentnessData () {
		var currentTerm = 'Spring 0', courses = []; // lol
		$(MENU_COURSES_SELECTOR).each(function (i, elem) {
			// Find the max of the currentTerm and the term of the course.
			var $elem = $(elem);
			var term = $elem.children().eq(1).text();
			var cmp = cmpSemesters(currentTerm, term);
			if (cmp < 0)
				currentTerm = term;

			// Push data onto array.
			courses.push({ id: getIdFromHref($elem), term: term })
		})

		// Add current courses to CURRENT_COURSES hashtable.
		courses.forEach(function (course) {
			if (course.term === currentTerm)
				CURRENT_COURSES[course.id] = true;
		})
	}

	// Prereqs: CURRENT_COURSES already populated
	function reorderCoursesMenu () {
		var $oldCourseHeader = $('<div class="canvasmod-old-courses menu-item-header-container"><span class="menu-item-heading">Old Courses</span></div>');
		var $oldCourses = $('<ul class="menu-item-drop-column-list canvasmod-old-courses"></ul>');
		$(MENU_COURSES_SELECTOR).each(function (i, elem) {
			var $elem = $(elem);
			var id = getIdFromHref($elem);
			if (CURRENT_COURSES[id])
				return;

			// Remove the element and add it onto the old course list.
			var $course = $('<li class="customListItem canvasmod-old-course"></li>');
			$course.append($elem.detach());
			$oldCourses.append($course);
		})

		// Add new elements to DOM.
		if ($oldCourses.children().length)
			$('#menu_enrollments').append($oldCourseHeader).append($oldCourses);
	}
	Courses.reorderCoursesMenu = reorderCoursesMenu;

	$(function () {
		loadCourseCurrentnessData();

		bg('get', 'prefs.custom_course_names').then(function (p) {
			if (p)
				loadCustomCourseNames();		
		})

		bg('get', 'prefs.deemphasize_old_courses').then(function (p) {
			if (p)
				reorderCoursesMenu();
		})
	})

	return Courses;

})(Courses || {})

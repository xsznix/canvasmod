'use strict';

$(function () {
	// The elements already on the page
	var $contentMain = $('#content');
	var $coursesMain = $contentMain.find('.course_details.student_grades');
	var $courses = $coursesMain.find('tr');

	// Create old courses
	var $oldCoursesHeader = $('<h2>Previous Courses</h2>');
	var $oldCourses = $('<table class="canvasmod course_details student_grades"></table>');
	$courses.each(function (i, elem) {
		var $elem = $(elem);
		var courseId = Courses.getIdFromHref($elem.find('.course a'));
		if (Courses.CURRENT_COURSES[courseId])
			return;

		$oldCourses.append($elem.detach());
	})

	// Only add to DOM if there are old courses
	if ($oldCourses.children().length)
		$contentMain.append($oldCoursesHeader).append($oldCourses);
})
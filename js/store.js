'use strict';

var DEFAULTS = {
	'prefs.custom_course_names': 1,
	'prefs.deemphasize_old_courses': 0
}

function init_defaults () {
	for (var i in DEFAULTS)
		if (DEFAULTS.hasOwnProperty(i))
			if (localStorage.getItem(i) === null)
				localStorage.setItem(i, DEFAULTS[i]);
}

init_defaults();

var Commands = (function (Commands, nil) {

	Commands.get = function (k) {
		return localStorage.getItem(k);
	}

	Commands.set = function (k, v) {
		return localStorage.setItem(k, v);
	}

	return Commands;

})(Commands || {});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	sendResponse(Commands[request.cmd].apply(null, request.args));
})

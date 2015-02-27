'use strict';

function bg (cmd) {
	var args = [].slice.call(arguments, 1);
	return new Promise(function (resolve, reject) {
		chrome.extension.sendMessage({
			cmd: cmd,
			args: args
		}, resolve)	
	})
}

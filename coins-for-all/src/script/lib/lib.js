/*
 * TransitionEnd
 */
(function(window, document) {
	'use strict';

      var transitionEnd = (function() {
        var el = document.createElement('transitionTest'),
			transEndEventNames = {
              'WebkitTransition' : 'webkitTransitionEnd',
              'MozTransition'    : 'transitionend',
              'OTransition'      : 'oTransitionEnd otransitionend',
              'transition'       : 'transitionend'
            };
        for (var name in transEndEventNames)
          if (el.style[name] !== undefined)
            return transEndEventNames[name]

      })();

	window.oneTransitionEnd = function(el, callback) {
		if (!transitionEnd)
			window.setTimeout(callback, 0);
		else {
			el = el[0] || el;
			var fireOne = function() {
				callback();
				el.removeEventListener(transitionEnd, fireOne, false);
			};
			el.addEventListener(transitionEnd, fireOne, false);
		}
	};
})(window, document);

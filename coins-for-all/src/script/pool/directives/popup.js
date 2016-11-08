/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.directive('popupContainer', ['$q', '$compile', '$controller', '$log', 'async', 'static', function($q, $compile, $controller, $log, async, stat) {
	function ContainerController($scope, container) {
		var popup, content;

		function clutter(tmpl) {
			if (content === undefined)
				content = container.html();
			container.append(tmpl);
			container.css('display', 'block');
			container.attr('tabindex', '1000');
			container[0].focus();
			var node = container.children();
			getBtnByType(node, 'reset').bind('click', function(event) {
				if (!this.disabled)
					hide('reject');
				event.stopPropagation();
			});
			getBtnByType(node, 'submit').bind('click', function(event) {
				if (!this.disabled)
					hide('resolve');
				event.stopPropagation();
			});
			node.bind('click', function(event) {
				event.stopPropagation();
			});
			return node;
		}

		function unclutter() {
			if (popup && content !== undefined) {
				var node = popup.node;
				getBtnByType(node, 'reset').unbind();
				getBtnByType(node, 'submit').unbind();
				node.unbind();
				container.html(content);
			}
			container.css('display', 'none');
			container.removeAttr('tabindex');
		}

		function getBtnByType(node, type) {
			var elements = angular.element(),
				buttons = node.find('button');
			for (var i = 0; i < buttons.length; i++) {
				if (angular.element(buttons[i]).attr('type') == type)
					elements.push(buttons[i]);
			}
			return elements;
		}

		function hasEnabledButton(type) {
			if (popup) {
				var buttons = getBtnByType(popup.node, type);
				for (var i = 0; i < buttons.length; i++)
					if (!buttons[i].disabled)
						return true;
			}
			return false;
		}

		function show(name, locals) {
			return stat.tmpl(name).then(function(tmpl) {
				popup = {
					node: clutter(tmpl),
					locals: locals || {},
					result: $q.defer()
				};
				container.addClass('open');
				$compile(container.contents())($scope);
				return popup.result.promise;
			});
		}

		function hide(takeout, value) {
			!popup && $log.warn("Popup double hiding");
			var result = popup.result;
			if (popup.scope)
				popup.scope.$destroy();
			container.removeClass('open');
			oneTransitionEnd(popup.node, function() {
				unclutter();
				popup = null;
				async[takeout](value, result);
			});
			return result.promise;
		}

		container.bind('click', function(event) {
			if (hasEnabledButton('reset'))
				hide('reject');
		});
		container.bind('keyup', function(event) {
			if (event.which == 27 && hasEnabledButton('reset')) {
				var exitConfirmationText = popup.node.attr('escape-confirm');
				if (exitConfirmationText && !confirm(exitConfirmationText)) return;
				hide('reject');
			} else if (event.which == 13 && hasEnabledButton('submit')) {
				hide('resolve');
			}
		});
		$scope.$on('$destroy', function() {
			container.unbind();
		});
		$scope.$on('$routeChangeStart', function() {
			if (popup) {
				$log.warn("Changing route with popup opened");
				hide('reject');
			}
		});
		unclutter();

		this.open = function(name, locals) {
			if (!popup)
				return show(name, locals);
			return hide('reject').then(null, function() {
				return show(name, locals);
			});
		};
		this.close = this.cancel = function(value) {
			if (popup)
				return hide('reject', value);
			$log.warn('Rejecting popup when not opened');
			return async.reject();
		};
		this.ok = function(value) {
			if (popup)
				return hide('resolve', value);
			$log.warn('Resolving popup when not opened');
			return async.resolve();
		};
		this.controller = function(name, $scope) {
			if (popup) {
				if (popup.scope)
					throw Error("Multiple popup-contorllers not allowed");
				popup.locals.dialog = this;
				popup.scope = popup.locals.$scope = $scope;
				return $controller(name, popup.locals);
			}
		}
	}
	return {
		controller: ['$scope', '$element', ContainerController],
		link: function($scope, elm, attrs, controller) {
			if (attrs.popupContainer)
				$scope[attrs.popupContainer] = controller;
		}
	}
}]).

directive('popupController', ['$compile', function($compile) {
	return {
		require: '^popupContainer',
		compile: function(elm, attrs) {
			var link = $compile(elm.contents());
			return function($scope, elm, attrs, container) {
				if (attrs.popupController) {
					$scope = $scope.$new(true);
					var ctrl = container.controller(attrs.popupController, $scope);
					elm.contents().data('$ngControllerController', ctrl);
				}
				link($scope);
			}
		}
	}
}]);

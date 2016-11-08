/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.controller('MessageCtrl', ['$scope', 'dialog', 'message', 'type',
  function ($scope, dialog, message, type) {
    $scope.message = message;
    $scope.type = type;
    $scope.ok = dialog.ok;
  }]);

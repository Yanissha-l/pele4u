/**
 * Created by User on 25/08/2016.
 */
angular.module('pele')
  //=================================================================
  //==                    PAGE_4
  //=================================================================
  .controller('menuCtrl', ['$scope', '$state', 'StorageService', 'ApiGateway', 'PelApi', '$ionicModal',
    function($scope, $state, StorageService, ApiGateway, PelApi, $ionicModal) {
      $scope.stateType = ""
      $scope.prevState = "";
      if ($state.is("app.leads.self")) {
        $scope.stateType = "S"
        $scope.title = "הלידים שלי"
        $scope.prevState = "app.leads.self";
      } else if ($state.is("app.leads.task")) {
        $scope.title = "שגרירים כאן בשבילך"
        $scope.stateType = "T"
        $scope.prevState = "app.leads.task";
      }



      var getInfo = function() {
        return _.get($scope.conf, "clientConfig['leads.client.infoModal']")
      }


      $scope.getConf = function() {
        $scope.conf = StorageService.getData("leads_conf", {})
        $scope.info = getInfo();
        if ($scope.conf.types) {
          return;
        }
        ApiGateway.get("leads/conf").success(function(data) {
          StorageService.set("leads_conf", data, 1000 * 60 * 30);
          $scope.conf = data;
          $scope.info = getInfo();
        }).error(function(error, httpStatus, headers, config) {
          ApiGateway.reauthOnForbidden(httpStatus, "Unauthorized get leads/conf   api");
          var time = config.responseTimestamp - config.requestTimestamp;
          var tr = ' (TS  : ' + (time / 1000) + ' seconds)';
          PelApi.throwError("api", "get Leads conf table", "httpStatus : " + httpStatus + " " + JSON.stringify(error) + tr)
        })
      }

      $scope.getConf();


      $ionicModal.fromTemplateUrl('leadInfo.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });

      $scope.openModal = function() {

        $scope.modal.show();
      };
      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
    }

  ]);
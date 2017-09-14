/**
 * Created by User on 08/09/2016.
 */
var app = angular.module('pele.P1_appsListCtrl', ['ngStorage']);
//=====================================================================//
//==                         PAGE_1                                  ==//
//=====================================================================//
app.controller('P1_appsListCtrl', function($scope, $http, $state, $ionicLoading, PelApi, $cordovaNetwork, $rootScope, $ionicPopup, $ionicHistory, $sessionStorage, $localStorage, appSettings, $cordovaFile, srvShareData, $cordovaFileTransfer) {

  $ionicHistory.clearHistory();

  //=======================================================//
  //== When        Who         Description               ==//
  //== ----------  ----------  ------------------------- ==//
  //== 27/12/2015  R.W.                                  ==//
  //=======================================================//
  $scope.pushBtnClass = function(event) {


    if (event === true) {
      return "pele-item-on-release";
    } else {
      return "pele-item-on-touch";
    }
  } // pushBtnClass

  $scope.onBtnAction = function() {
    btnClass.activ = !btnClass.activ;
  };
  //-----------------------------------------------------------
  //-- When        Who       Description
  //-- ----------  --------  -----------------------------------
  //-- 06/10/2016  R.W.
  //-----------------------------------------------------------
  $scope.insertOnTouchFlag = function(arr) {
    var myArr = [];
    for (var i = 0; i < arr.length; i++) {
      var myObj = {
        AppId: arr[i].AppId,
        ApplicationType: arr[i].ApplicationType,
        DisplayName: arr[i].DisplayName,
        Image: arr[i].Image,
        Path: arr[i].Path,
        Pin: arr[i].Pin,
        WorkState: arr[i].WorkState,
        PUSH_FLAG: true
      };
      myArr.push(myObj);
    }

    return myArr;
  }

  /*
   * ==========================================================
   *                    GetUserMenuMain
   * ==========================================================
   */
  $scope.GetUserMenuMain = function() {

    var links = PelApi.getDocApproveServiceUrl("GetUserMenu");

    try {
      var reMenu = PelApi.getMenu(links);
    } catch (e) {
      var isAndroid = ionic.Platform.isAndroid();
      if (isAndroid) {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        window.location = "./index.html";
      }
    }

    reMenu.success(function(data, status, headers, config) {

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
      PelApi.lagger.info(" Interface getUserMenu return SUCCESS");
      PelApi.lagger.info(JSON.stringify(data));

      if (headers('msisdn_res') !== undefined && headers('msisdn_res') !== null && headers('msisdn_res') != null) {
        appSettings.config.MSISDN_VALUE = headers('msisdn_res');
      } else {
        if (data.msisdn !== undefined && data.msisdn !== null && data.msisdn != null) {
          appSettings.config.MSISDN_VALUE = data.msisdn;
        }
      }

      $scope.setMSISDN(appSettings.config.MSISDN_VALUE);

      var pinCodeStatus = PelApi.GetPinCodeStatus(data, "getMenu");
      if ("Valid" === pinCodeStatus) {

        appSettings.config.token = data.token;
        appSettings.config.user = data.user;
        appSettings.config.userName = data.userName;
        var strData = JSON.stringify(data);
        strData = strData.replace(/\"\"/g, null);
        strData = strData.replace(/"\"/g, "");
        appSettings.config.GetUserMenu = JSON.parse(strData);
        $scope.feeds_categories = appSettings.config.GetUserMenu;
        $scope.feeds_categories.menuItems = $scope.insertOnTouchFlag($scope.feeds_categories.menuItems);

        //---------------------------------------------
        //-- Send User Tag for push notifications
        //---------------------------------------------
        if (window.plugins !== undefined) {
          window.plugins.OneSignal.sendTags({
            "User": data.userName,
            "Env": appSettings.env
          });
        }
        //--------------------------------------
        //  Save Important Data in session
        //--------------------------------------
        $sessionStorage.token = appSettings.config.token;
        $sessionStorage.user = appSettings.config.GetUserMenu.user;
        $sessionStorage.userName = appSettings.config.GetUserMenu.userName;

        appSettings.config.Pin = appSettings.config.GetUserMenu.PinCode;
        if (appSettings.config.PIN_CODE_AUTHENTICATION_REQUIRED_CODE === appSettings.config.Pin) {
          $state.go('app.login');
        } else {
          appSettings.config.Pin = appSettings.config.GetUserMenu.PinCode;
          appSettings.config.IS_TOKEN_VALID = "Y";
          //----- Rem by R.W. 02/01/2016 after conference with Lina and Maya
          //$scope.setSettings();
        }

      } else if ("PAD" === pinCodeStatus) {

        if (appSettings.config.PIN_CODE_AUTHENTICATION_REQUIRED_CODE === appSettings.config.Pin) {
          $state.go('app.login');
        }

      } else if ("PCR" === pinCodeStatus) {
        errorMsg = appSettings.PIN_STATUS.PAD;
        //PelApi.showPopup(appSettings.config.pinCodeSubTitlePCR , "");
        appSettings.config.IS_TOKEN_VALID = "N";
        PelApi.goHome();
      } else if ("PWA" === pinCodeStatus) {
        appSettings.config.IS_TOKEN_VALID = "N";
        PelApi.goHome();
        //PelApi.showPopup(appSettings.config.pinCodeSubTitlePWA , "");
      } else if ("OLD" === pinCodeStatus) {
        PelApi.showPopupVersionUpdate(data.StatusDesc, "");
      }
    }).error(
      function(response) {

        PelApi.goError("api", "GetUserMenu", JSON.stringify(response));
        //PelApi.showPopup(appSettings.config.getUserModuleTypesErrorMag, "");
      }
    ).finally(function() {
      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');
    });
  } //  GetUserMenuMain

  $scope.setMSISDN = function(pin) {

    PelApi.lagger.info("START $scope.setMSISDN");
    try {
      var msisdn = window.localStorage.getItem("PELE4U_MSISDN");

      if (msisdn === undefined || msisdn === "") {
        window.localStorage.setItem("PELE4U_MSISDN", pin);
      } else if (msisdn !== pin) {
        window.localStorage.removeItem("PELE4U_MSISDN");
        window.localStorage.setItem("PELE4U_MSISDN", pin);
      } else {
        window.localStorage.setItem("PELE4U_MSISDN", pin);
      }
    } catch (e) {
      PelApi.lagger.error(" $scope.setMSISDN() - " + e);
    }
    PelApi.lagger.info(" END $scope.setMSISDN");
  }; // setMSISDN
  $scope.getMSISDN = function() {
    var value = window.localStorage.getItem("PELE4U_MSISDN");
    return value;
  } // getMSISDN

  /** *****************************************************************
   *  When         Who      Description
   *  -----------  -------  -------------------------------------------
   *  02/08/2016   R.W.
   *****************************************************************
   */
  $scope.doRefresh = function() {
    $scope.btn_class = {};
    $scope.btn_class.on_release = true;

    PelApi.showLoading();
    var errorMsg = "";

    $scope.isOnline = appSettings.config.isOnline;
    $scope.network = appSettings.config.network;

    //-------------------------------//
    //PelApi.setPELE4_SETTINGS_DIRECTORY();
    //-------------------------------//
    var continueFlag = "Y";

    if ("wifi" === appSettings.config.network) {
      appSettings.config.MSISDN_VALUE = $scope.getMSISDN();

      if (appSettings.config.MSISDN_VALUE === null) {
        PelApi.showPopup(appSettings.config.TITLE_WIFI_FIRST_CONNECTION_1, appSettings.config.TITLE_WIFI_FIRST_CONNECTION_2);
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      } else {
        if (appSettings.config.IS_TOKEN_VALID !== "Y") {
          $scope.GetUserMenuMain();
        } else {
          $sessionStorage.token = appSettings.config.token;
          $sessionStorage.user = appSettings.config.GetUserMenu.user;
          $sessionStorage.userName = appSettings.config.GetUserMenu.userName;
          $scope.feeds_categories = appSettings.config.GetUserMenu;

          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
        }
      }
    } else {
      appSettings.config.IS_TOKEN_VALID = "Y"
      $scope.GetUserMenuMain();
    }
  }
  //------------------------------------------------------
  //--                  Switch APP
  //------------------------------------------------------
  $scope.appSwitch = function(i) {

    var iabOptions = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };

    var target = i.target || "_blank";
    if (i.url) {
      $cordovaInAppBrowser.open(i.url, target, iabOptions)
        .then(function(event) {
          // success
        }, function(event) {
          // error
        });
      return false;
    } else if (i.Path) {
      var path = i.Path; //"apps/" + i.Path + "/app.html";
      //window.location.href = path;
      $state.go(path, {
        "AppId": i.AppId,
        "Title": i.Title,
        "Pin": i.Pin
      });
      //$state.go("app.p2_test");

    }

  };
  //-----------------------------------------------------------//
  //--                 forwardToApp
  //-----------------------------------------------------------//
  $scope.forwardToApp = function(statePath, appId, titleDisp) {

    $sessionStorage.PeleAppId = appId;

    srvShareData.addData({
      "PeleNetwork": appSettings.config.network,
      "PeleMsisdnValue": appSettings.config.MSISDN_VALUE,
      "PeleAppId": appId
    });

    var i = {};
    i.Path = statePath;
    i.AppId = appId;
    i.Title = titleDisp;
    i.Pin = appSettings.config.Pin;

    $scope.appSwitch(i);

  };
  //-------------------------------//
  //--       Code Section        --//
  //-------------------------------//
  var btnClass = {};
  btnClass.activ = false;
  $scope.class = "pele-menu-item-on-touch item-icon-right";
  $scope.doRefresh();
})

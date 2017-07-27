/**
 * Created by User on 25/08/2016.
 */
var app = angular.module('pele.p4_po_doc_10002Ctrl', ['ngStorage']);
app.controller('p4_po_doc_10002Ctrl', function($rootScope, $scope, $stateParams, $http, $q, $location, $window, $timeout, $ionicLoading, $ionicActionSheet, $ionicModal, PelApi, $ionicNavBarDelegate, $cordovaNetwork, $ionicPopup, appSettings, $sessionStorage, $cordovaFileTransfer, $cordovaInAppBrowser
    /* rem by R.W 07/11/2016 , $cordovaFileOpener2 */
  ) {

    //---------------------------------
    //--       goHome
    //---------------------------------
    $scope.goHome = function() {
      PelApi.goHome();
    }
    //------------------------------------------
    //--      getApproveListActionIcon
    //------------------------------------------
    $scope.getApproveListActionIcon = function(actionCode, date, note) {

      var icon_class;
      if ("FORWARD" === actionCode) {
        icon_class = "ion-checkmark-circled";
      } else if ("NO ACTION" === actionCode) {
        icon_class = "ion-minus-circled";
      } else if ("REJECT" === actionCode) {
        icon_class = "ion-close-circled";
      } else if (actionCode === null && date !== null && note !== null) {
        icon_class = "ion-chatbubble-working";
      } else {
        icon_class = "";
      }

      return icon_class;


    } // getApproveListActionIcon

    //---------------------------------------------------------------------------
    //--                         openExistText
    //---------------------------------------------------------------------------
    $scope.openExistText = function(text) {
      $scope.data = {};
      $scope.data.docText1 = text;
      if (text !== null) {
        var myPopup = $ionicPopup.show({
          template: '<div class="list pele-note-background" dir="RTL"><label class="item item-input"><textarea rows="8" readonly="true" ng-model="data.docText1" type="text" >{{data.docText1}}</textarea></label></div>',
          title: '<a class="float-right"></a>',
          subTitle: '',
          scope: $scope,
          buttons: [{
            text: '<a class="pele-popup-positive-text-collot">סגור</a>',
            type: 'button-positive',
            onTap: function(e) {}
          }, ]
        });
        myPopup.then(function(res) {

        });
      }
    } // openExistText
    //---------------------------------------------------------------------------
    //--                         isGroupShown
    //---------------------------------------------------------------------------
    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    } // isGroupShown

    //---------------------------------------------------------------------------
    //--                         isGroupShown
    //---------------------------------------------------------------------------
    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    //============================================================================//
    //== When        Who         Description                                    ==//
    //== ----------  ----------  -----------------------------------------------==//
    //== 23/02/2016  R.W.                                                       ==//
    //============================================================================//
    $scope.addPushFlagToActionHistory = function(arr) {
      var myArr = [];
      var j = arr.length;
      for (var i = 0; i < arr.length; i++, j--) {
        var showFlag = false;
        var hideFlag = false;
        if (arr[j - 1].DISPLAY_FLAG === "N") {
          showFlag = true;
        } else if (arr[j - 1].NOTE !== "" && arr[j - 1].NOTE != undefined) {
          showFlag = false;
        } else {
          showFlag = true
        };
        //---------------------------------------
        //-- Calculate
        //---------------------------------------
        var l_displayFlag = arr[j - 1].DISPLAY_FLAG;
        var l_actionCode = arr[j - 1].ACTION_CODE;
        if (arr[j - 1].DISPLAY_FLAG === "N") {
          hideFlag = true;
        } else if ((arr[j - 1].ACTION_CODE === "" || arr[j - 1].ACTION_CODE === undefined || arr[j - 1].ACTION_CODE === null) &&
          (arr[j - 1].CHAR_ACTION_DATE === "" || arr[j - 1].CHAR_ACTION_DATE === undefined || arr[j - 1].CHAR_ACTION_DATE === null)) {
          hideFlag = true
        }

        var mayObj = {
          "DISPLAY_FLAG": arr[j - 1].DISPLAY_FLAG,
          "OBJECT_ID": arr[j - 1].OBJECT_ID,
          "CHAR_ACTION_DATE": arr[j - 1].CHAR_ACTION_DATE,
          "ACTION_CODE": arr[j - 1].ACTION_CODE,
          "ACTION_CODE_DISP": arr[j - 1].ACTION_CODE_DISP,
          "EMPLOYEE_NAME": arr[j - 1].EMPLOYEE_NAME,
          "NOTE": arr[j - 1].NOTE,
          "SEQUENCE_NUM": i + 1,
          "SHOW_FLAG": showFlag,
          "HIDEN_FLAG": hideFlag,
          "PUSH_COUNT": 0
        }

        myArr.push(mayObj);

      } // for

      return myArr;
    } // addPushFlagToActionHistory
    //--------------------------------------------------------------------------//
    //-- When         Who             Description                             --//
    //-- ===========  ==============  ========================================--//
    //-- 29/02/2016   R.W.
    //--------------------------------------------------------------------------//
    $scope.showIconCollapseInAcctionHistory = function(showFlag, hidenFlag) {
      var retVal = "";
      if (hidenFlag === true) {
        retVal = "";
      } else if (showFlag === true) {
        retVal = "icon-collapse";
      } else if (showFlag === false) {
        retVal = "icon-expand";
      }

      return retVal;

    }
    $scope.hidenAcctionHistoryDetails = function(showFlag, hidenFlag, pushCount, note) {
      var retVal = "";
      if (hidenFlag === true) {
        retVal = true;
      } else if (showFlag === true) {
        if (pushCount === 0) {
          if (note !== "" && note !== undefined && note !== null) {
            retVal = false;
          } else {
            retVal = true;
          }
        } else {
          retVal = true;
        }

      } else if (showFlag === false) {
        retVal = false;
      }

      return retVal;

    }
    //--------------------------------------------------------------------------//
    //-- When         Who             Description                             --//
    //-- ===========  ==============  ========================================--//
    //-- 29/02/2016   R.W.
    //--------------------------------------------------------------------------//
    $scope.getMatchPrice = function(arr) {
      var myArr = [];
      for (var i = 0; i < arr.length; i++) {

        if (arr[i].DISPLAY_FLAG === "Y") {

          var mayObj = {
            "SEQ": i,
            "VENDOR_NAME": arr[i].VENDOR_NAME,
            "INITIAL_UNIT_PRICE": arr[i].INITIAL_UNIT_PRICE,
            "UNIT_PRICE": arr[i].UNIT_PRICE,
            "TOTAL_PRICE": arr[i].TOTAL_PRICE
          }

          myArr.push(mayObj);

        } // if

      } // for

      return myArr;
    }; // getMatchPrice
    //--------------------------------------------------------------------------//
    //-- When         Who             Description                             --//
    //-- ===========  ==============  ========================================--//
    //-- 29/02/2016   R.W.
    //--------------------------------------------------------------------------//
    $scope.getAttachedDocuments = function(arr) {
      var myArr = [];
      for (var i = 0; i < arr.length; i++) {

        if (arr[i].DISPLAY_FLAG_1 === "Y") {
          var file_name = "";

          file_name = arr[i].FILE_NAME_3;

          var mayObj = {
            "SEQ": i,
            "CATEGORY_TYPE": arr[i].CATEGORY_TYPE_4,
            "DOCUMENT_ID": arr[i].DOCUMENT_ID_2,
            "FILE_NAME": file_name,
            "FILE_MAOF_TYPE": arr[i].FILE_TYPE_6,
            "FILE_TYPE": arr[i].FILE_TYPE_9,
            "FULL_FILE_NAME": arr[i].FULL_FILE_NAME_8,
            "OPEN_FILE_NAME": "/My Files &amp; Folders/" + arr[i].OPEN_FOLDER_5 + '/' + arr[i].FULL_FILE_NAME_8,
            //"SHORT_TEXT"               : arr[i].SHORT_TEXT_7,
            //"LONG_TEXT"                : arr[i].LONG_TEXT_VALUE_11,
            "IS_FILE_OPENED_ON_MOBILE": arr[i].IS_FILE_OPENED_ON_MOBILE_10,
            "IOS_OPEN_FILE_NAME": "/My Files &amp; Folders/" + arr[i].OPEN_FOLDER_5 + '/' + arr[i].IOS_FILE_NAME_12
          }

          myArr.push(mayObj);

        } // if

      } // for

      return myArr;
    } //getAttachedDocuments
    //---------------------------------------------------------------------------
    //--                      getAttachmentLinkStyle
    //---------------------------------------------------------------------------
    $scope.getAttachmentLinkStyle = function(isFileOpenedOnMobile) {
      var l_retVal = {};
      if ("Y" === isFileOpenedOnMobile) {
        l_retVal = appSettings.ATTACHMENT_BLUE_STYLE;
      } else {
        l_retVal = appSettings.ATTACHMENT_GRAY_STYLE;
      }

      return l_retVal;
    } // getAttachmentLinkStyle

    //---------------------------------------------------------------------------
    //--                      Open Attached Doc
    //---------------------------------------------------------------------------
    $scope.openAttachedFile = function(p_openFileName, p_fullFileName, p_fileType, p_fileMaofType, p_shortText, p_longText, isOpened, p_iosOpenfileName) {

      PelApi.showLoading();

      var links = PelApi.getDocApproveServiceUrl("GetFileURI");

      var appId = config_app.appId;

      if ("Y" === isOpened) {
        var l_fileName = "";
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        if (isAndroid) {
          l_fileName = p_openFileName;
        } else if (isIOS) {
          l_fileName = p_iosOpenfileName;
        } else {
          l_fileName = p_openFileName;
        }
        //---------------------------------------
        //--     After 5 seconds application
        //---------------------------------------
        var loadingComplited = "N";

        var timeOutInMiliseconds = Number(config_app.ATTACHMENT_TIME_OUT);

        $timeout(function() {
          if ("N" === loadingComplited) {
            loadingComplited = "Y";
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            PelApi.showPopup(config_app.TIMEOUT_STATUS, "");
          }
        }, timeOutInMiliseconds);

        var retGetFileURI = PelApi.GetFileURI(links, appId, config_app.Pin, l_fileName);

        retGetFileURI.success(function(data, status, headers, config) {

          console.log("== GetFileURI.SUCCESS ==");
          var l_data = JSON.stringify(data);
          console.log(l_data);
          var statusCode = PelApi.checkResponceStatus(data);
          if ("S" === statusCode.Status) {
            var url = statusCode.URL;

            //window.open(url, '_system');
            var filename = p_fullFileName;

            var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid();

            //var targetPath ="file:///storage/emulated/0/po_1534624_210998_3945377.msg";
            var targetPath = "";
            if ("N" === loadingComplited) {
              if (isAndroid) {

                var filePath = PelApi.getfull_ATTACHMENT_DIRECTORY_NAME();
                targetPath = filePath + '/' + filename;

                $cordovaFileTransfer.download(url, targetPath, {}, true).then(function(result) {

                  console.log('Success');
                  console.log('===================================================');
                  console.log(result);
                  var options = {
                    location: 'yes',
                    clearcache: 'yes',
                    toolbar: 'no'
                  };
                  // Work wersion for android but cannot delete file

                  if ("N" === loadingComplited) {
                    loadingComplited = "Y";
                    window.open(result.nativeURL, "_system", "location=yes,enableViewportScale=yes,hidden=no");
                    $ionicLoading.hide();
                    $scope.$broadcast('scroll.refreshComplete');
                  }

                }, function(error) {
                  console.log('Error');
                  console.log('===================================================');
                  console.log(error);
                  $ionicLoading.hide();
                  $scope.$broadcast('scroll.refreshComplete');
                  PelApi.showPopup("File Download Complite With Error", error.toString());
                }, function(progress) {
                  // PROGRESS HANDLING GOES HERE
                });
              } else if (isIOS) {
                loadingComplited = "Y";
                window.open(url, "_system", "charset=utf-8,location=yes,enableViewportScale=yes,hidden=no");
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');

              } else {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
              }
            }
          } else if ("PDA" === statusCode.Status) {
            if ("N" === loadingComplited) {
              loadingComplited = "Y";
              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              config_app.IS_TOKEN_VALID = "N";
              PelApi.goHome();
            }

          } else if ("EOL" === statusCode.Status) {
            if ("N" === loadingComplited) {
              loadingComplited = "Y";
              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              config_app.IS_TOKEN_VALID = "N";
              PelApi.goHome();
            }

          } else if ("InValid" === statusCode.Status) {
            if ("N" === loadingComplited) {
              loadingComplited = "Y";
              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              //$state.go("app.p1_appsLists");
              config_app.IS_TOKEN_VALID = "N";
              PelApi.goHome();
            }

          } else if ("EAI_Status" === statusCode.Status) {
            if ("N" === loadingComplited) {
              loadingComplited = "Y";
              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              PelApi.showPopup(config_app.EAI_Status, "");
            }
          } else if ("Application_Status" === statusCode.Status) {
            if ("N" === loadingComplited) {
              loadingComplited = "Y";
              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              PelApi.showPopup(config_app.EAI_Status, "");
            }

          } else if ("StatusCode" === statusCode.Status) {
            if ("N" === loadingComplited) {
              loadingComplited = "Y";
              $ionicLoading.hide();
              $scope.$broadcast('scroll.refreshComplete');
              PelApi.showPopup(config_app.EAI_Status, "");
            }
          } else if ("OLD" === statusCode.Status) {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            PelApi.showPopupVersionUpdate(data.StatusDesc, "");
          }
        }).error(
          function(response) {
            PelApi.lagger.error("GetFileURI : " + JSON.stringify(response));
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            PelApi.showPopup(config_app.getUserModuleTypesErrorMag, "");
          });
      } else {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        PelApi.showPopup(config_app.ATTACHMENT_TYPE_NOT_SUPORTED_FOR_OPEN, "");
      } // isOpened
      /*
       }
       */
    }
    //---------------------------------------------------------------------------
    //--                         doRefresh
    //---------------------------------------------------------------------------
    $scope.doRefresh = function() {
      $scope.data = {};
      $scope.feed = [];
      $scope.tabs = appSettings.tabs;
      $scope.docDetailsShow = {};

      $scope.PO_COMMENTS_SHOW = true;
      $scope.PO_DETAILS_SHOW = true;
      $scope.PO_EXPLAIN_SHOW = true;
      $scope.PO_SUPPLIER_REASON_SHOW = true;
      $scope.PO_MATCH_PRICE_SHOW = true;
      $scope.PO_ATTACHED_DOCUMENTS_SHOW = true;

      var buttons = {};
      //buttons.approve = true;

      $scope.style = {
        color: 'red'
      };

      var appId = config_app.appId,
        docId = $stateParams.DocId,
        docInitId = $stateParams.DocInitId,
        orgName = $stateParams.orgName;

      $sessionStorage.DOC_ID = docId;

      if (config_app.docDetails.ERROR !== "NULL") {
        PelApi.showPopup(config_app.interfaceErrorTitle, config_app.docDetails.ERROR);
        return;
      }

      console.log(config_app.docDetails);
      //----------- Order Header -------------
      $scope.APP_ID = appId;
      $scope.NOTIFICATION_ID = config_app.docDetails.NOTIFICATION_ID;
      $scope.PO_ORDER = config_app.docDetails.PO_ORDER;
      $scope.PO_ORDER_NUMBER = config_app.docDetails.PO_ORDER_NUMBER;
      $scope.COMMENTS = config_app.docDetails.COMMENTS;
      $scope.PO_AMOUNT = config_app.docDetails.PO_AMOUNT;
      $scope.CURRENCY = config_app.docDetails.CURRENCY;
      $scope.VENDOR_NAME = config_app.docDetails.VENDOR_NAME;
      $scope.SUBMIT_DATE = config_app.docDetails.SUBMIT_DATE;
      $scope.BUYER_NAME = config_app.docDetails.BUYER_NAME;
      $scope.MANAGER_NAME = config_app.docDetails.MANAGER_NAME;
      $scope.PO_EXPLAIN = config_app.docDetails.PO_EXPLAIN;
      $scope.SUPPLIER_REASON = config_app.docDetails.SUPPLIER_REASON;

      //----------- Match Price --------
      $scope.MATCH_PRICE = $scope.getMatchPrice(config_app.docDetails.MATCH_PRICE);
      console.log("================== MATCH PRICE ====================");
      console.log($scope.MATCH_PRICE);

      //----------- Attachments --------
      $scope.ATTACHED_DOCUMENTS = $scope.getAttachedDocuments(config_app.docDetails.ATTACHED_DOCUMENTS);
      console.log("================== ATTACHED_DOCUMENTS ====================");
      console.log(JSON.stringify($scope.ATTACHED_DOCUMENTS));

      //----------- Buttons ------------
      $scope.buttonsArr = config_app.docDetails.BUTTONS;

      //----------- Action History -----
      var actionHistory = $scope.addPushFlagToActionHistory(config_app.docDetails.ACTION_HISTORY);
      $scope.ACTION_HISTORY = actionHistory;
      console.log("length : " + $scope.ACTION_HISTORY.length);

      console.log("====================================================");
      console.log(JSON.stringify($scope.ACTION_HISTORY));
      console.log("====================================================");

      // Show the action sheet
      $scope.approve = config_app.ApprovRejectBtnDisplay;

      $ionicLoading.hide();
      $scope.$broadcast('scroll.refreshComplete');

    }; // doRefresh

    $scope.redStyle = function(flag) {
      var retVal;
      if ("Y" === flag) {
        $scope.style.color = "red";
      } else if ("N" === flag) {
        $scope.style.color = "black";
      }
      return $scope.style;
    };
    //---------------------------------------------------------------------
    //-- When           Who             Description
    //-- -------------	--------------  -----------------------------------
    //-- 13/10/2015     R.W.            Hide / Show Approval List Rows
    //---------------------------------------------------------------------
    $ionicModal.fromTemplateUrl('templates/modal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.createNote = function(u) {
      var note = u.Note;
      note = PelApi.replaceSpecialChr(note)

      $scope.Note = note;
      $scope.modal.hide();
    };
    //---------------------------------------------------------------------
    //-- When           Who             Description
    //-- -------------	--------------  -----------------------------------
    //-- 13/10/2015     R.W.            Hide / Show Approval List Rows
    //---------------------------------------------------------------------
    $scope.pelHideShow = function(note, displayFlag) {
      var retStatus = true;

      if (displayFlag === "Y") {

        if (note != "" && note != undefined) {
          retStatus = false;
        }
      } else {
        retStatus = true;
      }

      return retStatus;
    };

    $scope.pelHideShow2 = function(displayFlag) {

      var retStatus;

      if (displayFlag === "Y") {
        retStatus = false;
      } else {
        retStatus = true;
      }

      return retStatus;
    }


    $scope.onSlideMove = function(data) {
      //alert("You have selected " + data.index + " tab");
    };
    //-----------------------------------
    //--         Btn Action
    //-----------------------------------
    $scope.docApprove = function() {

      //PelApi.showLoading();

      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = 'APPROVE';
      var note = '';
      //===================================================//
      //==        Add Note Yes/No popup
      //===================================================//
      var myYesNoPopup = $ionicPopup.show({
        title: config_app.isAddNoteTitle,
        subTitle: '',
        scope: $scope,
        buttons: [{
            text: '<a class="pele-popup-positive-text-collot">כן</a>',
            type: 'button-positive',
            onTap: function(e) {
              return true;
            }
          },
          {
            text: '<a class="pele-popup-positive-text-collot">לא</a>',
            type: 'button-assertive',
            onTap: function(e) {

              return false;
            }
          },
        ]
      });
      myYesNoPopup.then(function(res) {
        if (res) {
          //===============================================//
          //==                 Get Note                  ==//
          //===============================================//
          $scope.data = {};
          var myPopup = $ionicPopup.show({
            template: '<div class="list pele-note-background" dir="RTL"><label class="item item-input"><textarea rows="8" ng-model="data.note" type="text"></textarea></label></div>',
            title: '<a class="float-right">הערות</a>',
            subTitle: '',
            scope: $scope,
            buttons: [{
                text: '<a class="pele-popup-positive-text-collot">שמירה</a>',
                type: 'button-positive',
                onTap: function(e) {
                  if (!$scope.data.note) {
                    //don't allow the user to close unless he enters wifi password
                    e.preventDefault();
                  } else {
                    $scope.data.cancel = false;
                    return $scope.data;
                  }
                }
              },
              {
                text: 'ביטול',
                type: 'button-assertive',
                onTap: function(e) {
                  $scope.data.note = "";
                  $scope.data.cancel = true;
                  return $scope.data;
                }
              },
            ]
          });
          myPopup.then(function(res) {
            if (!res.cancel) {
              PelApi.showLoading();
              note = res.note;
              note = PelApi.replaceSpecialChr(note);

              var links3 = PelApi.getDocApproveServiceUrl("SubmitNotif");
              var retSubmitNotification = PelApi.SubmitNotification(links3, appId, notificationId, note, actionType);
              retSubmitNotification.success(function(data, status, headers, config) {
                PelApi.PelApi.lagger.info(JSON.stringify(data));
              }).error(function(response) {
                PelApi.lagger.error("SubmitNotification : " + JSON.stringify(response));
              }).finally(function() {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                $ionicNavBarDelegate.back();
              });
            }
          });
        } else {
          PelApi.showLoading();
          var links3 = PelApi.getDocApproveServiceUrl("SubmitNotif");
          var retSubmitNotification = PelApi.SubmitNotification(links3, appId, notificationId, note, actionType);
          retSubmitNotification.success(function(data, status) {
            PelApi.lagger.info(JSON.stringify(data));
          }).error(function(error) {
            PelApi.lagger.error("retSubmitNotification : " + JSON.stringify(error));
          }).finally(function() {
            $ionicLoading.hide();
            $scope.$broadcast('scroll.refreshComplete');
            $ionicNavBarDelegate.back();
          });
        };
      });
    };
    //-----------------------------------
    //--         OK
    //-----------------------------------
    $scope.docOK = function() {

      //PelApi.showLoading();

      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = 'OK';
      var note = '';

      PelApi.showLoading();
      var links3 = PelApi.getDocApproveServiceUrl("SubmitNotif");
      var retSubmitNotification = PelApi.SubmitNotification(links3, appId, notificationId, note, actionType);

      retSubmitNotification.success(function(data, status) {
        PelApi.lagger.info(JSON.stringify(data));
      }).error(
        function(response) {
          PelApi.lagger.info("success : " + JSON.stringify(response));
        }).finally(function() {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        $ionicNavBarDelegate.back();
      });
    };
    //----------------------------------------
    //--         REJECT                     --
    //----------------------------------------
    $scope.docReject = function() {
      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = "REJECT";
      if ($scope.data.note !== undefined) {
        var note = $scope.data.note;
        note = PelApi.replaceSpecialChr(note);

        $scope.submitNotif(actionType, note)
      } else {
        var myPopup = $ionicPopup.show({
          template: '<div class="list pele-note-background" dir="RTL"><label class="item item-input"><textarea rows="8" ng-model="data.note" type="text">{{data.note}}</textarea></label></div>',
          title: '<a class="float-right">הערות</a>',
          subTitle: '',
          scope: $scope,
          buttons: [{
              text: '<a class="pele-popup-positive-text-collot">שמירה</a>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.note) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                  PelApi.showPopup("יש להזין הערה", "");
                } else {
                  return $scope.data.note;
                }
              }
            },
            {
              text: 'ביטול',
              type: 'button-assertive'
            },
          ]
        });
        myPopup.then(function(res) {
          note = res
          note = PelApi.replaceSpecialChr(note);
          if (note !== undefined) {
            $scope.submitNotif(actionType, note);
          }
        });
      }
    }; // docReject
    //==============================================================
    //==============================================================
    $scope.docApproveWitnNote = function() {
      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = "APPROVE";
      var note = "";
      if ($scope.data.note !== undefined) {
        note = $scope.data.note;
        note = PelApi.replaceSpecialChr(note);

        $scope.submitNotif(actionType, note)
      } else {
        var myPopup = $ionicPopup.show({
          template: '<div class="list pele-note-background" dir="RTL"><label class="item item-input"><textarea rows="8" ng-model="data.note" type="text">{{data.note}}</textarea></label></div>',
          title: '<a class="float-right">הערות</a>',
          subTitle: '',
          scope: $scope,
          buttons: [{
              text: '<a class="pele-popup-positive-text-collot">שמירה</a>',
              type: 'button-positive',
              onTap: function(e) {
                if (!$scope.data.note) {
                  //don't allow the user to close unless he enters wifi password
                  e.preventDefault();
                  PelApi.showPopup("יש להזין הערה", "");
                } else {

                  return $scope.data.note;
                }
              }
            },
            {
              text: 'ביטול',
              type: 'button-assertive'
            },
          ]
        });
        myPopup.then(function(res) {
          note = res;
          note = PelApi.replaceSpecialChr(note);
          if (note !== undefined) {
            $scope.submitNotif(actionType, note);
          }
        });
      }
    }; // docApproveWitnNote
    //--------------------------------------------------------------
    //
    //--------------------------------------------------------------
    $scope.submitNotif = function(action, note) {
      var appId = config_app.appId;
      var notificationId = $scope.NOTIFICATION_ID;
      var actionType = action;

      note = PelApi.replaceSpecialChr(note);

      PelApi.showLoading();
      var links3 = PelApi.getDocApproveServiceUrl("SubmitNotif");
      var retSubmitNotification = PelApi.SubmitNotification(links3, appId, notificationId, note, actionType);
      retSubmitNotification.success(function(data, status, headers, config) {
        PelApi.lagger.info(JSON.stringify(data));
      }).error(
        function(error) {
          PelApi.lagger.error("retSubmitNotification : " + JSON.stringify(error));
        }).finally(function() {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
        $ionicNavBarDelegate.back();
      });
    };
    //--------------------------------------------------------------
    //-- When         Who       Description
    //-- -----------  --------  ------------------------------------
    //-- 28/06/2016   R.W.
    //--------------------------------------------------------------
    $scope.ShortTextPopUp = function(p_text) {
      $scope.data.shortText = p_text
      var myPopup = $ionicPopup.show({
        template: '<div class="list pele-note-background" dir="RTL"><label class="item item-input"><textarea readonly rows="14" ng-model="data.shortText" type="text">{{data.shortText}}</textarea></label></div>',
        title: '<a class="float-right">הערות</a>',
        subTitle: '',
        scope: $scope,
        buttons: [{
          text: '<a class="pele-popup-positive-text-collot">אישור</a>',
          type: 'button-positive',
        }]
      });
    } //
    //--------------------------------------------------------------
    //-- When         Who       Description
    //-- -----------  --------  ------------------------------------
    //-- 06/01/2016   R.W.
    //--------------------------------------------------------------
    $scope.NotePopup = function() {
      var myPopup = $ionicPopup.show({
        template: '<div class="list pele-note-background" dir="RTL"><label class="item item-input"><textarea rows="8" ng-model="data.note" type="text">{{data.note}}</textarea></label></div>',
        title: '<a class="float-right">הערות</a>',
        subTitle: '',
        scope: $scope,
        buttons: [{

            text: '<a class="pele-popup-positive-text-collot">שמירה</a>',
            type: 'button-positive',
            onTap: function(e) {
              if (!$scope.data.note) {
                //don't allow the user to close unless he enters wifi password
                e.preventDefault();
                PelApi.showPopup("יש להזין הערה", "");
              } else {

                return $scope.data.note;
              }
            }
          },
          {
            text: 'ביטול',
            type: 'button-assertive',
            onTap: function(e) {
              return $scope.data.note;
            }
          },
        ]
      });
      myPopup.then(function(res) {
        $scope.data.note = res;
      });
    }; // NotePopup
    //--------------------------------------------------------------
    //--           Button Action
    //--------------------------------------------------------------
    $scope.showBtnActions = function() {
      var buttons = PelApi.getButtons($scope.buttonsArr);
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: buttons,
        titleText: 'רשימת פעולות עבור טופס',
        cancelText: 'ביטול',
        //-----------------------------------------------
        //--               CANCEL
        //-----------------------------------------------
        cancel: function() {
          // add cancel code..
          return true;
        },
        //-----------------------------------------------
        //--               BUTTONS
        //-----------------------------------------------
        buttonClicked: function(index, button) {
          var note = $scope.data.note;
          note = PelApi.replaceSpecialChr(note);

          // add buttons code..
          if (button === appSettings.OK) {

            $scope.submitNotif("OK", note);

          } else if (button === appSettings.APPROVE) {

            $scope.submitNotif("APPROVE", note);

          } else if (button === appSettings.APPROVE_AND_NOTE) {

            $scope.docApproveWitnNote();

          } else if (button === appSettings.REJECT) {
            $scope.docReject();
          }
          return true;
        },
        //-----------------------------------------------
        //--           DESTRUCTIVE BUTTON
        //-----------------------------------------------

      });
    }

    $scope.doRefresh();

  }
  //]
);

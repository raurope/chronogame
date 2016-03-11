// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('ChronoController', function($scope, $interval, $ionicPopup) {
  var hund = undefined
  var first = true
  $scope.score = "0"
  $scope.target_value = (Math.random() * 20 + 3).toFixed(2)
  $scope.chrono_value_seconds = "00"
  $scope.chrono_value_hundredth = "00"

  $scope.start = function() {
    if (first == false) {
      $scope.target_value = (Math.random() * 20 + 3).toFixed(2)
    }
    first = false
    $scope.chrono_value_seconds = "00"
    $scope.chrono_value_hundredth = "00"

    hund = $interval(get_chrono_hundredth, 10)

    $scope.isStartDisabled = true;
    $scope.isStopDisabled = false;
  }

  $scope.stop = function() {
    if ($scope.isStartDisabled == undefined && $scope.isStopDisabled == undefined) return;

    $scope.isStartDisabled = false;
    $scope.isStopDisabled = true;

    if (angular.isDefined(hund)) {
         $interval.cancel(hund);
         hund = undefined;
    }

    var result = calculate_score();
    if (result == 0) {
      $scope.score = "0"
      return;
    }
    $scope.score = parseInt($scope.score) + result;
  }

  function addZero(x,n) {
    while (x.toString().length < n) {
        x = "0" + x;
    }
    return x;
  }

  function get_chrono_seconds() {
    seconds = parseInt($scope.chrono_value_seconds)
    seconds += 1
    $scope.chrono_value_seconds = addZero(seconds,2)
  }

  function get_chrono_hundredth() {
    hundredth = parseInt($scope.chrono_value_hundredth)
    hundredth += 1
    if (hundredth >= 99) {
      hundredth = 0
      get_chrono_seconds()
    }
    $scope.chrono_value_hundredth = addZero(hundredth,2)
  }

  function calculate_score() {
    result = parseFloat($scope.chrono_value_seconds + "." + $scope.chrono_value_hundredth).toFixed(2)
    target = parseFloat($scope.target_value).toFixed(2)
    difference = (target - result).toFixed(2)
    if ((result > target) || (difference > 1.00)) return 0;
    if (result == target) return 100;

    return parseInt((50 - (difference * 50)) + 0.5)
  }

  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
     title: 'ChronoGame Rules',
     template: 'You have to stop the chronometer when you are close the target. ' +
     'If your time is equal to the target you will get 100 points. ' +
     'If your time is bigger than your target you will get 0 points and your score will be set to 0. ' +
     'If your time is more than one second of the target you will get 0 point and your score will be set to 0. ' +
     'You will win points if you are so close to the target.'
    });

    alertPopup.then(function(res) {});
 };

 $scope.close = function() {
   ionic.Platform.exitApp();
 }


});

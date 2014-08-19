angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, IAPFactory) {

  IAPFactory.doTest("Test from AppCtrl");

  IAPFactory.setVar("monkey1234");
  
  $scope.IAPFactory = IAPFactory;
 
  $scope.IAPFactory.IAP.render = function(){
    alert("IAP.render()! products:" + JSON.stringify($scope.IAPFactory.IAP.products) );
  };
 
  var onDeviceReady = function(){
    alert("onDeviceReady!");
    var productList = ["M1","M2","MF1.CONSUMABLE"];
    $scope.IAPFactory.initialize(productList);
  };
  document.addEventListener('deviceready', onDeviceReady, false);

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})
.controller('ProductCtrl', function($scope, $stateParams) {
})
.controller('ProductsCtrl', function($scope, IAPFactory){

//  alert("ProductsCtrl IAPFactory.testVar:"+IAPFactory.getVar());

  $scope.products = [
    {"id":"M2", "title":"Buy Monkey Two"},
    {"id":"MF1.CONSUMABLE", "title":"Buy Monkey Food One"}
  ];
  
  $scope.buy = function (productId) {
    console.log("buy product:"+productId);
    alert("buy product: "+productId);
    IAPFactory.buy(productId);
//    IAPFactory.doTest("Test from ProductsCtrl");
  };
 
});

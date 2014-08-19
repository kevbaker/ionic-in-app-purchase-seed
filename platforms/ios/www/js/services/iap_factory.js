/* IAP Factory - StoreKit Interface
 * 
 * Source:
 * 
 *  * [Github IAP.js source]( https://github.com/kevbaker/ionic-in-app-purchase-seed/blob/master/www/js/iap.js )
 * 
 * Usage:
 * 
 *  * Override the "onPurchase" and "onFinish" methods to integrate with app.
 *  * Purchases should be persisted in the app.
 *  * NOTE: make sure to override methods before the "initialize" method is called. 
 *  
 */
starterModule.factory("IAPFactory", function () {

  var testVar = "monkey1";

  var IAP = {
    list: [],
    products: {}
  };

  // Constructor
  IAP.initialize = function(_list) {

    // Setup the productId list
    if (_list) {
      IAP.list = _list;
    };

    // Check availability of the storekit plugin
    if (!window.storekit) {
      alert('In-App Purchases (Storekit) not available');
      return;
    };

    // Initialize
    window.storekit.init({
      debug: true,
      noAutoFinish: false,
      ready: IAP.onReady,
      purchase: IAP.onPurchase,
      finish: IAP.onFinish,
      restore: IAP.onRestore,
      error: IAP.onError,
      restoreCompleted: IAP.onRestoreCompleted
    });
  };

  // Methods //

  // Buy product by calling StoreKit.purchase()
  IAP.buy = function(productId, callback) {
    // console.log("IAP.buy!");
    IAP.purchaseCallback = callback;
    window.storekit.purchase(productId);
  };

  IAP.doTest = function(_msg) {
    alert("IAP.doTest: " + _msg);
  };

  // Restore products by calling StoreKit.restore()
  IAP.restore = function() {
    // console.log("IAP.restore!");
    window.storekit.restore();
  };

  // Add a product to the product list
  IAP.addProduct = function(productId) {
    IAP.list.push(productId);
  };


  // Callbacks //

  // onReady Callback to initialize application
  IAP.onReady = function() {
    alert("IAP.onReady!");

    // Once setup is done, load all product data.
    window.storekit.load(IAP.list, function(products, invalidIds) {
      console.log('IAPs loading done:');
      for (var j = 0; j < products.length; ++j) {
        var p = products[j];
        console.log('Loaded IAP(' + j + '). title:' + p.title +
            ' description:' + p.description +
            ' price:' + p.price +
            ' id:' + p.id);
        IAP.products[p.id] = p;
      };
      IAP.loaded = true;
      for (var i = 0; i < invalidIds.length; ++i) {
        console.log('Error: could not load ' + invalidIds[i]);
      }
      IAP.render();
    });

    // Also check the receipts
    storekit.loadReceipts(function(receipts) {
      console.log('appStoreReceipt: ' + receipts.appStoreReceipt);
    });
  };

  // optional override in application
  IAP.onStoreReceipt = function(receipts) {
    console.log("IAP.onStoreReceipt!");
    console.log(receipts);
  };

  // override in application
  IAP.onPurchase = function(transactionId, productId) {
    console.log("IAP.onPurchase! transactionId:" + transactionId + " productId:" + productId);
  };

  // override in application
  IAP.onFinish = function(transactionId, productId) {
    console.log("IAP.onFinish! Purchase complete: productId:" + productId + " transactionId:" + transactionId);
  };

  // optional override in application
  IAP.onError = function(errorCode, errorMessage) {
    alert("IAP.onError! Error: code:" + errorCode + " message:" + errorMessage);
  };

  // optional override in application
  IAP.onRestore = function(transactionId, productId) {
    console.log("IAP.onRestore! transactionId:" + transactionId + " productId:" + productId);
  }

  // optional override in application
  IAP.onRestoreCompleted = function() {
    console.log("IAP.onRestoreCompleted!");
  };



  var getVar = function() {
    return testVar;
  };

  var setVar = function(_var) {
    testVar = _var;
  };

  return {
    initialize: IAP.initialize,
    buy: IAP.buy,
    IAP: IAP,
    doTest: IAP.doTest,
    getVar: getVar,
    setVar: setVar
  };

});

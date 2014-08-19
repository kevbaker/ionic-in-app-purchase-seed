var localStorage = window.localStorage || {};

var IAP = {
    list: [],
    products: {}
};

IAP.addProduct = function (productId){
    IAP.list.push(productId);
};

IAP.initialize = function (list) {

    if(list){
        IAP.list = list;
    };
    
    alert("IAP.initialize! list:"+IAP.list[0]);
    // Check availability of the storekit plugin
    if (!window.storekit) {
        console.log('In-App Purchases not available');
        return;
    }

    // Initialize
    window.storekit.init({
        debug:    true,
        noAutoFinish: false,
        ready:    IAP.onReady,
        purchase: IAP.onPurchase,
        finish:   IAP.onFinish,
        restore:  IAP.onRestore,
        error:    IAP.onError,
        restoreCompleted: IAP.onRestoreCompleted
    });
};

IAP.onReady = function () {
    alert("IAP.onReady!");
    // Once setup is done, load all product data.
    window.storekit.load(IAP.list, function (products, invalidIds) {
        console.log('IAPs loading done:');
        for (var j = 0; j < products.length; ++j) {
            var p = products[j];
            console.log('Loaded IAP(' + j + '). title:' + p.title +
                        ' description:' + p.description +
                        ' price:' + p.price +
                        ' id:' + p.id);
            IAP.products[p.id] = p;
        }
        IAP.loaded = true;
        for (var i = 0; i < invalidIds.length; ++i) {
            console.log('Error: could not load ' + invalidIds[i]);
        }
        IAP.render();
    });

    // Also check the receipts
    // storekit.loadReceipts(function (receipts) {
    //     console.log('appStoreReceipt: ' + receipts.appStoreReceipt);
    // });
};

IAP.onPurchase = function (transactionId, productId) {
    alert("IAP.onPurchase!");
    var n = (localStorage['storekit.' + productId]|0) + 1;
    localStorage['storekit.' + productId] = n;
    if (IAP.purchaseCallback) {
        IAP.purchaseCallback(productId);
        delete IAP.purchaseCallbackl;
    }

    window.storekit.finish(transactionId);

    window.storekit.loadReceipts(function (receipts) {
        console.log('Receipt for appStore = ' + receipts.appStoreReceipt);
        console.log('Receipt for ' + productId + ' = ' + receipts.forProduct(productId));
    });
};

IAP.onFinish = function (transactionId, productId) {
    console.log('Finished transaction for ' + productId + ' : ' + transactionId);
    alert("IAP.onFinish! Purchase complete: productId:"+productId+" transactionId:"+transactionId);
};

IAP.onError = function (errorCode, errorMessage) {
    alert("IAP.onError! Error: code:" + errorCode + " message:"+ errorMessage);
};

IAP.onRestore = function (transactionId, productId) {
    // console.log("IAP.onRestor!");
    console.log("Restored: " + productId);
    var n = (localStorage['storekit.' + productId]|0) + 1;
    localStorage['storekit.' + productId] = n;
};

IAP.onRestoreCompleted = function () {
    // console.log("IAP.onRestoreCompleted!");
    console.log("Restore Completed");
};

IAP.buy = function (productId, callback) {
    // console.log("IAP.buy!");
    IAP.purchaseCallback = callback;
    window.storekit.purchase(productId);
};

IAP.restore = function () {
    // console.log("IAP.restore!");
    window.storekit.restore();
};

IAP.fullVersion = function () {
    return localStorage['storekit.M1'];
};

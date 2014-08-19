/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * IAP StoreKit Interface
 * 
 * Usage:
 *  * Override the "onPurchase" and "onFinish" methods to integrate with app
 *  * Purchases should be persisted in the app
 *  * NOTE: make sure to override methods before the "initialize" method is called. 
 *  
 */
var IAP = {
    list: [],
    products: {}
};

IAP.initialize = function (list) {
    
    // Setup the productId list
    if(list){
        IAP.list = list;
    };
    
    // Check availability of the storekit plugin
    if (!window.storekit) {
        alert('In-App Purchases (Storekit) not available');
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
    storekit.loadReceipts(function (receipts) {
      console.log('appStoreReceipt: ' + receipts.appStoreReceipt);
    });
};

// Buy product by calling StoreKit.purchase()
IAP.buy = function (productId, callback) {
    // console.log("IAP.buy!");
    IAP.purchaseCallback = callback;
    window.storekit.purchase(productId);
};

// Restore products by calling StoreKit.restore()
IAP.restore = function () {
    // console.log("IAP.restore!");
    window.storekit.restore();
};

// Add a product to the product list
IAP.addProduct = function (productId){
    IAP.list.push(productId);
};

// optional override in application
IAP.onStoreReceipt = function (receipts) {
  console.log("IAP.onStoreReceipt!");
  console.log(receipts);
};

// override in application
IAP.onPurchase = function (transactionId, productId) {
    console.log("IAP.onPurchase! transactionId:"+transactionId+" productId:"+productId);
};

// override in application
IAP.onFinish = function (transactionId, productId) {
    console.log("IAP.onFinish! Purchase complete: productId:"+productId+" transactionId:"+transactionId);
};

// optional override in application
IAP.onError = function (errorCode, errorMessage) {
    alert("IAP.onError! Error: code:" + errorCode + " message:"+ errorMessage);
};

// optional override in application
IAP.onRestore = function (transactionId, productId) {
    console.log("IAP.onRestore! transactionId:"+transactionId+" productId:"+productId);
}

// optional override in application
IAP.onRestoreCompleted = function () {
    console.log("IAP.onRestoreCompleted!");
};




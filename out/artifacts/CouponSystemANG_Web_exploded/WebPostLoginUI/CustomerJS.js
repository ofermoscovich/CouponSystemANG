//purchased coupon controller
cs.controller('purchaseCoupon', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.func = function () {
        $scope.resultSuccess = false;
        $scope.resultWarning = false;
        $scope.resultString = null;
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/customer/purchaseCoupon?coupid=' + $scope.couponID,
        })
        .success(function (data, status, headers, config) {
            if (data != "") {
                $scope.resultSuccess = true;
                $scope.resultString = data;
            }
            else {
                $scope.resultWarning = true;
                $scope.resultString = 'failure purchasing coupon';
            }
        })
    }

}]);

//get purchased  coupons controller
cs.controller('getPurchasedCoupons', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hidePurchasedCouponsDetails = true;
    $scope.result = false;
    $scope.resultString = null;

    $scope.func = function () {
        $scope.hidePurchasedCouponsDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/customer/getAllPurchasedCoupons'
        })
        .success(function (data, status, headers, config) {
            if (data != '') {
                $scope.hidePurchasedCouponsDetails = false;
                $scope.coupons = data;
                //alert(JSON.stringify($scope.coupons));
                $scope.result = false;
                $scope.resultString = null;
            }
            else {
                $scope.result = true;
                $scope.resultString = "no coupons";
            }
        })
    }

}]);

//get purchased coupons by type controller
cs.controller('getPurchasedCouponsByType', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hidePurchasedCouponsByTypeDetails = true;
    $scope.result = false;
    $scope.resultString = null;

    $scope.func = function () {
        $scope.hidePurchasedCouponsByTypeDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/customer/getAllPurchasedCouponsByType?type=' + $scope.couponType
        })
        .success(function (data, status, headers, config) {
            if (data != '') {
                $scope.hidePurchasedCouponsByTypeDetails = false;
                $scope.coupons = data;
                //alert(JSON.stringify($scope.coupons));
                $scope.result = false;
                $scope.resultString = null;
            }
            else {
                $scope.result = true;
                $scope.resultString = "no coupons";
            }
        })
    }

}]);

//get purchased coupons by price controller
cs.controller('getPurchasedCouponsByPrice', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.hidePurchasedCouponsByPriceDetails = true;
    $scope.result = false;
    $scope.resultString = null;

    $scope.func = function () {
        $scope.hidePurchasedCouponsByPriceDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/customer/getAllPurchasedCouponsByPrice?price=' + $scope.couponPrice
        })
        .success(function (data, status, headers, config) {
            if (data != '') {
                $scope.hidePurchasedCouponsByPriceDetails = false;
                $scope.coupons = data;
                //alert(JSON.stringify($scope.coupons));
                $scope.result = false;
                $scope.resultString = null;
            }
            else {
                $scope.hidePurchasedCouponsByPriceDetails = true;
                $scope.result = true;
                $scope.resultString = "no coupons";
            }
        })
    }

}]);

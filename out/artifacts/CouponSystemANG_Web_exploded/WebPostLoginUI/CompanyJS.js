//create coupon controller
cs.controller('createCoupon', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.func = function () {
        $scope.resultSuccess = false;
        $scope.resultWarning = false;
        $scope.resultString = null;
        var coupon = {
            'id': 0, 'title': $scope.couponTitle, 'startDate': $scope.couponStartDate, 'endDate': $scope.couponEndDate,
            'amount': $scope.couponAmount, 'type': $scope.couponType, 'message': $scope.couponMessage, 'price': $scope.couponPrice, 'image': $scope.couponImage
        };
        //alert(JSON.stringify(coupon));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/company/createCoupon',
            data: coupon,
            // headers: { 'Content-Type': 'application/json' }
        })
        .success(function (data, status, headers, config) {
            if (data != "") {
                $scope.resultSuccess = true;
                $scope.resultString = data;
            }
            else {
                $scope.resultWarning = true;
                $scope.resultString = 'failure creating coupon';
            }
        })
    }

}]);

//update coupon controller
cs.controller('updateCoupon', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.func = function () {
        $scope.resultSuccess = false;
        $scope.resultWarning = false;
        $scope.resultString = null;
        var coupon = {
            'id': $scope.couponID, 'title': "", 'startDate': "", 'endDate': $scope.couponEndDate,
            'amount': $scope.couponAmount, 'type': "Electrical", 'message': "", 'price': $scope.couponPrice, 'image': ""
        };
        //alert(JSON.stringify(coupon));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/company/updateCoupon',
            data: coupon,
            // headers: { 'Content-Type': 'application/json' }
        })
        .success(function (data, status, headers, config) {
            if (data != "") {
                $scope.resultSuccess = true;
                $scope.resultString = data;
            }
            else {
                $scope.resultWarning = true;
                $scope.resultString = "coupon not updated";
            }
        })
    }

}]);

//delete coupon controller
cs.controller('removeCoupon', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.func = function () {
        $scope.resultSuccess = false;
        $scope.resultWarning = false;
        $scope.resultString = null;
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/csw/rest/cs/company/removeCoupon?coupid=' + $scope.couponID,
        })
        .success(function (data, status, headers, config) {
            if (data != "") {
                $scope.resultSuccess = true;
                $scope.resultString = data;
            }
            else {
                $scope.resultWarning = true;
                $scope.resultString = "coupon not deleted";
            }
        })
    }

}]);

//get my company controller
cs.controller('getMyCompany', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideMyCompanyDetails = true;
    $scope.hideCouponTable = true;
    $scope.result = false;
    $scope.resultString = null;

    $scope.func = function () {
        $scope.hideMyCompanyDetails = true;
        $scope.hideCouponTable = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/company/getCompany',
        })
       .success(function (data, status, headers, config) {
           if (data != "") {
               $scope.hideMyCompanyDetails = false;
               $scope.company = data;
               //alert(JSON.stringify(data));
               if ($scope.company.coupons != "") {
                   $scope.hideCouponTable = false;
               }
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

//get coupons controller
cs.controller('getCoupons', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideCouponsDetails = true;
    $scope.result = false;
    $scope.resultString = null;

    $scope.func = function () {
        $scope.hideCouponsDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/company/getCoupons'
        })
        .success(function (data, status, headers, config) {
            if (data != '') {
                $scope.hideCouponsDetails = false;
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

//get coupons by type controller
cs.controller('getCouponsByType', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideCouponsByTypeDetails = true;
    $scope.result = false;
    $scope.resultString = null;

    $scope.func = function () {
        $scope.hideCouponsByTypeDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/company/getCouponsByType?type=' + $scope.couponType
        })
        .success(function (data, status, headers, config) {
            if (data != '') {
                $scope.hideCouponsByTypeDetails = false;
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

//get coupons by price controller
cs.controller('getCouponsByPrice', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideCouponsByPriceDetails = true;
    $scope.result = false;
    $scope.resultString = null;

    $scope.func = function () {
        $scope.hideCouponsByPriceDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/company/getCouponsByMaxPrice?price=' + $scope.couponPrice
        })
        .success(function (data, status, headers, config) {
            if (data != '') {
                $scope.hideCouponsByPriceDetails = false;
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

//get coupons by date controller
cs.controller('getCouponsByDate', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideCouponsByDateDetails = true;
    $scope.result = false;
    $scope.resultString = null;

    $scope.func = function () {
        var date = Date.parse($scope.couponEndDate);
        $scope.hideCouponsByDateDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/company/getCouponsByMaxDate?timestamp='+date,
        })
        .success(function (data, status, headers, config) {
            if (data != '') {
                $scope.hideCouponsByDateDetails = false;
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

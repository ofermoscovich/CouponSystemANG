//the main module holding all containers

var cs = angular.module('csw', ['ngRoute'])
.config(function ($routeProvider,$locationProvider, $httpProvider) {
    $routeProvider
    .when('/createCompany', {
        templateUrl: 'admin_partials/createCompany.html',
        controller: 'createCompany'
        })
    .when('/removeCompany', {
        templateUrl: 'admin_partials/removeCompany.html',
        controller: 'removeCompany'
    }).when('/updateCompany', {
        templateUrl: 'admin_partials/updateCompany.html',
        controller: 'updateCompany'
    }).when('/getCompany', {
        templateUrl: 'admin_partials/getCompany.html',
        controller: 'getCompany'
    }).when('/getAllCompanies', {
        templateUrl: 'admin_partials/getAllCompanies.html',
        controller: 'getAllCompanies'
    }).when('/createCustomer', {
        templateUrl: 'admin_partials/createCustomer.html',
        controller: 'createCustomer'
    }).when('/removeCustomer', {
        templateUrl: 'admin_partials/removeCustomer.html',
        controller: 'removeCustomer'
    }).when('/updateCustomer', {
        templateUrl: 'admin_partials/updateCustomer.html',
        controller: 'updateCustomer'
    }).when('/getCustomer', {
        templateUrl: 'admin_partials/getCustomer.html',
        controller: 'getCustomer'
    }).when('/getAllCustomers', {
        templateUrl: 'admin_partials/getAllCustomers.html',
        controller: 'getAllCustomers'
    }).when('/getCoupon', {
        templateUrl: 'admin_partials/getCoupon.html',
        controller: 'getCoupon'
    }).when('/getAllCoupons', {
        templateUrl: 'admin_partials/getAllCoupons.html',
        controller: 'getAllCoupons'
    }).when('/createCoupon', {
        templateUrl: 'company_partials/createCoupon.html',
        controller: 'createCoupon'
    }).when('/removeCoupon', {
        templateUrl: 'company_partials/removeCoupon.html',
        controller: 'removeCoupon'
    }).when('/updateCoupon', {
        templateUrl: 'company_partials/updateCoupon.html',
        controller: 'updateCoupon'
    }).when('/getMyCompany', {
        templateUrl: 'company_partials/getMyCompany.html',
        controller: 'getMyCompany'
    }).when('/getCoupons', {
        templateUrl: 'company_partials/getCoupons.html',
        controller: 'getCoupons'
    }).when('/getCouponsByDate', {
        templateUrl: 'company_partials/getCouponsByDate.html',
        controller: 'getCouponsByDate'
    }).when('/getCouponsByPrice', {
        templateUrl: 'company_partials/getCouponsByPrice.html',
        controller: 'getCouponsByPrice'
    }).when('/getCouponsByType', {
        templateUrl: 'company_partials/getCouponsByType.html',
        controller: 'getCouponsByType'
    }).when('/purchaseCoupon', {
        templateUrl: 'customer_partials/purchaseCoupon.html',
        controller: 'purchaseCoupon'
    }).when('/getPurchasedCoupons', {
        templateUrl: 'customer_partials/getPurchasedCoupons.html',
        controller: 'getPurchasedCoupons'
    }).when('/getPurchasedCouponsByPrice', {
        templateUrl: 'customer_partials/getPurchasedCouponsByPrice.html',
        controller: 'getPurchasedCouponsByPrice'
    }).when('/getPurchasedCouponsByType', {
        templateUrl: 'customer_partials/getPurchasedCouponsByType.html',
        controller: 'getPurchasedCouponsByType'
    });
    $locationProvider.html5Mode(true);
});

cs.service('hideMenu', function () {

    this.adminMenu = true;
    this.companyMenu = true;
    this.customerMenu = true;
    this.showLogin = true;

    this.setAdminMenu = function (bool) {
        this.adminMenu = bool;
    };

    this.setCompanyMenu = function (bool) {
        this.companyMenu = bool;
    };

    this.setCustomerMenu = function (bool) {
        this.customerMenu = bool;
    };

    
    this.getAdminMenu = function () {
        return this.adminMenu;
    };

    this.getCompanyMenu = function () {
        return this.companyMenu;
    };
    this.getCustomerMenu = function () {
        return this.customerMenu;
    };

    this.setShowLogin = function (bool) {
        this.showLogin = bool;
    };
    this.getShowLogin = function () {
        return this.showLogin;
    };
    
    
});

//login controller
cs.controller('login', function ($rootScope, $scope, $http ,hideMenu) {
    $scope.hideMenu = hideMenu;

    //login function
    $scope.login = function () {
        $scope.resultWarning = false;
        var esj = 'username=' + encodeURIComponent($scope.UserName)
							  + '&password=' + encodeURIComponent($scope.Password);
        //var esj = angular.toJson(encodedString, false);
        //var esj = {
        //   'username': $scope.UserName, 'password': $scope.Password
        //};
        //alert(esj);
        if ($scope.ClientType == 'Administrator') {
//            $http.post("rest/cs/admin/login", esj)
            
            $http(
                {
                    method: 'post',
                    url: 'http://localhost:8080/csw/rest/cs/admin/login',
                    //data: dataObj,
                    data: esj,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .then(function (response) {
                    if (response.data != "") {
                        hideMenu.setShowLogin(false);
                        hideMenu.setAdminMenu(false);
                        hideMenu.setCompanyMenu(true);
                        hideMenu.setCustomerMenu(true);
                    }
                    else{
                    	$scope.resultWarning = true;
                    	$scope.resultString = "login unsuccessfull - try again";
                    }
                });
        }
        else if ($scope.ClientType == 'Company') {
            $http(
                {
                    method: 'post',
                    url: 'http://localhost:8080/csw/rest/cs/company/login',
                    //data: dataObj,
                    data: esj,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    if (data != "") {
                        hideMenu.setShowLogin(false);
                        hideMenu.setAdminMenu(true);
                        hideMenu.setCompanyMenu(false);
                        hideMenu.setCustomerMenu(true);
                    }
                    else {
                        $scope.resultWarning = true;
                        $scope.resultString = "login unsuccessfull - try again";
                    }
                });
        }
        else if ($scope.ClientType == 'Customer') {
            $http(
                {
                    method: 'post',
                    url: 'http://localhost:8080/csw/rest/cs/customer/login',
                    //data: dataObj,
                    data: esj,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function (data, status, headers, config) {
                    if (data != "") {
                        hideMenu.setShowLogin(false);
                        hideMenu.setAdminMenu(true);
                        hideMenu.setCompanyMenu(true);
                        hideMenu.setCustomerMenu(false);
                    }
                    else {
                        $scope.resultWarning = true;
                        $scope.resultString = "login unsuccessfull - try again";
                    }
                });
        }
    }

});

//menu controller
cs.controller('menu', function ($rootScope, $scope, $http, hideMenu) {
    $scope.hideMenu = hideMenu;

    //admin logout function
    $scope.adminLogout = function () {

            $http(
                {
                    method: 'post',
                    url: 'http://localhost:8080/csw/rest/cs/admin/logout'
                });
        /*
        hideMenu.setShowLogin(true);
        hideMenu.setAdminMenu(true);
        hideMenu.setCompanyMenu(true);
        hideMenu.setCustomerMenu(true);
     */
            window.location = "http://localhost:8080/csw";
    }

    //company logout function
    $scope.companyLogout = function () {

                $http(
                {
                    method: 'post',
                    url: 'http://localhost:8080/csw/rest/cs/company/logout'
                });
        /*
            hideMenu.setShowLogin(true);
            hideMenu.setAdminMenu(true);
            hideMenu.setCompanyMenu(true);
            hideMenu.setCustomerMenu(true);
         */
            window.location = "http://localhost:8080/csw";
    }

    //customer logout function
    $scope.customerLogout = function () {

        $http(
                {
                    method: 'post',
                    url: 'http://localhost:8080/csw/rest/cs/customer/logout'
                });
        /*
            hideMenu.setShowLogin(true);
            hideMenu.setAdminMenu(true);
            hideMenu.setCompanyMenu(true);
            hideMenu.setCustomerMenu(true);
         */
        window.location = "http://localhost:8080/csw";
    }
});


/*
//purchased coupon controller
cs.controller('purchaseCoupon', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showPurchaseCoupon = true;

    $scope.func = function () {

        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/customer/purchaseCoupon?coupid=' + $scope.couponID,
        })
        .success(function (data, status, headers, config) {
            if (data != null)
                alert(data);
            else
                alert("coupon not purchased");
        })
    }

}]);

//get purchased  coupons controller
cs.controller('getPurchasedCoupons', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.showGetPurchasedCoupons = true;
    $scope.hidePurchasedCouponsDetails = true;

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
                alert(JSON.stringify($scope.coupons));
            }
            else
                alert("no coupons purchased");
        })
    }

}]);

//get purchased coupons by type controller
cs.controller('getPurchasedCouponsByType', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.showGetPurchasedCouponsByType = true;
    $scope.hidePurchasedCouponsByTypeDetails = true;

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
                alert(JSON.stringify($scope.coupons));
            }
            else
                alert("no coupons");
        })
    }

}]);

//get purchased coupons by price controller
cs.controller('getPurchasedCouponsByPrice', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.showGetPurchasedCouponsByPrice = true;
    $scope.hidePurchasedCouponsByPriceDetails = true;

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
                alert(JSON.stringify($scope.coupons));
            }
            else
                alert("no coupons");
        })
    }

}]);
*/

/*
//create coupon controller
cs.controller('createCoupon', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showCreateCoupon = true;

    $scope.func = function () {

        var coupon = { 'id': 0, 'title': $scope.couponTitle, 'startDate': $scope.couponStartDate, 'endDate': $scope.couponEndDate, 
            'amount': $scope.couponAmount, 'type': $scope.couponType, 'message': $scope.couponMessage, 'price': $scope.couponPrice, 'image': $scope.couponImage};
        alert(JSON.stringify(coupon));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/company/createCoupon',
            data: coupon,
            // headers: { 'Content-Type': 'application/json' }
        })
        .success(function (data, status, headers, config) {
            if (data != null)
                alert(data);
            else
                alert("coupon not created");
        })
    }

}]);

//update coupon controller
cs.controller('updateCoupon', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showUpdateCoupon = true;

    $scope.func = function () {
        var coupon = {
            'id': $scope.couponID, 'title': "", 'startDate': "", 'endDate': $scope.couponEndDate,
            'amount': $scope.couponAmount, 'type': "", 'message': "", 'price': $scope.couponPrice, 'image': ""
        };
        alert(JSON.stringify(coupon));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/company/updateCoupon',
            data: coupon,
            // headers: { 'Content-Type': 'application/json' }
        })
        .success(function (data, status, headers, config) {
            if (data != null)
                alert(data);
            else
                alert("coupon not updated");
        })
    }

}]);

//delete coupon controller
cs.controller('removeCoupon', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showRemoveCoupon = true;

    $scope.func = function () {

        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/csw/rest/cs/company/removeCoupon?coupid=' + $scope.couponID,
        })
        .success(function (data, status, headers, config) {
            if (data != null)
                alert(data);
            else
                alert("coupon not removed");
        })
    }

}]);

//get my company controller
cs.controller('getMyCompany', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showGetMyCompany = true;
    $scope.hideMyCompanyDetails = true;

    $scope.func = function () {
        $scope.hideMyCompanyDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/company/getCompany',
        })
       .success(function (data, status, headers, config) {
           if (data != "") {
               $scope.hideMyCompanyDetails = false;
               $scope.company = data;
               alert(JSON.stringify(data));
           }
           else
               alert("error/no company");
       })
    }

}]);

//get coupons controller
cs.controller('getCoupons', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.showGetCoupons = true;
    $scope.hideCouponsDetails = true;

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
                alert(JSON.stringify($scope.coupons));
            }
            else
                alert("no coupons");
        })
    }

}]);

//get coupons by type controller
cs.controller('getCouponsByType', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.showGetCouponsByType = true;
    $scope.hideCouponsByTypeDetails = true;

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
                alert(JSON.stringify($scope.coupons));
            }
            else
                alert("no coupons");
        })
    }

}]);

//get coupons by price controller
cs.controller('getCouponsByPrice', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.showGetCouponsByPrice = true;
    $scope.hideCouponsByPriceDetails = true;

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
                alert(JSON.stringify($scope.coupons));
            }
            else
                alert("no coupons");
        })
    }

}]);

//get coupons by date controller
cs.controller('getCouponsByDate', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.showGetCouponsByDate = true;
    $scope.hideCouponsByDateDetails = true;

    $scope.func = function () {
        $scope.hideCouponsByDateDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/company/getCouponsByMaxDate' + $scope.couponEndDate
        })
        .success(function (data, status, headers, config) {
            if (data != '') {
                $scope.hideCouponsByDateDetails = false;
                $scope.coupons = data;
                alert(JSON.stringify($scope.coupons));
            }
            else
                alert("no coupons");
        })
    }

}]);
*/

/*
//create company controller
cs.controller('createCompany', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showCreateCompany = true;

    $scope.func = function () {

        var company = { 'id': 0, 'compName': $scope.companyName, 'password': $scope.companyPassword, 'email': $scope.companyEmail, 'coupons': [] };
        alert(JSON.stringify(company));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/admin/createCompany',
            data: company,
            // headers: { 'Content-Type': 'application/json' }
        })
        .success(function (data, status, headers, config) {
            if (data != null)
                alert(data);
            else
                alert("company not created");
        })
    }

}]);

//update company controller
cs.controller('updateCompany', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showUpdateCompany = true;

    $scope.func = function () {

        var company = { 'id': $scope.companyID, 'compName': "", 'password': $scope.companyPassword, 'email': $scope.companyEmail, 'coupons': [] };
        alert(JSON.stringify(company));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/admin/updateCompany',
            data: company,
            // headers: { 'Content-Type': 'application/json' }
        })
        .success(function (data, status, headers, config) {
            if (data != null)
                alert(data);
            else
                alert("company not updated");
        })
    }

}]);

//delete company controller
cs.controller('removeCompany', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showRemoveCompany = true;

    $scope.func = function () {

        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/csw/rest/cs/admin/removeCompany?compid=' + $scope.compID,
        })
        .success(function (data, status, headers, config) {
            if (data != null)
                alert(data);
            else
                alert("company not removed");
        })
    }

}]);

//get company controller
cs.controller('getCompany', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showGetCompany = true;
    $scope.hideCompanyDetails = true;

    $scope.func = function () {
        $scope.hideCompanyDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/admin/getCompany?compid=' + $scope.compID,
        })
       .success(function (data, status, headers, config) {
           if (data != "") {
               $scope.hideCompanyDetails = false;
               $scope.company = data;
               alert(JSON.stringify(data));
           }
           else
               alert("error/no company");
       })
    }

}]);

//get all companies controller
cs.controller('getAllCompanies', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showGetAllCompanies = true;
    $scope.hideCompaniesDetails = true;
    $scope.allCompanies = null;

    $scope.func = function () {
        $scope.hideCompaniesDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/admin/getAllCompanies',
        })
       .success(function (data, status, headers, config) {
           if (data != "") {;
               $scope.hideCompaniesDetails = false;
               $scope.companies = data;
               alert(JSON.stringify($scope.companies));
           }
           else
               alert("error/no companies");
       })
    }

}]);

//create customer controller
cs.controller('createCustomer', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showCreateCustomer = true;

    $scope.func = function () {
        var customer = { 'id': 0, 'custName': $scope.customerName, 'password': $scope.customerPassword, 'coupons': [] };
        alert(JSON.stringify(customer));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/admin/createCustomer',
            data: customer,
            // headers: { 'Content-Type': 'application/json' }
        })
       .success(function (data, status, headers, config) {
           if (data != null)
               alert(data);
           else
               alert("customer not created");
       })
    }

}]);

//update customer controller
cs.controller('updateCustomer', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showUpdateCustomer = true;

    $scope.func = function () {
        var customer = { 'id': $scope.customerID, 'custName': "", 'password': $scope.customerPassword, 'coupons': [] };
        alert(JSON.stringify(customer));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/admin/updateCustomer',
            data: customer,
            // headers: { 'Content-Type': 'application/json' }
        })
       .success(function (data, status, headers, config) {
           if (data != null)
               alert(data);
           else
               alert("customer not updated");
       })
    }

}]);

//delete customer controller
cs.controller('removeCustomer', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showRemoveCustomer = true;

    $scope.func = function () {

        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/csw/rest/cs/admin/removeCustomer?custid=' + $scope.custID,
        })
        .success(function (data, status, headers, config) {
            if (data != null)
                alert(data);
            else
                alert("customer not removed");
        })
    }

}]);

//get customer controller
cs.controller('getCustomer', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showGetCustomer = true;
    $scope.hideCustomerDetails = true;

    $scope.func = function () {
        $scope.hideCustomerDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/admin/getCustomer?custid=' + $scope.custID,
        })
       .success(function (data, status, headers, config) {
           if (data != "") {
               $scope.hideCustomerDetails = false;
               $scope.customer = data;
               alert(JSON.stringify(data));
           }
           else
               alert("error/no customer");
       })
    }

}]);

//get all customers controller
cs.controller('getAllCustomers', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showGetAllCustomers = true;
    $scope.hideCustomersDetails = true;

    $scope.func = function () {
        $scope.hideCustomersDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/admin/getAllCustomers',
        })
       .success(function (data, status, headers, config) {
           if (data != "") {;
               $scope.hideCustomersDetails = false;
               $scope.customers = data;
               alert(JSON.stringify($scope.customers));
           }
           else
               alert("error/no customers");
       })
    }

}]);

//get coupon controller
cs.controller('getCoupon', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showGetCoupon = true;
    $scope.hideCouponDetails = true;

    $scope.func = function () {
        $scope.hideCouponDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/admin/getCoupon?coupid=' + $scope.coupID,
        })
       .success(function (data, status, headers, config) {
           if (data != "") {
               $scope.hideCouponDetails = false;
               $scope.coupon = data;
               alert(JSON.stringify(data));
           }
           else
               alert("error/no coupon");
       })
    }

}]);

//get all coupons controller
cs.controller('getAllCoupons', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.showGetAllCoupons = true;
    $scope.hideCouponDetails = true;

    $scope.func = function () {
        $scope.hideCustomersDetails = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/admin/getAllCoupons',
        })
       .success(function (data, status, headers, config) {
           if (data != "") {;
               $scope.hideCouponDetails = false;
               $scope.coupons = data;
               alert(JSON.stringify($scope.coupons));
           }
           else
               alert("error/no coupons");
       })
    }

}]);
*/
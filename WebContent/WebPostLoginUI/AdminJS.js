//create company controller
cs.controller('createCompany', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.func = function () {
        $scope.resultSuccess = false;
        $scope.resultWarning = false;
        $scope.resultString = null;
        var company = { 'id': 0, 'compName': $scope.companyName, 'password': $scope.companyPassword, 'email': $scope.companyEmail, 'coupons': [] };
        //alert(JSON.stringify(company));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/admin/createCompany',
            data: company,
            // headers: { 'Content-Type': 'application/json' }
        })
        .success(function (data, status, headers, config) {
            if (data != "") {
                $scope.resultString = data;
                $scope.resultSuccess = true;
            }
            else {
                $scope.resultString = 'failure creating company';
                $scope.resultWarning = true;

            }
        })
    }

}]);

//update company controller
cs.controller('updateCompany', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.func = function () {
        $scope.resultSuccess = false;
        $scope.resultWarning = false;
        $scope.resultString = null;
        var company = { 'id': $scope.companyID, 'compName': "", 'password': $scope.companyPassword, 'email': $scope.companyEmail, 'coupons': [] };
        //alert(JSON.stringify(company));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/admin/updateCompany',
            data: company,
            // headers: { 'Content-Type': 'application/json' }
        })
        .success(function (data, status, headers, config) {
            if (data != ""){
                $scope.resultSuccess = true;
                $scope.resultString = data;
            }
            else {
                $scope.resultWarning = true;
                $scope.resultString = "company not updated";
            }
        })
    }

}]);

//delete company controller
cs.controller('removeCompany', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {
    $scope.func = function () {

        $scope.resultSuccess = false;
        $scope.resultWarning = false;
        $scope.resultString = null;
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/csw/rest/cs/admin/removeCompany?compid=' + $scope.compID,
        })
        .success(function (data, status, headers, config) {
            if (data != "") {
                $scope.resultString = data;
                $scope.resultSuccess = true;
            }
            else {
                $scope.resultString = "company not deleted";
                $scope.resultWarning = true;
            }
        })
    }

}]);

//get company controller
cs.controller('getCompany', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideCompanyDetails = true;
    $scope.hideCouponTable = true;
    $scope.result = false;
    $scope.resultString = null;

    $scope.func = function () {
        $scope.hideCompanyDetails = true;
        $scope.hideCouponTable = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/admin/getCompany?compid=' + $scope.compID,
        })
       .success(function (data, status, headers, config) {
           if (data != "") {
               $scope.hideCompanyDetails = false;
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
               $scope.resultString = "company doesn't exist";
           }
       })
    }

}]);

//get all companies controller
cs.controller('getAllCompanies', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideCompaniesDetails = true;
    //$scope.allCompanies = null;
    $scope.result = false;
    $scope.resultString = null;

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
               //alert(JSON.stringify($scope.companies));
               $scope.result = false;
               $scope.resultString = null;
           }
           else {
               $scope.result = true;
               $scope.resultString = "no companies";
           }
       })
    }

}]);

//create customer controller
cs.controller('createCustomer', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.func = function () {
        $scope.resultSuccess = false;
        $scope.resultWarning = false;
        $scope.resultString = null;
        var customer = { 'id': 0, 'custName': $scope.customerName, 'password': $scope.customerPassword, 'coupons': [] };
        //alert(JSON.stringify(customer));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/admin/createCustomer',
            data: customer,
            // headers: { 'Content-Type': 'application/json' }
        })
       .success(function (data, status, headers, config) {
           if (data != "") {
               $scope.resultString = data;
               $scope.resultSuccess = true;
           }
           else {
               $scope.resultString = 'failure creating customer';
               $scope.resultWarning = true;
           }
       })
    }

}]);

//update customer controller
cs.controller('updateCustomer', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.func = function () {
        $scope.resultSuccess = false;
        $scope.resultWarning = false;
        $scope.resultString = null;
        var customer = { 'id': $scope.customerID, 'custName': "", 'password': $scope.customerPassword, 'coupons': [] };
        //alert(JSON.stringify(customer));
        $http({
            method: 'POST',
            url: 'http://localhost:8080/csw/rest/cs/admin/updateCustomer',
            data: customer,
            // headers: { 'Content-Type': 'application/json' }
        })
       .success(function (data, status, headers, config) {
           if (data != "") {
               $scope.resultString = data;
               $scope.resultSuccess = true;
           }
           else {
               $scope.resultString = "customer not updated";
               $scope.resultWarning = true;
           }
       })
    }

}]);

//delete customer controller
cs.controller('removeCustomer', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.func = function () {
        $scope.resultSuccess = false;
        $scope.resultWarning = false;
        $scope.resultString = null;
        $http({
            method: 'DELETE',
            url: 'http://localhost:8080/csw/rest/cs/admin/removeCustomer?custid=' + $scope.custID,
        })
        .success(function (data, status, headers, config) {
            if (data != "") {
                $scope.resultString = data;
                $scope.resultSuccess = true;
            }
            else {
                $scope.resultString = "customer not deleted";
                $scope.resultWarning = true;
            }
        })
    }

}]);

//get customer controller
cs.controller('getCustomer', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideCustomerDetails = true;
    $scope.hideCouponTable = true;
    $scope.result = false;
    $scope.resultString = null;

    $scope.func = function () {
        $scope.hideCustomerDetails = true;
        $scope.hideCouponTable = true;
        $http({
            method: 'GET',
            url: 'http://localhost:8080/csw/rest/cs/admin/getCustomer?custid=' + $scope.custID,
        })
       .success(function (data, status, headers, config) {
           if (data != "") {
               $scope.hideCustomerDetails = false;
               $scope.customer = data;
               //alert(JSON.stringify(data));
               if ($scope.customer.coupons != "") {
                   $scope.hideCouponTable = false;
               }
               $scope.result = false;
               $scope.resultString = null;
           }
           else {
               $scope.result = true;
               $scope.resultString = "customer doesn't exist";
           }
       })
    }

}]);

//get all customers controller
cs.controller('getAllCustomers', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideCustomersDetails = true;
    //$scope.allCustomers = null;
    $scope.result = false;
    $scope.resultString = null;

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
               //alert(JSON.stringify($scope.customers));
               $scope.result = false;
               $scope.resultString = null;
           }
           else {
               $scope.result = true;
               $scope.resultString = "no customers";
           }
       })
    }

}]);

//get coupon controller
cs.controller('getCoupon', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideCouponDetails = true;
    $scope.result = false;
    $scope.resultString = null;
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
               //alert(JSON.stringify(data));
               $scope.result = false;
               $scope.resultString = null;
           }
           else{
        	   $scope.result = true;
               $scope.resultString = "coupon doesn't exist";
           }
       })
    }

}]);

//get all coupons controller
cs.controller('getAllCoupons', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http) {

    $scope.hideCouponDetails = true;
    $scope.result = false;
    $scope.resultString = null;

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
               //alert(JSON.stringify($scope.coupons));
               $scope.result = false;
               $scope.resultString = null;
           }
           else{
        	   $scope.result = true;
        	    $scope.resultString = "no coupons";
           }
       })
    }

}]);

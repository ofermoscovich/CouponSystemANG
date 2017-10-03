
//define the main page module - which holds all containers
angular.module('couponSystem', []);

//for each screen-div define a dedicated controller. in this case we got only one screen...
angular.module('couponSystem').controller('toDoController', function ($rootScope, $scope, $http) {

    $scope.showDiv = true;


    $scope.user = "admin"; // for mainteneance only
    $scope.pass = "1234"; // for mainteneance only
    $scope.facade = "admin";
	//$scope.facade.align = "center";

    substring = "Success";
   
    $scope.login = function () {
        $scope.resultLogin = false;

        var url = "http://localhost:8080/CouponSystemANG/rest/" + $scope.facade + "/" + $scope.facade + "Login?" + "user=" + $scope.user + "&pass=" + $scope.pass;

        $http.get(url)
        .success(function (data) {
            if (data.indexOf(substring) > -1) {
                $scope.resultString = "Valid11";
                $scope.myStyle = { "background": "yellow" };
                $scope.resultLogin = true;
                //alert("success: \n" + url);
                //$window.open($scope.facade + "Menu.html", "_blank"); //"/" +
                //$http.get("/CouponSystemANG/" + $scope.facade + "Menu.html");
				// $scope.mainPage.html = '/adminMenu.html<a href="#">click here</a>,/adminMenu.html<a href="#">click here</a>';
                // $scope.myHtml = '/adminMenu.html<a href="#">click here</a>,/adminMenu.html<a href="#">click here</a>';
				//$window.location.href("/mainPage.html");
				location.replace("WebPostLoginUI/mainPage.html"); // location.assign();//   http://localhost:8080/CouponSystemANG/
            } 
            else {
                $scope.resultString = "Invalid User or Password!";
                $scope.myStyle = { "background": "yellow" };
                $scope.resultLogin = true;
                //alert("failure: \n" + url);
            }
        })
    }
});
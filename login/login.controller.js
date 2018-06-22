(function () {
    'use strict';



    LoginController.$inject = ['$location', 'FlashService', '$scope', '$state', 'AuthenticationService'];

    function LoginController($location, FlashService, $scope, $state, AuthenticationService) {
        var vm = this;



        $scope.xmlToJson = function (xml) {

            // Create the return object
            var obj = {};

            if (xml.nodeType == 1) { // element
                // do attributes
                if (xml.attributes.length > 0) {
                    obj["@attributes"] = {};
                    for (var j = 0; j < xml.attributes.length; j++) {
                        var attribute = xml.attributes.item(j);
                        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                    }
                }
            } else if (xml.nodeType == 3) { // text
                obj = xml.nodeValue;
            }

            // do children
            // If just one text node inside
            if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
                obj = xml.childNodes[0].nodeValue;
            } else if (xml.hasChildNodes()) {
                for (var i = 0; i < xml.childNodes.length; i++) {
                    var item = xml.childNodes.item(i);
                    var nodeName = item.nodeName;
                    if (typeof (obj[nodeName]) == "undefined") {
                        obj[nodeName] = $scope.xmlToJson(item);
                    } else {
                        if (typeof (obj[nodeName].push) == "undefined") {
                            var old = obj[nodeName];
                            obj[nodeName] = [];
                            obj[nodeName].push(old);
                        }
                        obj[nodeName].push($scope.xmlToJson(item));
                    }
                }
            }
            return obj;
        }

        //vm.login = login;
        $scope.login = true;

        $("#mahindraBackground").css({
            'background': 'url(img/bgimage.jpg) no-repeat center center fixed',
            '-webkit-background-size': 'cover',
            '-moz-background-size': 'cover',
            '-o-background-size': 'cover',
            ' background-size': 'cover'
        });

        $scope.login1 = function () {
            //alert($scope.username)
            vm.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password).then(function (response) {
                console.log(response.data);


                var xmlDOM = new DOMParser().parseFromString(response.data, 'text/xml');
                var op = $scope.xmlToJson(xmlDOM);
                console.log(op);
                //console.log(op.UserList.IsSuccessfull);
                if (op.IsSuccessFull == 0) {
                    alert('Please enter correct username & password');
                } else if (op.UserList.IsSuccessfull == 1) {
                    window.localStorage['username'] = $scope.username;
                    $location.path('/');
                }

                /*  if($scope.username=='208881' && $scope.password=='vub@8881'){
                      //$location.path('/');
                      window.localStorage['username'] = $scope.username;
                      $location.path('/');
                  }else{
                      alert('Please enter correct username & password');
                      vm.dataLoading=false;
                  }*/

            }).catch(function (err) {
                console.log(err);
            });


        };
    }
    angular
        .module('app')
        .controller('LoginController', LoginController);
})();

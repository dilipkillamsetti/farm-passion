(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['UserService', '$rootScope', '$scope', '$http', '$log', '$location', '$state', '$uibModal'];
    function HomeController(UserService, $rootScope, $scope, $http, $log, $location, $state, $uibModal) {
        var vm = this;

        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;

        if(!window.localStorage['username'])
            {
                $state.go('login');
            }

        $("#mahindraBackground").css('background',"");

        initController();

        function initController() {
            loadCurrentUser();
            loadAllUsers();
        }

        function loadCurrentUser() {
            UserService.GetByUsername('test')
                .then(function (user) {
                    vm.user = user;
                });
        }

        function loadAllUsers() {
            UserService.GetAll()
                .then(function (users) {
                    vm.allUsers = users;
                });
        }

        function deleteUser(id) {
            UserService.Delete(id)
            .then(function () {
                loadAllUsers();
            });
        }

          $scope.items = ['item1', 'item2', 'item3'];

          $scope.animationsEnabled = true;

          $scope.open = function (userId) {

            $scope.selectedUserID = userId;

            var url = "http://192.168.1.123:8185/capital-backend/list-capital.php";
            UserService.getRequest(url).then(function(response){

                $scope.capitals = response.data;
                $scope.totalItems = $scope.capitals.length;
                $scope.numPages = Math.ceil($scope.totalItems/$scope.itemsPerPage);

                angular.forEach($scope.capitals,function(value,key){

                    value.id = parseInt(value.id);
                    value.user_id = parseInt(value.user_id);
                    value.cap_at_beg = parseInt(value.cap_at_beg);
                    value.cap_at_end = parseInt(value.cap_at_end);
                    value.level_at_beg = parseInt(value.level_at_beg);
                    value.assessment_score = parseInt(value.assessment_score);
                    value.cycle_start_time = new Date(parseInt(value.cycle_start_time)*1000);
                    value.cycle_end_time = new Date((value.cycle_end_time)*1000);
                    value.level_start_time = new Date(parseInt(value.level_start_time)*1000);
                    value.level_end_time = new Date(parseInt(value.level_end_time)*1000);
                });

                var modalInstance = $uibModal.open({
                  animation: $scope.animationsEnabled,
                  scope:$scope,
                  templateUrl: 'home/myModalContent.html',
                  controller: 'ModalInstanceCtrl',
                  size: 'lg',
                  resolve: {
                    items: function () {
                      return $scope.items;
                    }
                  }
                });

                modalInstance.result.then(function (selectedItem) {
                  $scope.selected = selectedItem;
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });
            });
          };

        $scope.openAccordion = function (userId) {

            if($scope.accordion)
            {

                $scope.selectedUserID = userId;

                var url = "http://192.168.1.123:8185/capital-backend/list-capital-by-id.php?userId="+userId;
                UserService.getRequest(url).then(function(response){

                    $scope.selectedCapitals = response.data;

                    $scope.totalItems1 = $scope.selectedCapitals.length;
                    $scope.numPages1 = Math.ceil($scope.totalItems1/$scope.itemsPerPage);

                    $scope.accordion = false;
     
                    angular.forEach($scope.selectedCapitals,function(value,key){

                        value.id = parseInt(value.id);
                        value.user_id = parseInt(value.user_id);
                        value.cap_at_beg = parseInt(value.cap_at_beg);
                        value.cap_at_end = parseInt(value.cap_at_end);
                        value.level_at_beg = parseInt(value.level_at_beg);
                        value.assessment_score = parseInt(value.assessment_score);
                        value.cycle_start_time = new Date(parseInt(value.cycle_start_time)*1000);
                        value.cycle_end_time = new Date(parseInt(value.cycle_end_time)*1000);
                        value.level_start_time = new Date(parseInt(value.level_start_time)*1000);
                        value.level_end_time = new Date(parseInt(value.level_end_time)*1000);
                    });

                        var modalInstance = $uibModal.open({
                          animation: $scope.animationsEnabled,
                          scope:$scope,
                          templateUrl: 'home/capitalById.html',
                          controller: 'ModalInstanceCtrl',
                          size: 'lg',
                          resolve: {
                            items: function () {
                              return $scope.items;
                            }
                          }
                        });

                        modalInstance.result.then(function (selectedItem) {
                          $scope.selected = selectedItem;
                        }, function () {
                          $log.info('Modal dismissed at: ' + new Date());
                        });
                });
            }
            else
                $scope.accordion = true;

          };

          $scope.toggleAnimation = function () {
            $scope.animationsEnabled = !$scope.animationsEnabled;
          };

          $scope.orderByField = 'created_at';
          $scope.reverseSort = true;
          $scope.orderByField1 = 'created_at';
          $scope.reverseSort1 = true;
          $scope.viewby = 5;
          $scope.currentPage = 1;
          $scope.currentPage1 = 1;
          $scope.itemsPerPage = $scope.viewby;
          $scope.itemsPerPage1 = $scope.viewby;
          $scope.maxSize = 5; //Number of pager buttons to show

          $scope.accordion = true;

            var url = "http://192.168.1.123:8185/capital-backend/list-capital.php";
                UserService.getRequest(url).then(function(response){

                    $scope.capitals = response.data;
                    $scope.totalItems = $scope.capitals.length;
                    $scope.numPages = Math.ceil($scope.totalItems/$scope.itemsPerPage);
 
                    angular.forEach($scope.capitals,function(value,key){

                        value.id = parseInt(value.id);
                        value.user_id = parseInt(value.user_id);
                        value.cap_at_beg = parseInt(value.cap_at_beg);
                        value.cap_at_end = parseInt(value.cap_at_end);
                        value.level_at_beg = parseInt(value.level_at_beg);
                        value.assessment_score = parseInt(value.assessment_score);
                        value.cycle_start_time = new Date(parseInt(value.cycle_start_time)*1000);
                        value.cycle_end_time = new Date((value.cycle_end_time)*1000);
                        value.level_start_time = new Date(parseInt(value.level_start_time)*1000);
                        value.level_end_time = new Date(parseInt(value.level_end_time)*1000);
                    });
                });
    
            $scope.searchCapital = function(){

                var url = "http://192.168.1.123:8185/capital-backend/search-capital.php?q="+$scope.cycleSearchKey;
                UserService.getRequest(url).then(function(response){
                    $scope.capitals = response.data;
                    $scope.totalItems = $scope.capitals.length;
                    $scope.numPages = Math.ceil($scope.totalItems/$scope.itemsPerPage);

                    angular.forEach($scope.capitals,function(value,key){

                        value.id = parseInt(value.id);
                        value.user_id = parseInt(value.user_id);
                        value.cap_at_beg = parseInt(value.cap_at_beg);
                        value.cap_at_end = parseInt(value.cap_at_end);
                        value.level_at_beg = parseInt(value.level_at_beg);
                        value.assessment_score = parseInt(value.assessment_score);
                        value.cycle_start_time = new Date(parseInt(value.cycle_start_time)*1000);
                        value.cycle_end_time = new Date(parseInt(value.cycle_end_time)*1000);
                        value.level_start_time = new Date(parseInt(value.level_start_time)*1000);
                        value.level_end_time = new Date(parseInt(value.level_end_time)*1000);
                    });
                });
            }

            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function() {
                console.log('Page changed to: ' + $scope.currentPage);
            };

            $scope.setItemsPerPage = function(num) {
              $scope.itemsPerPage = num;
              $scope.currentPage = 1; //reset to first paghe
            }

            $scope.logout = function(){

                $location.path("/login");
            }
    }

})();

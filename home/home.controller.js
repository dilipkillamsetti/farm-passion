(function () {
    'use strict';

    angular
        .module('app')
        .directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', function($rootScope, $window, $timeout) {
    return {
      link: function(scope, elem, attrs) {
        var checkWhenEnabled, handler, scrollDistance, scrollEnabled;
        $window = angular.element($window);
       
        scrollDistance = 0;
        if (attrs.infiniteScrollDistance != null) {
          scope.$watch(attrs.infiniteScrollDistance, function(value) {
            return scrollDistance = parseInt(value, 10);
          });
        }
        scrollEnabled = true;
        checkWhenEnabled = false;
        if (attrs.infiniteScrollDisabled != null) {
          scope.$watch(attrs.infiniteScrollDisabled, function(value) {
            scrollEnabled = !value;
            if (scrollEnabled && checkWhenEnabled) {
              checkWhenEnabled = false;
              return handler();
            }
          });
        }
        handler = function() {
          var elementBottom, remaining, shouldScroll, windowBottom;
          windowBottom = $window.height() + $window.scrollTop();
          elementBottom = elem.offset().top + elem.height();
          remaining = elementBottom - windowBottom;
          shouldScroll = remaining <= $window.height() * scrollDistance;
          if (shouldScroll && scrollEnabled) {
            if ($rootScope.$$phase) {
              return scope.$eval(attrs.infiniteScroll);
            } else {
              return scope.$apply(attrs.infiniteScroll);
            }
          } else if (shouldScroll) {
            return checkWhenEnabled = true;
          }
        };
        $window.on('scroll', handler);
        scope.$on('$destroy', function() {
          return $window.off('scroll', handler);
        });
        return $timeout((function() {
          if (attrs.infiniteScrollImmediateCheck) {
            if (scope.$eval(attrs.infiniteScrollImmediateCheck)) {
              return handler();
            }
          } else {
            return handler();
          }
        }), 0);
      }
    };
  }
])
        .controller('HomeController', HomeController)
       

    HomeController.$inject = ['UserService', 'PagerService', '$rootScope', '$scope', '$http', '$log', '$location', '$state', '$uibModal'];
    function HomeController(UserService, PagerService, $rootScope, $scope, $http, $log, $location, $state, $uibModal, $ionicModal) {
        var vm = this;
        $scope.table1=false;
        $scope.table2=false;
        $scope.table3=false;
        $scope.table4=false;
        $scope.table5=false;
        $scope.table6=false;
        $scope.cropSelected="";
        $scope.actSelected="";
        $scope.leaderboard_cropSelected="";
        vm.user = null;
        vm.allUsers = [];
        vm.deleteUser = deleteUser;
        console.log(PagerService, " PagerService")      
        

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

        $scope.dashboardClick=function(){
            $state.go('home');
        };

        $scope.items = ['item1', 'item2', 'item3'];

        $scope.animationsEnabled = true;

        $scope.dashboard=function(){ 
            $scope.table1=false;
            $scope.table2=false;
            $scope.table3=false;
            $scope.table4=false;
            $scope.table5=false;
            $scope.table6=false;
            $scope.labels = ["Level1", "Level2", "Level3", "Level4", "Level5",
                             "Level6", "Level7", "Level8", "Level9", "Level10"]; 
            $scope.data = [vm.levelDetails(1), vm.levelDetails(2), vm.levelDetails(3), vm.levelDetails(4), vm.levelDetails(5),
                           vm.levelDetails(6), vm.levelDetails(7), vm.levelDetails(8), vm.levelDetails(9), vm.levelDetails(10)];
            $scope.labels1 = ['Last Day', 'Last Week', 'Last 15 Days', 'Last 1 Month', 'Last 6 Months'];
            $scope.series = ['No.of Active Users'];
            //var act=$scope.actSelected;

            var graph="graph"; //console.log(ActivityFactory.getActivityDetails('day', graph));
            $scope.data1 = [
                [vm.getActivityDetails('day', graph), vm.getActivityDetails('week', graph), vm.getActivityDetails('month', graph),  vm.getActivityDetails('tmonth', graph), vm.getActivityDetails('smonth', graph)]
            ];
        }

       $scope.openMultipleModals = function (a) {
    
var vb=this;
vb.ab=a;
    $uibModal.open({
     
      ariaLabelledBy: 'modal-title-top',
      ariaDescribedBy: 'modal-body-top',
      templateUrl: 'home/myModalContent.html',
      size: 'lg',
      controller: function($scope,fetobj,$uibModalInstance) {
         
         
          $scope.capitalr=fetobj;
           $scope.maxSize = 5;
            $scope.bigTotalItems = fetobj.length;
            $scope.bigCurrentPage = 1;
          $scope.ok = function () {
                $uibModalInstance.close();
            };

         $scope.Cancel = function () {
            $uibModalInstance.close();
            };
        $scope.more=function(){
           // alert('more');
        }
       $scope.pageChanged = function() {
    $log.log('Page changed to: ' + $scope.bigCurrentPage);
  };
      },
      resolve:{
          fetobj:function($http){
              return $http.get('http://192.168.1.123:8185/capital-backend/equipment.php?function=viewEquipmentbyid&user_id='+vb.ab).then(function(res){
                    return res.data;
              })


          }

      },
    controllerAs: vb,
    });
  };

 

$scope.dateChange=function(id){ console.log(id);
                                if(id=="1"){
                                    if($scope.from1!='' && $scope.to1!=''){
                                        $scope.open(false, false, false, false,false,$scope.from1, $scope.to1,false,'');
                                    }
                                }
                                if(id=="2"){
                                    if($scope.from2!='' && $scope.to2!=''){
                                        $scope.open(false, 'crop', false, false,false,$scope.from2, $scope.to2,false,'');
                                    }
                                }
                                if(id=="3"){
                                    if($scope.from3!='' && $scope.to3!=''){
                                        $scope.open(false, false, true, false,false,$scope.from3, $scope.to3,false,'');
                                    }
                                }
                                if(id=="4"){
                                    if($scope.from4!='' && $scope.to4!=''){
                                        $scope.open(false, false, false, 'Activity',false,$scope.from4, $scope.to4,false,'');
                                    }
                                }
                                if(id=="5"){
                                    if($scope.from5!='' && $scope.to5!=''){
                                        $scope.showEquipment($scope.from5, $scope.to5,false,'');
                                    }
                                }if(id=="6"){
                                    if($scope.from6!='' && $scope.to6!=''){
                                        $scope.open(false, false, false, false,'region',$scope.from6, $scope.to6,false,'');
                                    }
                                }

                                }
                                      
        $scope.leaderboard_cropwise = function(crop){
        console.log(crop,"Crop");
        url ="http://192.168.1.123:8185/capital-backend/leaderboard1.php?crop="+$scope.leaderboard_cropSelected;
        UserService.getRequest(url).then(function(response){
            console.log(response.data);
            $scope.capitals = response.data; 
            $scope.dummyItems = $scope.capitals // dummy array of items to be paged
            console.log($scope.dummyItems, " vm.dummyItems")
            $scope.pager = {};
            //$scope.setPage = $scope.setPage();               
            $scope.setPage(1);
            if($scope.capitals.length==0) $scope.empty=true;
                else $scope.empty=false;
             $scope.totalItems = $scope.capitals.length ; console.log($scope.capitals.length+"dcvhjdgf");  
             $scope.numPages = Math.ceil($scope.totalItems/$scope.itemsPerPage);   
             angular.forEach($scope.capitals,function(value,key){
                value.id = parseInt(value.id);
                value.user_id = parseInt(value.user_id);
                value.cap_at_beg = parseInt(value.cap_at_beg);
                value.cap_at_end = parseInt(value.cap_at_end);
                value.level_at_beg = parseInt(value.level_at_beg);
                value.cycle =  parseInt(value.cycle);
                value.assessment_score = parseInt(value.assessment_score);
                value.cycle_start_time = new Date(parseInt(value.cycle_start_time)*1000);
                value.cycle_end_time = new Date((value.cycle_end_time)*1000);
                value.level_start_time = new Date(parseInt(value.level_start_time)*1000);
                value.level_end_time = new Date(parseInt(value.level_end_time)*1000);
            });
            
        })

        }
        $scope.open = function (userId, crop, leaderboard, activity, region,from_dt,to_dt, exexl, expdf) {
            var url=""; 
            $scope.table1=false;
            $scope.table2=false;
            $scope.table3=false;
            $scope.table4=false;
            $scope.table5=false;
            $scope.table6=false;

            //console.log(crop,$scope.cropSelected);
            $scope.selectedUserID = userId;
            url = "http://192.168.1.123:8185/capital-backend/userlist.php?1=1";
            if($scope.cropSelected){ 
                console.log($scope.cropSelected,"is selected");
                url +="&crop="+$scope.cropSelected;
            }
            if(leaderboard){
                url ="http://192.168.1.123:8185/capital-backend/leaderboard.php?1=1&leaderboard="+1;
            }
            if(activity){
                var act=$scope.actSelected;
                url ="http://192.168.1.123:8185/capital-backend/activity.php?activity="+act;
            } 
            if(from_dt && to_dt){
                var from_date_str = new Date(from_dt);
                var to_date_str = new Date(to_dt);
                var from_date=from_date_str.getFullYear() +'-'+ Number(from_date_str.getMonth() + 1)+'-'+from_date_str.getDate() ;
                var to_date= to_date_str.getFullYear() + '-' + Number(to_date_str.getMonth() + 1) + '-' + to_date_str.getDate();
                url+="&from="+from_date+"&to="+to_date;
            }
            UserService.getRequest(url).then(function(response){
                $scope.capitals = response.data; console.log(url,$scope.capitals,response.data.length);
                $scope.dummyItems = $scope.capitals // dummy array of items to be paged
                console.log($scope.dummyItems, " vm.dummyItems")
                $scope.pager = {};
                //$scope.setPage = $scope.setPage();               
                $scope.setPage(1);

                if($scope.capitals.length==0) $scope.empty=true;
                else $scope.empty=false;
                $scope.totalItems = $scope.capitals.length ; console.log($scope.capitals.length+"dcvhjdgf");
                $scope.numPages = Math.ceil($scope.totalItems/$scope.itemsPerPage);
                if($scope.capitals.length>0){
                    angular.forEach($scope.capitals,function(value,key){
                        value.id = parseInt(value.id);
                        value.user_id = parseInt(value.user_id);
                        value.cap_at_beg = parseInt(value.cap_at_beg);
                        value.cap_at_end = parseInt(value.cap_at_end);
                        value.level_at_beg = parseInt(value.level_at_beg);
                        value.cycle =  parseInt(value.cycle);
                        value.assessment_score = parseInt(value.assessment_score);
                        value.cycle_start_time = new Date(parseInt(value.cycle_start_time)*1000);
                        value.cycle_end_time = new Date((value.cycle_end_time)*1000);
                        value.level_start_time = new Date(parseInt(value.level_start_time)*1000);
                        value.level_end_time = new Date(parseInt(value.level_end_time)*1000);
                    });

                    if(exexl){
                        var excel_data = [];
                        var temp = {}
                        for(var i=0;i<$scope.capitals.length;i++)
                        {
                            // temp.id = $scope.capitals[i].id;
                            temp.user_id = $scope.capitals[i].user_id;
                            temp.crop = $scope.capitals[i].crop;
                            temp.cycle = $scope.capitals[i].cycle;
                            temp.assessment_score = $scope.capitals[i].assessment_score;
                            temp.cap_at_beg = $scope.capitals[i].cap_at_beg;
                            temp.cap_at_end = $scope.capitals[i].cap_at_end;
                            temp.created_at = $scope.capitals[i].created_at;
                            temp.cycle_end_time = $scope.capitals[i].cycle_end_time;
                            temp.cycle_start_time = $scope.capitals[i].cycle_start_time;
                            temp.level_end_time = $scope.capitals[i].level_end_time;
                            temp.level_start_time = $scope.capitals[i].level_start_time;
                           
                            excel_data.push(temp);
                        }
                        console.log(excel_data,"excel_data")
                        var data = excel_data;
                        var opts = [{sheetid:'sheet1',header:true}];
                        var res = alasql('SELECT INTO XLSX("mahindra_report.xlsx",?) FROM ?',[opts,[data]]);
                    }
                    if(expdf!=''){
                        var funcStr = 'html'; //console.log(funcStr);
                        var doc = examples[funcStr](expdf);

                        doc.setProperties({
                            title: 'Example: ' + funcStr,
                            subject: 'A jspdf-autotable example pdf (' + funcStr + ')'
                        });
                        doc.save('table.pdf');
                    }
                }
            });
            if(!crop && !leaderboard && !activity && !region ){
                $scope.table1=true;
                $scope.cropSelected="";
            }
            if(crop){
                $scope.table2=true;
            }
            if(leaderboard){
                $scope.table3=true;
            }
            if(activity){
                $scope.table4=true;
            }
            if(region){
                $scope.table6=true;
            }
        };


        $scope.showEquipment = function (from_dt,to_dt, exexl, expdf) {
            var url="";
            $scope.table1=false;
            $scope.table2=false;
            $scope.table3=false;
            $scope.table4=false;
            $scope.table6=false;
            $scope.table5=true;

            url = "http://192.168.1.123:8185/capital-backend/equipment.php?function=viewEquipment";
            if(from_dt && to_dt){
                var from_date_str = new Date(from_dt);
                var to_date_str = new Date(to_dt);
                var from_date=from_date_str.getFullYear() +'-'+ Number(from_date_str.getMonth() + 1)+'-'+from_date_str.getDate() ;
                var to_date= to_date_str.getFullYear() + '-' + Number(to_date_str.getMonth() + 1) + '-' + to_date_str.getDate();
                url+="&from="+from_date+"&to="+to_date;
            }
            UserService.getRequest(url).then(function(response){
                $scope.capitals = response.data; //console.log($scope.capitals);
                $scope.dummyItems = $scope.capitals // dummy array of items to be paged
                console.log($scope.dummyItems, " vm.dummyItems")
                $scope.pager = {};
                //$scope.setPage = $scope.setPage();               
                $scope.setPage(1);

                if($scope.capitals.length==0) $scope.empty=true;
                else $scope.empty=false;
                $scope.totalItems = $scope.capitals.length; console.log($scope.capitals.length+"dcvhjdgf");
                $scope.numPages = Math.ceil($scope.totalItems/$scope.itemsPerPage);
                angular.forEach($scope.capitals,function(value,key){
                    value.id = parseInt(value.id);
                    value.user_id = parseInt(value.user_id);
                    value.create_date = new Date((value.create_date));
                    value.modified_date = new Date((value.modified_date));
                })
                if(exexl){
                    var data = $scope.capitals;
                    var opts = [{sheetid:'sheet1',header:true}];
                    var res = alasql('SELECT INTO XLSX("mahindra_report.xlsx",?) FROM ?',[opts,[data]]);
                }
                if(expdf!=''){
                    var funcStr = 'html'; //console.log(funcStr);
                    var doc = examples[funcStr](expdf);

                    doc.setProperties({
                        title: 'Example: ' + funcStr,
                        subject: 'A jspdf-autotable example pdf (' + funcStr + ')'
                    });
                    doc.save('table.pdf');
                }
            });

        };

        $scope.Details=function(a){
          var url="";
           //alert(a);
           console.log(a.user_id);
           $scope.openMultipleModals(a.user_id)

            // url = "http://192.168.1.123:8185/capital-backend/equipment.php?function=viewEquipmentbyid&user_id"+a.id;
           
            // UserService.getRequest(url).then(function(response){
            //     $scope.capitals4 = response.data; //console.log($scope.capitals);
            //     if($scope.capitals4.length==0) $scope.empty=true;
            //     else $scope.empty=false;
            //     $scope.totalItems = $scope.capitals.length; console.log($scope.capitals4.length+"dcvhjdgf");
            //     $scope.numPages = Math.ceil($scope.totalItems/$scope.itemsPerPage);
               
               
            // });

        }

        $scope.excel=function(from_dt,to_dt,table){
            var url="";
            url = "http://192.168.1.123:8185/capital-backend/userlist.php?1=1"; 
            var from_date_str = new Date(from_dt);
            var to_date_str = new Date(to_dt);
            var from_date=from_date_str.getFullYear() +'-'+ Number(from_date_str.getMonth() + 1)+'-'+from_date_str.getDate() ;
            var to_date= to_date_str.getFullYear() + '-' + Number(to_date_str.getMonth() + 1) + '-' + to_date_str.getDate();
            if(table=='table2'){ 
                url +="&crop="+$scope.cropSelected;
            }
            if(table=='table3'){
                url ="http://192.168.1.123:8185/capital-backend/leaderboard.php?1=1&leaderboard="+1;
            }
            if(table=='table4'){
                var act=$scope.actSelected;
                url ="http://192.168.1.123:8185/capital-backend/activity.php?activity="+act;
            }
            if(table=='table5'){
                url = "http://192.168.1.123:8185/capital-backend/equipment.php?function=viewEquipment";
            }
            url+="&from="+from_date+"&to="+to_date; console.log(url);
            UserService.getRequest(url).then(function(response){
                var data = response.data;
                var opts = [{sheetid:'sheet1',header:true}];
                var res = alasql('SELECT INTO XLSX("mahindra_report.xlsx",?) FROM ?',[opts,[data]]);
            });
        };

        $scope.pdf=function(id){
            var funcStr = 'html'; //console.log(funcStr);
            var doc = examples[funcStr](id);

            doc.setProperties({
                title: 'Example: ' + funcStr,
                subject: 'A jspdf-autotable example pdf (' + funcStr + ')'
            });
            doc.save('table.pdf');
        }


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
$scope.sort = function(data){
    console.log("Hiiii");
    $scope.orderByField = data;
    $scope.reverseSort = !$scope.reverseSort;
}
        $scope.orderByField = 'created_at';
        $scope.reverseSort = false;
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

        // $scope.setPage = function (pageNo) {
        //     $scope.currentPage = pageNo;
        // };

        $scope.setPage = function(page)  {
            if (page < 1 || page > $scope.pager.totalPages) {
                console.log(page, "geting pages...")
                return;
            }

            // get pager object from service
            console.log($scope.dummyItems.length," vm.dummyItems.length");
            console.log(PagerService, " PagerService")
            $scope.pager = PagerService.GetPager($scope.dummyItems.length, page);

            // get current page of items
            $scope.items = $scope.dummyItems.slice($scope.pager.startIndex, $scope.pager.endIndex + 1);
        }

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
        vm.getActivityDetails=function(act,graph){
            var url ="http://192.168.1.123:8185/capital-backend/activity.php?activity="+act+"&graph="+graph;
            //var a;
            UserService.getRequest(url).then(function(response){
                var a=response.data;
                localStorage.setItem(act, a);
            });
            return localStorage.getItem(act);
        };

        vm.levelDetails=function(level){
            var url ="http://192.168.1.123:8185/capital-backend/level.php?level="+level;
            //var a;
            UserService.getRequest(url).then(function(response){
                var a=response.data;
                console.log(response.data,"pie chart data")
                localStorage.setItem(level, a);
            });
            return localStorage.getItem(level);
        };


    }

})();

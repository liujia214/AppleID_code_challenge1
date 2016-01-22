/**
 * Created by allenbklj on 10/2/15.
 */
var myApp = angular.module('signUp',['ui.router'])
    .config(function($stateProvider,$urlRouterProvider){
        //$urlRouterProvider.otherwise('/');
        $stateProvider.state('register',{
            url:'/',
            templateUrl:'../register.html',
            controller:'registerController'
        }).state('success',{
            url:'/success',
            templateUrl:'../success.html',
            controller:'successController'
        })
    }).run(function($state){
        $state.go('register');
    });

//controller for registration
myApp.controller('registerController',function($scope,signService,$state){
    $scope.master = {};
    $scope.hide = true;

    //age must be not older than 150
    $scope.minAge = (function(){
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var minAge = currentYear - 150;
        return (new Date(minAge,currentDate.getMonth(),currentDate.getDate())).toISOString().substr(0,10);
    })();
    //age must be not younger than 14
    $scope.maxAge = (function(){
        var currentDate = new Date();
        var currentYear = currentDate.getFullYear();
        var minAge = currentYear - 14;
        return (new Date(minAge,currentDate.getMonth(),currentDate.getDate())).toISOString().substr(0,10);
    })();
    //submit form and check password
    $scope.submit = function(isValid){
        if(isValid){
            if(typeof $scope.user.password !='undefined' && $scope.user.confirmPassword === $scope.user.password){
                var date = $scope.user.birthday.toISOString().substr(0,10).split('-');
                $scope.user.birthday = new Date(date[0],date[1],date[2]);
                signService.post($scope.user).then(function(result){
                    signService.user = result.data;
                    $state.go('success');
                },function(error){
                    console.log(error);
                })
            }else{
                $scope.message = "password doesn't match";
                $scope.hide = false;
            }
        }
    };
    //clear all entered user data
    //$scope.reset = function(event,form){
    //  event.preventDefault();
    //
    //  if(confirm('are you sure to clear info?')){
    //      if(form){
    //          form.$setPristine();
    //          form.$setUntouched();
    //      }
    //      console.log($scope.user);
    //      $scope.user = angular.copy($scope.master);
    //      $scope.user.firstName = '';
    //      $scope.user.username = '';
    //      $scope.user.password = '';
    //      $scope.user.birthday = '';
    //      console.log($scope.user);
    //  }
    //};

    //open dialog function
    $scope.showDialog = function(e){
        e.preventDefault();
        document.getElementById('dialog').showModal();
    };
    //cancel and close dialog
    $scope.cancel = function(e){
        e.preventDefault();
        document.getElementById('dialog').close();
    };
    //confirm to clear information
    $scope.clear  = function(event,form){
        event.preventDefault();
        document.getElementById('dialog').close();
        console.log(form);
        if(form){
            form.$setPristine();
            form.$setUntouched();
        }
        console.log($scope.user);
        $scope.user = angular.copy($scope.master);
        $scope.user.firstName = '';
        $scope.user.username = '';
        $scope.user.password = '';
        $scope.user.birthday = '';
        console.log($scope.user);
    }
});

//controller for successful registration
myApp.controller('successController',function($scope,signService,$state){
    //if user has registered successfully, go to success page, otherwise go to register page
    if(signService.user){
        $scope.user = signService.user;
        $scope.user.birthday = $scope.user.birthday.substr(0,10);
        $scope.hiddenBio = true;
        $scope.showBio = true;
        $scope.hiddenInt = true;
        $scope.showInt = true;
        //if bio is filled, submit to server
        $scope.updateBio = function(){
            if(typeof $scope.bio !== 'undefined' && $scope.bio !== '' && $scope.bio !== null){
                $scope.user.bio = $scope.bio;
                signService.update($scope.user).then(function(response){
                    console.log(response.data);
                });
                $scope.showBio=false;$scope.hiddenBio = true;
            }else{
                $scope.messageBio = 'Enter Bio Please';
            }
        };
        //if interests are filled, submit to server
        $scope.updateInt = function(){
            if($scope.interests !== '' && $scope.interests !== null && typeof $scope.interests !== 'undefined'){
                $scope.user.interests = $scope.interests;
                signService.update($scope.user).then(function(response){
                    console.log(response);
                });
                $scope.showInt=false;$scope.hiddenInt = true;
            }else{
                $scope.messageInt = 'Enter Interests Please';
            }
        };
    }else{
        $state.go('register');
    }
});

//service to call request to server
myApp.factory('signService',function($http){
    var user = null;
   return{
       user:user,
       post:function(data){
            return  $http.post('/user',data);
       },
       update:function(data){
            return $http.put('/user',data);
       }
       //update:function(data){
       //    return $http.patch('/user/'+data.id,data);
       //}
   }
});
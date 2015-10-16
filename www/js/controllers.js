angular.module('starter.controllers', [])

.controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = {};

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function () {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function () {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function () {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function () {
            $scope.closeLogin();
        }, 1000);
    };
})

.controller('PostsCtrl', function ($scope) {
    var reddit = new Snoocore({
        userAgent: '/u/apollo959 ReadIt@0.0.1',
        throttle: 300,
        oauth: {
            type: 'implicit',
            key: '_sty7RuHMXLIfA',
            redirectUri: 'http://localhost:3000',
            scope: ['identity', 'read', 'vote']
        }
    });

    $scope.test = "Test String";

    reddit('/hot').listing().then(function (slice) {
        var postsArray = [];
        for (post of slice.children) {
            if (post.data.thumbnail === "self" || post.data.thumbnail === "") {
                delete post.data.thumbnail;
            }
            postsArray.push(post.data);
        }
        $scope.posts = postsArray;
        console.dir($scope.posts);
        $scope.nextPage = slice.next();
    });
})

.controller('PostCtrl', function ($scope, $stateParams) {});

var reddit = new Snoocore({
    userAgent: 'ReadIt@0.1.0',
    throttle: 300,
    oauth: {
        type: 'implicit',
        key: '_sty7RuHMXLIfA',
        redirectUri: 'http://localhost:3000',
        scope: ['identity', 'read', 'vote']
    }
});

function htmlDecode(input) {
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $state, $ionicHistory) {

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
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
            $scope.closeLogin();
        }, 1000);
    };

    $scope.menuSelection = function(name) {
        $ionicHistory.nextViewOptions({
          disableBack: true
        });
        switch (name) {
            case "frontpage":
                $scope.goToSubreddit("frontpage");
                break;
            case "subredditlist":
                $state.go("app.subreddits");
                break;
            case "multiredditlist":
                $state.go("app.multireddits");
                break;
            default:
        }
    };

    $scope.goToComments = function(url) {
        var ss = url.split("/");
        $state.go('app.comments', {
            subreddit: ss[2],
            id: ss[4],
            title: ss[5]
        });
    };

    $scope.goToSubreddit = function(name) {
        $state.go('app.listing', {
            subreddit: name,
            filter: 'hot'
        });
    };
})

.controller('ListingCtrl', function($scope, $stateParams) {
    var location = "";
    $scope.title = "";
    if ($stateParams.subreddit != 'frontpage') {
        location = '/r/' + $stateParams.subreddit;
        $scope.title = '/r/' + $stateParams.subreddit;
    } else {
        $scope.title = 'Front Page';
    }
    location = location + '/' + $stateParams.filter;

    reddit(location).listing().then(function(slice) {
        var postsArray = [];
        for (var post of slice.children) {
            if (post.data.thumbnail === "self" || post.data.thumbnail === "") {
                // delete post.data.thumbnail;
                post.data.thumbnail = "/img/ionic.png";
            }
            post.title = htmlDecode(post.title);
            postsArray.push(post.data);
        }
        $scope.posts = postsArray;
        $scope.nextPage = slice.next();
    });
})

.controller('CommentsCtrl', function($scope, $stateParams) {
    //If I am a self post, I need to display the text of the post
    $scope.title = "Comments";
    var parseComments = function(comments) {
        var list = document.createElement("ion-list");
        for (var comment of comments) {
            var item = document.createElement("div");
            var p = document.createElement("p");
            // p.className = "item";
            p.innerHTML = comment.data.body;
            item.className = "box";
            item.appendChild(p);
            if ("replies" in comment.data && comment.data.replies !== "") {
                item.appendChild(parseComments(comment.data.replies.data.children));
            }
            list.appendChild(item);
        }
        return list;
    };
    reddit("/r/" + $stateParams.subreddit + "/comments/" + $stateParams.id).get().then(function(slice) {
        var textpost = slice[0];
        var comments = slice[1];
        $scope.textpost = textpost.data.children[0].data;
        document.getElementById("comments").appendChild(parseComments(comments.data.children));
    });
})

.controller('SubredditCtrl', function($scope) {
    $scope.subreddits = [{
        "displayName": "AskReddit",
        "name": "askreddit"
    }];
});

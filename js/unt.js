var baseUrl = 'https://api.spotify.com/v1/search?type=track&query='

var myApp = angular.module('myApp', ['firebase'])


var myCtrl = myApp.controller('myCtrl', function($scope, $http, $firebaseAuth, $firebaseArray, $firebaseObject) {
  var ref = new Firebase("https://spotify343.firebaseio.com/");
    var userRef  = ref.child('user');
    var playlists  = ref.child('publicPlaylist');
    $scope.audioObject = {}
    $scope.users = $firebaseObject(userRef);//users
    $scope.playlist = $firebaseArray(playlists)//public playlist
    $scope.authObj = $firebaseAuth(ref);

  // Test if already logged in
  var authData = $scope.authObj.$getAuth();
  if (authData) {
    $scope.userId = authData.uid;
  } 

  // SignUp function
  $scope.signUp = function() {
    // Create user
    $scope.authObj.$createUser({
      email: $scope.email,
      password: $scope.password,      
    })

    // Once the user is created, call the logIn function
    .then($scope.logIn)

    // Once logged in, set and save the user data
    .then(function(authData) {
      $scope.userId = authData.uid;
      $scope.users[authData.uid] ={
        handle:$scope.handle
      }
      $scope.users.$save()
    })

    // Catch any errors
    .catch(function(error) {
      console.error("Error: ", error);
    });
  }

  // SignIn function
  $scope.signIn = function() {
    $scope.logIn().then(function(authData){
      $scope.userId = authData.uid;
    })
  }

  // LogIn function
  $scope.logIn = function() {
    return $scope.authObj.$authWithPassword({
      email: $scope.email,
      password: $scope.password
    })
  }

  // LogOut function
  $scope.logOut = function() {
    $scope.authObj.$unauth()
    $scope.userId = false
  }
  //end of auth

  //post: adds tack to playlist
  $scope.like =function(track){
        alert('Your track has been added');
        $scope.playlist.$add({track});
  }  

   //post: adds tack to playlist
  $scope.remove =function(track){
        $scope.playlist.$remove(track);
  } 

  //post: gets tracks
  $scope.getSongs = function() {
    $http.get(baseUrl + $scope.track).success(function(response){
      data = $scope.tracks = response.tracks.items
      
    })
  }
  $scope.play = function(song) {
    if($scope.currentSong == song) {
      $scope.audioObject.pause()
      $scope.currentSong = false
      return
    }
    else {
      if($scope.audioObject.pause != undefined) $scope.audioObject.pause()
      $scope.audioObject = new Audio(song);
      $scope.audioObject.play()  
      $scope.currentSong = song
    }
  }
});
angular.element(document).ready(function() {
      angular.bootstrap(document, ['myApp']);
});
// Add tool tips to anything with a title property
$('body').tooltip({
    selector: '[title]'
});

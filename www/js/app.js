// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','starter.services','starter.controllers','ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
  .state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl',
    abstract: true
  })
  .state('app.home', {
    url : '/home',
    views : {
      'menuContent' : {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })
  .state('app.browse', {
    url : '/browse',
    views : {
      'menuContent' : {
        templateUrl: 'templates/browse.html',
        controller: 'BrowseCtrl'
      }
    }
  })
  .state('app.categories', {
    url : '/categories',
    views : {
      'menuContent' : {
        templateUrl: 'templates/categories.html',
        controller: 'CategoriesCtrl'
      }
    }
  })
  .state('app.category', {
    url : '/categories/:categoryID',
    views : {
      'menuContent' : {
        templateUrl: 'templates/category.html',
        controller: 'CategoryCtrl'
      }
    }
  })
  .state('app.product', {
    url : '/product/:productID',
    views : {
      'menuContent' : {
        templateUrl: 'templates/product.html',
        controller: 'ProductCtrl'
      }
    }
  })
  .state('app.signup', {
    url : '/signup/',
    views : {
      'menuContent' : {
        templateUrl: 'templates/signup.html',
        controller: 'SignUpCtrl'
      }
    }
  })
  .state('app.login', {
    url : '/login/',
    views : {
      'menuContent' : {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      }
    }
  })
  .state('app.checkout', {
    url : '/checkout/',
    views : {
      'menuContent' : {
        templateUrl: 'templates/checkout.html',
        controller: 'CheckoutCtrl'
      }
    }
  });
  
  $urlRouterProvider.otherwise('/app/home');
})


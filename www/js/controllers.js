angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, WC, $localStorage, $rootScope, $ionicModal){
  
  
  $localStorage.cart = [];
  
  if($localStorage.cart)
    $rootScope.cartCount = $localStorage.cart.length;
  else
    $rootScope.cartCount = 0;
  
  var Woocommerce = WC.WC();
  
  Woocommerce.get('products/categories', function(err, data, res){
    //console.log(res);
    
    $scope.categories = (JSON.parse(res)).product_categories;
    
    $scope.mainCategories = [];
    $scope.categories.forEach(function(element, index){
      if(element.parent == 0)
        $scope.mainCategories.push(element);
    })
    
  })
  
  
  $scope.showCartModal = function(){
    
    $scope.cartItems = $localStorage.cart;
    
    if(!$scope.cartItems || $scope.cartItems.length == 0){
      console.log("no items in the cart!");
      alert("No items!");
      return;
    }
    
    $scope.costSum = 0;
    
    $scope.cartItems.forEach(function(element, index){
      $scope.costSum += Number(element.price);
    });
    
    $scope.costSum = $scope.costSum.toFixed(2);
    
    
    $scope.modal = {};
    
    $ionicModal.fromTemplateUrl('templates/cartModal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal){
      $scope.modal = modal;
      $scope.modal.show();
    });
    
    
  }
  
  
  
})

.controller('HomeCtrl', function(){
  
})

.controller('BrowseCtrl', function($scope, WC, $localStorage, $rootScope){
  
  $scope.offset = 0;
  
  $scope.getProducts = function(){
    var Woocommerce = WC.WC();
    
    Woocommerce.get('products', function(err, data, res){
      if(err)
        console.log(err);
        
      console.log(JSON.parse(res));
      
      JSON.parse(res).products.forEach(function(element, index){
        element.count = 0;
      })
      
      $scope.products = JSON.parse(res).products;
      $scope.offset = $scope.offset + 10;
      $scope.canLoadMore = true;
      $scope.$apply();
    })
  }
  
  $scope.getProducts();
    
  $scope.doRefresh = function(){
    $scope.getProducts();
    $scope.$broadcast('scroll.refreshComplete'); 
  }
  
  $scope.loadMore = function(){
    
    var Woocommerce = WC.WC();
    
    Woocommerce.get('products?filter[offset]='+$scope.offset, function(err, data, res){
      
      if(err)
        console.log(err);
        
      JSON.parse(res).products.forEach(function(element, index){
        element.count = 0;
        $scope.products.push(element);
        
      })
      
      $scope.$broadcast('scroll.infiniteScrollComplete');
      
      if(JSON.parse(res).products.length < 10){
        $scope.canLoadMore = false;
        console.log("no more products!");
        return;
      }
      else{
        $scope.offset = $scope.offset + 10;
      }
      
    })
    
  }
  
  
  $scope.addToCart = function(product){
    var countIncreased = false;
    $localStorage.cart.forEach(function(item, index){
      if(item.id == product.id && !countIncreased){
        console.log(item.id + " == " + product.id);
        item.count += 1;
        console.log("Count increased by 1");
        countIncreased = true;
      }
    });
    
    if(!countIncreased){
      product.count = 1;
      $localStorage.cart.push(product);
    }
    
    $rootScope.cartCount = $localStorage.cart.length;
    
  }
  
  
})

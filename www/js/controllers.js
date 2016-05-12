angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, WC){
  
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
  
})

.controller('HomeCtrl', function(){
  
})

.controller('BrowseCtrl', function($scope, WC){
  
  $scope.offset = 0;
  
  $scope.getProducts = function(){
    var Woocommerce = WC.WC();
    
    Woocommerce.get('products', function(err, data, res){
      if(err)
        console.log(err);
        
      console.log(JSON.parse(res));
      
      $scope.products = JSON.parse(res).products;
      $scope.offset = $scope.offset + 10;
      $scope.canLoadMore = true;
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
  
  
})

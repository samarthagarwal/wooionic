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
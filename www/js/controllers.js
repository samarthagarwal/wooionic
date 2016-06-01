angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, WC, $localStorage, $rootScope, $ionicModal, $state){
  
  $scope.$on('$ionicView.enter', function(e) {
    console.log("userData", $localStorage.userData);
    if($localStorage.userData){
      $rootScope.userData = $localStorage.userData
    }
  });
  
  $scope.logout = function(){
    $localStorage.userData = undefined;
    $rootScope.userData = undefined;
  }
  
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
  
  $scope.handleCheckout = function(){
      console.log("Handle Checkout Called!");
      $scope.modal.hide();
      if($localStorage.userData)
        $state.go("app.checkout")
      else
        $state.go("app.login")
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

.controller('CategoriesCtrl', function($scope, WC){
  
  var Woocommerce = WC.WC();
  
  Woocommerce.get('products/categories', function(err, data, res){
    if(err){
      console.log(err);
    }
    
    $scope.categories = (JSON.parse(res)).product_categories;
  })
  
})


.controller('CategoryCtrl', function(WC, $scope, $stateParams, $localStorage, $rootScope){
  
  console.log($stateParams.categoryID);
  
  var Woocommerce = WC.WC();
  
  Woocommerce.get('products?filter[category]='+$stateParams.categoryID, function(err, data, res){
    
    $scope.products =JSON.parse(res).products;
    $scope.$apply();
    $scope.products.forEach(function(element, index){
      element.count = 0;
    });
    
    $scope.addToCart = function(product){
      
      var countIncreased = false;
      $localStorage.cart.forEach(function(item, index){
        if(item.id == product.id && countIncreased){
          console.log(item.id + "==" + product.id);
          item.count += 1;
          console.log("count increased by 1 for " + item.title);
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
  
})

.controller('ProductCtrl', function($scope, WC, $stateParams, $ionicSlideBoxDelegate, $localStorage, $rootScope){
  
  var Woocommerce = WC.WC();
  
  Woocommerce.get('products/' + $stateParams.productID, function(err, data, res){
    if(err)
      console.log(err);
      
    $scope.product = JSON.parse(res).product;
    $scope.images = JSON.parse(res).product.images;
    console.log($scope.product);
    $scope.$apply();
    
    $ionicSlideBoxDelegate.update();
    $ionicSlideBoxDelegate.loop(true);
    
    
    Woocommerce.get('products/' + $stateParams.productID + '/reviews', function(error, dat, response){
      if(error)
        console.log(error);
        
      $scope.reviews = JSON.parse(response).product_reviews;  
      
    })
    
  })
  
  $scope.addToCart = function(product){
    var countIncreased = false;
    $localStorage.cart.forEach(function(item, index){
      if(item.id == product.id && !countIncreased){
        console.log(item.id + "==" + product.id);
        item.count += 1;
        console.log("count increased by 1 for " + item.title);
        countIncreased = true;    
      }
    });
    
    if(!countIncreased){
      product.count = 1;
      $localStorage.cart.push(product);
    }
    $rootScope.cartCount = $localStorage.cart.length;
  }
  1
  
})

.controller('SignUpCtrl', function($scope, $ionicPopup, $state, WC){
  
  $scope.newUser = {};
  $scope.newUser.isValid = true;
  
  $scope.checkUserEmail = function(email){
    
    var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    if(!regex.test(email)){
      
      $scope.newUser.isValid = false;
      
      $ionicPopup.show({
        template: "<center>Invalid Email! Please Check!</center>",
        buttons: [{
          text: 'OK'
        }]
      });
      
      return;
      
    }
    
    
    var Woocommerce = WC.WC();
    
    Woocommerce.get('customers/email/'+email,  function(err, data, res){
      
      if(err)
        console.log(err);
        
      if(JSON.parse(res).customer){
        
        $scope.newUser.isValid = false;
        
        $ionicPopup.show({
          template: "<center>EMail is already registered. Please login or use another email address.</center>",
          buttons: [{
            text: "Login",
            onTap: function(e){
              $state.go("app.login");
            }
          },{
            text: "OK"
          }]
        })
        
      }
      else{
        $scope.newUser.isValid = true;
      }
      
    })
    
  }
  
  
  $scope.switchBillingToShipping = function(){
    $scope.newUser.shipping_address = $scope.newUser.billing_address;
  }
  
  
  $scope.signUp = function(newUser){
    
    var customerData = {};
    
    customerData.customer = {
        "email": newUser.email,
        "first_name": newUser.first_name,
        "last_name": newUser.last_name,
        "username": newUser.email.split("@")[0],
        "password": newUser.password,
        "billing_address": {
          "first_name": newUser.first_name,
          "last_name": newUser.last_name,
          "company": "",
          "address_1": newUser.billing_address.address_1,
          "address_2": newUser.billing_address.address_2,
          "city": newUser.billing_address.city,
          "state": newUser.billing_address.state,
          "postcode": newUser.billing_address.postcode,
          "country": newUser.billing_address.country,
          "email": newUser.email,
          "phone": newUser.billing_address.phone
        },
        "shipping_address": {
          "first_name": newUser.first_name,
          "last_name": newUser.last_name,
          "company": "",
          "address_1": newUser.shipping_address.address_1,
          "address_2": newUser.shipping_address.address_2,
          "city": newUser.shipping_address.city,
          "state": newUser.shipping_address.state,
          "postcode": newUser.shipping_address.postcode,
          "country": newUser.shipping_address.country
        }
      }
    
    var Woocommerce = WC.WC();
    
    Woocommerce.post('customers', customerData, function(err, data, res){
      if(err)
        console.log(err);
        
      if(JSON.parse(res).customer){
        $ionicPopup.show({
          title: "Congratulations",
          template: "Your account has been created successfully. Please login.",
          buttons: [{
            text: "Login",
            type: "button-assertive",
            onTap: function(e){
              $state.go('app.login');
            }
          }]
        })
      }
      else{
        $ionicPopup.show({
          title: "OOPS",
          template: JSON.parse(res).errors[0].message,
          buttons: [{
            text: "OK",
            type: "button-assertive"
          }]
        })
      }
    });
    
  }
  
  
})

.controller('LoginCtrl', function($scope, $http, $localStorage, $ionicPopup, $state, WC, $ionicHistory){
  
  $scope.login = function(userData){
    
    $http.get('http://samarth.cloudapp.net/api/auth/generate_auth_cookie/?insecure=cool&username='+userData.username+'&password='+userData.password)
    .then(function(response){
      console.log(response);
      
      if(response.data.user){
        $localStorage.userData = response;
        $ionicPopup.show({
          title: 'Welcome ' + response.data.user.displayname,
          template: '<center>You have logged in successfully.</center>',
          buttons: [{
            text: 'OK',
            onTap: function(e){
              $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
              });
              $ionicHistory.clearHistory();
              $ionicHistory.clearCache();
              $state.go('app.home');
            }
          }]
        })
      }
      else{
        $ionicPopup.show({
          title: 'Something is wrong. Please Check.',
          template: '<center>Please check your username and password.</center>',
          buttons: [{
            text: 'Retry'
          }]
        })
      }
    });
    
  }
  
  
})

.controller('CheckoutCtrl', function($scope, $localStorage, $ionicPopup, $ionicHistory, WC, $state){
  
  $scope.newOrder = {};
  
  $scope.paymentMethods = [
      { method_id: "bacs", method_title: "Direct Bank Transfer"},
      { method_id: "cheque", method_title: "Cheque Payment"},
      { method_id: "cod", method_title: "Cash on Delivery"}];
  
  $scope.switchBillingToShipping = function(){
    console.log($scope.newOrder);
    $scope.newOrder.shipping = $scope.newOrder.billing;
  }
  
  
  $scope.placeOrder = function(newOrder){
    
    
    $scope.orderItems = [];
    
    if($localStorage.cart){
      $localStorage.cart.forEach(function(element, index){
        $scope.orderItems.push({product_id: element.id, quantity: element.count});
      });
      console.log($scope.orderItems);
    }
    else
    {
      console.log("No products added! Returning!");
      return;
    }
    
    var paymentData = {};

    $scope.paymentMethods.forEach(function(element, index){
      if(element.method_title == newOrder.paymentMethod){
        paymentData = element;
      }
    });
    
    
    var data = {
        payment_details: {
          method_id: paymentData.method_id,
          method_title: paymentData.method_title,
          paid: true
        },
        billing_address: {
          first_name: newOrder.billing.first_name,
          last_name: newOrder.billing.last_name,
          address_1: newOrder.billing.address_1,
          address_2: newOrder.billing.address_2,
          city: newOrder.billing.city,
          state: newOrder.billing.state,
          postcode: newOrder.billing.postcode,
          country: newOrder.billing.country,
          email: $localStorage.userData.data.user.email,
          phone: newOrder.billing.phone
        },
        shipping_address: {
          first_name: newOrder.shipping.first_name,
          last_name: newOrder.shipping.last_name,
          address_1: newOrder.shipping.address_1,
          address_2: newOrder.shipping.address_2,
          city: newOrder.shipping.city,
          state: newOrder.shipping.state,
          postcode: newOrder.shipping.postcode,
          country: newOrder.shipping.country
        },
        customer_id: $localStorage.userData.data.user.id || '',
        line_items: $scope.orderItems
      };
      
    var orderData = {};
    
    orderData.order = data;
    
    var Woocommerce = WC.WC();
    
    Woocommerce.post('orders', orderData, function(err, data, res){
      if(err)
        console.log(err);
        
      console.log(JSON.parse(res));
      if(JSON.parse(res).order){
        $ionicPopup.show({
          title: 'Congratulations',
          template: '<center>You order has been placed successfully. Your order number is ' + JSON.parse(res).order.order_number + '.</center>',
          buttons: [{
            text: 'OK',
            type: 'button-assertive',
            onTap: function(e){
              $localStorage.cart = undefined;
              $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
              });
              $ionicHistory.clearHistory();
              $ionicHistory.clearCache();
              $state.go('app.home');
            }
          }]
        })
      }
    });
    
  }
  
  
})
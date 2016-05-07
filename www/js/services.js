angular.module('starter.services',[])
.service('WC', function(){
    return {
        WC: function(){
            var Woocommerce = new WooCommerceAPI.WooCommerceAPI({
                url: 'http://samarth.cloudapp.net',
                consumerKey: 'ck_eb425c3f55f09555c61b5c49c19c40fe170cc761',
                consumerSecret: 'cs_6f94a916bc252630298c494eb6f9dc498d3406b4'
            });
            return Woocommerce;
        }
}});
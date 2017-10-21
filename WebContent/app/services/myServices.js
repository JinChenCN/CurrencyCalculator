myApp.factory('myFactory', function() {
        var service = {};//定义一个Object对象'
        service.name = "张三";
        var age;//定义一个私有化的变量
        //对私有属性写getter和setter方法
        service.setAge = function(newAge){
            age = newAge;
        }
        service.getAge = function(){
            return age; 
        }
        return service;//返回这个Object对象
    });
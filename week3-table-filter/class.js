;(function(){

    'use strict';
    
    var InheritUtil = (function() {
        // _compose 先调用超类方法，再调用子类方法
        var _compose = function(originalMethod, addMethod) {
            return function() {
                originalMethod.call(this);
                addMethod.call(this);
            };
        };
        // _extend 枚举 add 对象的属性，动态修改子类属性
        var _extend = function(origin, add) {
            for (var prop in add) {

                if (!!origin[prop] &&
                    typeof(origin[prop]) === 'function' &&
                    typeof(add[prop]) === 'function') {

                    var originalFunc = origin[prop];
                    origin[prop] = _compose(originalFunc, add[prop]);
                } else {
                    origin[prop] = add[prop];
                }
            }
        };
        return {
            extend: function(superClass, subClass) {
                // newSubClass 构造函数中调用超类、子类的构造函数，以添加 instanceVariable 属性
                var newSubClass = function(ins) {
                    superClass.call(this, ins);
                    subClass.call(this, ins);
                };
                // 合并类的属性，以填充新子类的属性
                _extend(newSubClass, superClass);
                _extend(newSubClass, subClass);
                _extend(newSubClass.prototype, superClass.prototype);
                _extend(newSubClass.prototype, subClass.prototype);
                return newSubClass;
            }
        };
    }());

    // 基类
    var Base = function(instanceVariable) {
        this.instanceVariable = instanceVariable;
    };
    
    Base.staticVariable = 'Base';
    
    Base.staticMethod = function() {
        console.log('This is from Base class static-method, static-variable is: ' + this.staticVariable);
    };
    
    Base.prototype.instanceMethod = function() {
        console.log('This is from Base class instance-method, static-variable is: ' + this.instanceVariable);
    };

    // 派生类
    var Derived = function(instanceVariable) {
        this.instanceVariable = instanceVariable;
    };
    
    Derived.staticVariable = 'Derived';
    
    Derived.staticMethod = function() {
        console.log('This is from Derived class static-method, static-variable is: ' + this.staticVariable);
    };
    
    Derived.prototype.instanceMethod = function() {
        console.log('This is from Derived class instance-method, static-variable is: ' + this.instanceVariable);
    };


    Derived = InheritUtil.extend(Base, Derived);

    var Test = {
        test1: function() {
            var example = new Derived('example');
            Derived.staticMethod();
            example.instanceMethod();
        },
        test2: function() {
            var example = new Derived('example');
            var otherExample = new Derived('other-example');
            example.instanceMethod();
            otherExample.instanceMethod();
        }
    };

    Test.test1();
    console.log();
    Test.test2();
    
    // OUTPUT:
    // This is from Base class static-method, static-variable is: Derived
    // This is from Derived class static-method, static-variable is: Derived
    // This is from Base class instance-method, static-variable is: example
    // This is from Derived class instance-method, static-variable is: example
    //
    // This is from Base class instance-method, static-variable is: example
    // This is from Derived class instance-method, static-variable is: example
    // This is from Base class instance-method, static-variable is: other-example
    // This is from Derived class instance-method, static-variable is: other-example
}());

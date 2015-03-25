;(function(window, undefined){

    'use strict';

    var Util = {
        addHandler: function(ele, type, handler) {
            if (ele.addEventListener) {
                ele.addEventListener(type, handler, false);
            } else if (ele.attachEvent) {
                ele.attachEvent('on'+type, handler);
            } else {
                ele['on'+type] = handler;
            }
        },

        hasClass: function(ele, cl) {
            return ele.className.indexOf(cl) === -1 ? false : true;
        },

        removeClass: function(ele, cl) {
            ele.className = this.hasClass(ele, cl) ? ele.className.replace(cl, '') : ele.className;
        },

        addClass: function(ele, cl) {
            ele.className = this.hasClass(ele, cl) ? ele.className : ele.className + ' ' + cl;
        }
    };    

    var CircleMenu = function(options) {
        this.LETTERS = ['A', 'B', 'C', 'D', 'E'];
        this.numList = [0, 1, 2, 3, 4];
        this.options = options;
        this.btns = [];
        // 将 btn 本身、小红点、btn 的文本保存为数组中的对象
        for (var i = 0, len = this.options.btns.length; i < len; i++) {
            this.btns.push({
                btn: this.options.btns[i],
                redDot: this.options.btns[i].getElementsByTagName('span')[0],
                text: this.options.btns[i].getElementsByTagName('h3')[0]
            });
        }
    };

    CircleMenu.prototype = {
        constructor: CircleMenu,

        init: function() {
            Util.addClass(this.options.bubble, 'disabled');
            this.addListener();
        },

        addListener: function() {
            var self = this;
            
            for (var i = 0, len = this.btns.length; i < len; i++) {
                Util.addHandler(this.btns[i].btn, 'click', this.clickToGetNum(i));
            }
            Util.addHandler(this.options.container, 'mouseleave', this.resetAll());
            Util.addHandler(this.options.bubble, 'click', this.clickToSum());
            
            // 'oneByOne' 一指禅， 'together' 五指齐按， 'random' 随机
            if (this.options.type === 'oneByOne') {
                // clickByOrder 的参数为点击顺序
                Util.addHandler(this.options.midBtn, 'click', this.clickByOrder('0,1,2,3,4'));
            } else if (this.options.type === 'together') {
                Util.addHandler(this.options.midBtn, 'click', this.clickByOrder('0,1,2,3,4', function(){
                    for (var i = 0, len = self.options.btns.length; i < len; i++) {
                        self.btns[i].text.textContent = '...';
                    }
                }));
            } else if (this.options.type === 'random') {
                Util.addHandler(this.options.midBtn, 'click', this.clickByOrder(this.getRandomOrder()));
            }
        },

        resetAll: function() {
            var self = this;
            return function() {

                self.options.bubble.textContent = '';

                for (var i = 0, len = self.btns.length; i < len; i++) {
                    Util.removeClass(self.btns[i].btn, 'disabled');
                    Util.removeClass(self.btns[i].redDot, 'visible');
                }
                // 随机模式下，顺序应该更新
                if (self.options.type === 'random') {
                    self.order = self.getRandomOrder().split(',');
                }
            };
        },

        clickToSum: function() {
            var self = this;
            return function() {
                var sum = 0;
                for (var i = 0, len = self.btns.length; i < len; i++) {
                    // 如果还有 btn 可以点击，那么不能求和，函数返回
                    if (!Util.hasClass(self.btns[i].btn, 'disabled')) {
                        return;
                    }
                    var num = self.btns[i].redDot.textContent;
                    sum += (+num);
                }
                self.options.bubble.innerHTML = sum + '<br>';
                // 显示随机的顺序
                if (self.options.type === 'random') {
                    var orderStr = [];
                    for (var j = 0, orderLen = self.order.length; j < orderLen; j++) {
                        orderStr.push(self.LETTERS[+self.order[j]]);
                    }
                    self.options.bubble.innerHTML += orderStr.join(',');
                }
            };
        },

        clickToGetNum: function(i) {
            var self = this;
            var args = Array.prototype.slice.call(arguments, 1);
            return function() {
                var that = self.btns[i].btn,
                    text = self.btns[i].text,
                    redDot = self.btns[i].redDot;

                if (!self.checkDisabled(that)) {
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4) {
                            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {

                                Util.addClass(redDot, 'visible');
                                redDot.textContent = xhr.responseText;
                                text.textContent = self.LETTERS[i];
                                Util.addClass(that, 'disabled');
                                self.enableOthers(i);
                                // 如果有第二个参数，那么执行自动点击下一个，如果参数为 4，说明可以求和
                                if (args.length && args[0] < 4) {
                                    self.clickToGetNum(+self.order[args[0]+1], args[0]+1)();
                                } else if (args[0] === 4) {
                                    self.clickToSum()();
                                }

                            } else {
                                alert('Request was unsuccessful: ' + xhr.status);
                            }
                        }
                    };
                    xhr.open('get', '/', true);
                    xhr.send(null);
                    self.disableOthers(i);
                    text.textContent = '...';
                }
            };
        },

        disableOthers: function(idx) {
            for (var i = 0, len = this.btns.length; i < len; i++) {
                if (i !== idx) {
                    Util.addClass(this.btns[i].btn, 'disabled');
                }
            }
        },

        enableOthers: function(idx) {
            for (var i = 0, len = this.btns.length; i < len; i++) {
                // 已有小红点不能再次点击
                if (i !== idx && !Util.hasClass(this.btns[i].redDot, 'visible')) { 
                    Util.removeClass(this.btns[i].btn, 'disabled');
                }
            }
        },
        // 判断是否可以发送 AJAX 请求
        checkDisabled: function(ele) {
            return Util.hasClass(ele, 'disabled');
        },

        clickByOrder: function(str) {
            var self = this,
                args = Array.prototype.slice.call(arguments, 1);
            
            self.order = str.split(',');
            
            return function() {
                if (args.length) {
                    args[0]();
                }
                self.clickToGetNum(+self.order[0], 0)();
            };
        },

        getRandomOrder: function() {
            this.numList.sort(function(a, b) {
                return Math.random() > 0.5 ? -1 : 1;
            });
            return this.numList.join(',');
        }
    };

    window.onload = function() {
        var container = document.getElementById('at-plus-container');
        var btns = document.getElementById('control-ring').getElementsByTagName('li');
        var bubble = document.getElementById('info-bar').getElementsByTagName('div')[0];
        var midBtn = container.getElementsByClassName('icon')[0];
        // bubble 大气泡, btns 环形按钮, container hover区域, midBtn @+按钮, type 指明绑定事件
        var cm = new CircleMenu({
            btns: btns,
            bubble: bubble,
            container: container,
            midBtn: midBtn,
            type: 'random'
        });
        cm.init();
    };   
}(window));
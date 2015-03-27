;(function(window, undefined) {

'use strict';

 var Util = (function(){
    var _inherit = function(p) {
        function F() {}
        F.prototype = p;
        return new F();
    };
    return {
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
        removeClass: function(ele) {
            var cls = Array.prototype.slice.call(arguments, 1);
            for (var i in cls) {
                ele.className = this.hasClass(ele, cls[i]) ? ele.className.replace(cls[i], '') : ele.className;
            }
        },
        addClass: function(ele, cl) {
            ele.className = this.hasClass(ele, cl) ? ele.className : ele.className + ' ' + cl;
        },

        getResponseText: function(url, callback) {
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.onreadystatechange = function() {
                if (request.readyState === 4 && request.status === 200) {
                    var text = request.responseText;
                    callback(text);
                }
            };
            request.send(null);
            return request;
        }
    };
}());


var CircleMenu = function(opts) {
    this.smallBtns = []; // 环形菜单的每个小按钮
    for (var i = 0, len = opts.smallBtns.length; i < len; i++) {
        this.smallBtns.push({
            btn: opts.smallBtns[i], // 按钮本身
            red: opts.smallBtns[i].getElementsByTagName('span')[0] // 按钮的小红点
        });
    }

    this.bigBtn = opts.bigBtn; // 显示求和结果的大按钮
    this.menu = opts.menu;
    this.mainBtn = opts.mainBtn;
};

CircleMenu.prototype = {
    constructor: CircleMenu,
    addListener: function() {
        // 灭活大按钮
        this.order = [0, 1, 2, 3, 4];
        Util.addClass(this.bigBtn, 'disabled');
        Util.addHandler(this.mainBtn, 'click', this.clickTogether(this.order));

        Util.addHandler(this.menu, 'mouseleave', this.reset());
    },
    
    clickToGetNumber: function(i) {
        var self = this;
        var idx = +arguments[1];
        return function() {
            console.log(self.order);
            if (!self.checkClickable(self.smallBtns[i].btn)) {
                return;
            }
            // 允许点击则发送请求
            self.XHR = Util.getResponseText('/', function(text) {
                self.smallBtns[i].red.textContent = text;
                Util.addClass(self.smallBtns[i].btn, 'js-clicked');
                self.enableOtherBtns(i);
                self.checkBigBtnClickable();
                if (idx === 4) {
                    self.timer = setTimeout(function() {
                        self.clickToGetSum()();
                    }, 1000);
                } else {
                    self.clickToGetNumber(+self.order[idx+1], idx+1)();
                }
            });
            self.disableOtherBtns(i);
        };
    },

    clickToGetSum: function() {
        var self = this;
        return function() {
            if (!self.checkClickable(self.bigBtn)) {
                return;
            }
        
            var sum = 0;
            for (var i in self.smallBtns) {
                sum += (+self.smallBtns[i].red.textContent);
            }
            self.bigBtn.textContent = sum;
            Util.addClass(self.bigBtn, 'js-clicked');
        };
    },

    checkClickable: function(ele) {
        return !(Util.hasClass(ele, 'disabled')) && !(Util.hasClass(ele, 'js-clicked'));
    },

    disableBtn: function(ele) {
        Util.addClass(ele, 'disabled');
    },

    enableBtn: function(ele) {
        Util.removeClass(ele, 'disabled');
    },

    disableOtherBtns: function(idx) {
        for (var i in this.smallBtns) {
            if (i === idx) {
                continue;
            }
            this.disableBtn(this.smallBtns[i].btn);
        }
    },

    enableOtherBtns: function(idx) {
        for (var i in this.smallBtns) {
            if (i === idx || Util.hasClass(this.smallBtns[i].btn, 'js-clicked')) {
                continue;
            }
            this.enableBtn(this.smallBtns[i].btn);
        }
    },

    checkBigBtnClickable: function() {
        for (var i in this.smallBtns) {
            if (!Util.hasClass(this.smallBtns[i].btn, 'js-clicked')) {
                return;
            }
        }
        this.enableBtn(this.bigBtn);
    },

    reset: function() {
        var self = this;
        return function() {
            if (self.XHR) {
                self.XHR.abort();
            }
            if (self.timer) {
                clearTimeout(self.timer);
            }
            for (var i in self.smallBtns) {
                Util.removeClass(self.smallBtns[i].red, 'visible');
                Util.removeClass(self.smallBtns[i].btn, 'disabled', 'js-clicked');
            }
            Util.removeClass(self.bigBtn, 'js-clicked');
            Util.addClass(self.bigBtn, 'disabled');
            self.bigBtn.textContent = '';
        };
    },

    clickTogether: function() {
        var self = this;
        return function() {
            for (var i in self.smallBtns) {
                self.smallBtns[i].red.textContent = '...';
                Util.addClass(self.smallBtns[i].red, 'visible');
            }
            self.clickToGetNumber(+self.order[0], 0)();
        };
    }
};

window.onload = function() {
    var cm = new CircleMenu({
        smallBtns: document.getElementById('control-ring').getElementsByTagName('li'),
        bigBtn: document.getElementById('info-bar').getElementsByTagName('div')[0],
        menu: document.getElementById('at-plus-container'),
        mainBtn: document.getElementsByClassName('apb')[0]
    });
    cm.addListener();
};

}(window));

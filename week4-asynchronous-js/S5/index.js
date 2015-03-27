;(function(window, undefined){

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

function disableOtherBtns(idx) {
    var btn = document.getElementById('control-ring').getElementsByTagName('li');
    for (var i = 0, len = btn.length; i < len; i++) {
        if (i !== idx) {
            Util.addClass(btn[i], 'disabled');
        }
    }
}

function enableOtherBtns(idx) {
    var btn = document.getElementById('control-ring').getElementsByTagName('li');
    for (var i = 0, len = btn.length; i < len; i++) {
        if (i !== idx || !Util.hasClass(btn[i], 'js-clicked')) {
            Util.removeClass(btn[i], 'disabled');
        }
    }
}

function aHandler(callback) {
    var aBtn = document.getElementById('control-ring').getElementsByTagName('li')[0];
    var aRed = aBtn.getElementsByTagName('span')[0];
    if (Math.random() > 0.5) {
        console.log('A Failed!!');
        return {'msg': '这是个地小的秘密'};
    }
    Util.getResponseText('/', function(text) {
        aRed.textContent = text;
        enableOtherBtns(0);
        Util.addClass(aBtn, 'js-clicked');
        callback(text, '这是个天大的秘密');
    });
    aRed.textContent = '...';
    disableOtherBtns(0);
    Util.addClass(aRed, 'visible');
}
function bHandler(callback) {
    var bBtn = document.getElementById('control-ring').getElementsByTagName('li')[1];
    var bRed = bBtn.getElementsByTagName('span')[0];
    if (Math.random() > 0.5) {
        console.log('B Failed!!');
        return {'msg': '我知道'};
    }
    Util.getResponseText('/', function(text) {
        bRed.textContent = text;
        enableOtherBtns(1);
        Util.addClass(bBtn, 'js-clicked');
        callback(text, '我不知道');
    });
    bRed.textContent = '...';
    disableOtherBtns(1);
    Util.addClass(bRed, 'visible');
}
function cHandler(callback) {
    var cBtn = document.getElementById('control-ring').getElementsByTagName('li')[2];
    var cRed = cBtn.getElementsByTagName('span')[0];
    if (Math.random() > 0.5) {
        console.log('C Failed!!');
        return {'msg': '你知道'};
    }
    Util.getResponseText('/', function(text) {
        cRed.textContent = text;
        enableOtherBtns(2);
        Util.addClass(cBtn, 'js-clicked');
        callback(text, '你不知道');
    });
    cRed.textContent = '...';
    disableOtherBtns(2);
    Util.addClass(cRed, 'visible');
}
function dHandler(callback) {
    var dBtn = document.getElementById('control-ring').getElementsByTagName('li')[3];
    var dRed = dBtn.getElementsByTagName('span')[0];
    if (Math.random() > 0.5) {
        console.log('D Failed!!');
        return {'msg': '他知道'};
    }
    Util.getResponseText('/', function(text) {
        dRed.textContent = text;
        enableOtherBtns(3);
        Util.addClass(dBtn, 'js-clicked');
        callback(text, '他不知道');
    });
    dRed.textContent = '...';
    disableOtherBtns(3);
    Util.addClass(dRed, 'visible');
}
function eHandler(callback) {
    var eBtn = document.getElementById('control-ring').getElementsByTagName('li')[4];
    var eRed = eBtn.getElementsByTagName('span')[0];
    if (Math.random() > 0.5) {
        console.log('E Failed!!');
        return {'msg': '不怪'};
    }
    Util.getResponseText('/', function(text) {
        eRed.textContent = text;
        enableOtherBtns(4);
        Util.addClass(eBtn, 'js-clicked');
        callback(text, '才怪');
    });
    eRed.textContent = '...';
    disableOtherBtns(4);
    Util.addClass(eRed, 'visible');
}

function getRandomOrder() {
    var numbers = [0, 1, 2, 3, 4];
    numbers.sort(function(a, b) {
        return Math.random() > 0.5 ? -1 : 1;
    });
    return numbers;
}

function reset() {
    var btns = document.getElementById('control-ring').getElementsByTagName('li');
    for (var i = 0, len = btns.length; i < len; i++) {
        Util.removeClass(btns[i].getElementsByTagName('span')[0], 'visible');
        Util.removeClass(btns[i], 'disabled', 'js-clicked');
    }
    var bigBtn = document.getElementById('info-bar').getElementsByTagName('div')[0];
    bigBtn.textContent = '';
}

function bubbleHandler(sum) {
    var bigBtn = document.getElementById('info-bar').getElementsByTagName('div')[0];
    bigBtn.innerHTML = '楼主异步调用战斗力感人，目测不超过 ' + sum;
}




function newFn(handlers, order, idx, currentSum, ss) {
    var LTS = 'ABCDE';
    var res = handlers[order[idx]](function(text, saying) {
        var number = +text;
        if (idx === 4) {
            bubbleHandler(currentSum);
        } else {
            var result = newFn(handlers, order, idx+1, currentSum + number, saying);
            var number = +text;
            var bigBtn = document.getElementById('info-bar').getElementsByTagName('div')[0];
            bigBtn.textContent = currentSum + number;
            bigBtn.innerHTML += '<br>' + saying;
            if (typeof(result) === 'object') {
                bigBtn.textContent = currentSum + number;
                bigBtn.innerHTML += '<br>' + result.msg;
            }
        }
    });
    if (typeof(res) === 'object') return res;
}

window.onload = function() {
    var midBtn = document.getElementsByClassName('apb')[0];
    var area = document.getElementById('at-plus-container');
    var bigBtn = document.getElementById('info-bar').getElementsByTagName('div')[0];

    Util.addClass(bigBtn, 'disabled');
    var handlers = [aHandler, bHandler, cHandler, dHandler, eHandler];
    Util.addHandler(midBtn, 'click', function() {
        var order = getRandomOrder();
        console.log(order);
        newFn(handlers, order, 0, 0);
    });
    Util.addHandler(area, 'mouseleave', reset);
};

}(window));
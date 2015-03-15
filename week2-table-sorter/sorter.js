;(function(window, undefined) {

    'use strict';
    
    /**
     * @brief Util
     * @details Some useful functions.
     * 
     * @method  hasClass, removeClass, addClass 操作样式
     * @method  addHanlder 跨浏览器事件处理
     */

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
            ele.className = this.hasClass(ele, cl) ? cl : ele.className + ' ' + cl;
        }
    };

    /**
     * @brief TableSorter can be use to make table elements be sortable.
     * @details 对具有表头thead的表格适用
     * 
     * @param  options {Object} 相关配置
     * 
     * @method  init 初始化函数，添加必要私有成员
     * @method  reset 去除表头添加的样式
     * @method  listen 为表头每一个单元格添加事件监听器
     * @method  sort 对tBody每一行排序
     * @method  compareFunc 比较函数，当单元格内容为数字时不应为字典序
     */

    var TableSorter = function(options) {
        this.options = options;
    };

    TableSorter.prototype = {
        constructor: TableSorter,

        init: function() {
            this.tbody = this.options.table.tBodies[0];
            this.tr = this.options.table.tBodies[0].rows;
            this.ths = this.options.table.tHead.rows[0].cells;
            this.trs = Array.prototype.slice.call(this.tr, 0);
            this.compareFunc = this.compareFunc || this.options.compareFunc;
            this.listen();
        },

        reset: function(arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                Util.removeClass(arr[i], this.options.ascendClass);
                Util.removeClass(arr[i], this.options.descendClass);
            }
            return this;
        },

        listen: function() {
            var self = this;
            var clickToSort = function(idx) {
                return function() {
                    if (Util.hasClass(this, self.options.ascendClass)) {
                        self.reset(self.ths).sort(idx, 'des');
                        Util.addClass(this, self.options.descendClass);
                    } else if (Util.hasClass(this, self.options.descendClass)) {
                        self.reset(self.ths);
                    } else {
                        self.reset(self.ths).sort(idx, 'asc');
                        Util.addClass(this, self.options.ascendClass);
                    }
                };
            };

            for (var i = 0, len = this.ths.length; i < len; i++) {
                Util.addHandler(self.ths[i], 'click', clickToSort(i));
            }
        },

        sort: function(criteria, type) {
            var newTbody = document.createElement('tbody');

            if (type === 'asc') {
                this.trs.sort(this.compareFunc(criteria));
            } else {
                this.trs.reverse();
            }

            for (var i in this.trs) {
                newTbody.appendChild(this.trs[i]);
            }

            this.options.table.replaceChild(newTbody, this.tbody);
            this.tbody = newTbody;

            return this;
        },

        compareFunc: function(criteria) {
            return function(x, y) {
                var x1 = x.cells[criteria].textContent || x.cells[criteria].innerHTML,
                    y1 = y.cells[criteria].textContent || y.cells[criteria].innerHTML;
                return isNaN(x1) ? x1.localeCompare(y1) : x1 - y1;
            };
        }
    };

    var getAllTables = function() {
        return document.getElementsByTagName('table');
    };

    var makeAllTableSortable = function(tables) {
        for (var i = 0, len = tables.length; i < len; i++) {
            var tb = new TableSorter({
                table: tables[i],
                ascendClass: 'ascend',
                descendClass: 'descend'
            });
            tb.init();
        }
    };

    window.onload = function() {
        var tables = getAllTables();
        makeAllTableSortable(tables);
    };

}(window));

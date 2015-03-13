;(function() {

    'use strict'

    /**
     * @brief TableSorter can be use to make table elements be sortable.
     * @details 对具有表头thead的表格适用
     * 
     * @param  options {object} 相关配置
     * 
     * @method  hasClass, removeClass, addClass 操作样式
     * @method  reset 去除表头添加的样式
     * @method  listen 为表头每一个单元格添加事件监听器
     * @method  sort 对tBody每一行排序
     * @method  compareFunc 比较函数，当单元格内容为数字时不应为字典序
     */

    var TableSorter = function(options) {
        this.options = options;
        this.tbody = this.options.table.tBodies[0];
        this.tr = this.options.table.tBodies[0].rows;
        this.ths = this.options.table.tHead.rows[0].cells;
        this.compareFunc = this.compareFunc || this.options.compareFunc;
        this.trs = [];
        for (var i = 0, len = this.tr.length; i < len; i++) {
            this.trs.push(this.tr[i]);
        }
        this.listen();
    };

    TableSorter.prototype = {
        constructor: TableSorter,
        
        hasClass: function(ele, cl) {
            return ele.className.indexOf(cl) === -1 ? false : true;
        },

        removeClass: function(ele, cl) {
            ele.className = this.hasClass(ele, cl) ? ele.className.replace(cl, '') : ele.className;
        },

        addClass: function(ele, cl) {
            ele.className = this.hasClass(ele, cl) ? ele.className + ' ' + cl : cl;
        },

        reset: function(arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                this.removeClass(arr[i], this.options.ascendClass);
                this.removeClass(arr[i], this.options.descendClass);
            }
        },

        listen: function() {
            var self = this;
            var clickToSort = function(idx) {
                return function() {
                    if (self.hasClass(this, self.options.ascendClass)) {
                        self.reset(self.ths);
                        self.addClass(this, self.options.descendClass);
                        self.sort(idx, 'des');
                    } else if (self.hasClass(this, self.options.descendClass)) {
                        self.reset(self.ths);
                    } else {
                        self.reset(self.ths);
                        self.addClass(this, self.options.ascendClass);
                        self.sort(idx, 'asc');
                    }
                };
            };

            for (var i = 0, len = this.ths.length; i < len; i++) {
                self.ths[i].addEventListener('click', clickToSort(i), false);
            }
        },

        sort: function(criteria, type) {
            var rowCount = this.options.table.rows.length,
                table = this.options.table,
                newTbody = document.createElement('tbody');

            this.trs.sort(this.compareFunc(criteria, type));
            for (var i = 0, len = this.trs.length; i < len; i++) {
                newTbody.appendChild(this.trs[i]);
            }
            this.options.table.replaceChild(newTbody, this.tbody);
            this.tbody = newTbody;
        },

        compareFunc: function(criteria, type) {
            return function(x, y) {
                var x1 = x.cells[criteria].textContent || x.cells[criteria].innerHTML,
                    y1 = y.cells[criteria].textContent || y.cells[criteria].innerHTML;
                
                if (!isNaN(x1)) {
                    return type === 'asc' ? x1 - y1 : y1 - x1;
                } else {
                    var resArr = type === 'asc' ? [1, -1, 0] : [-1, 1, 0];
                    if (x1 > y1) {
                        return resArr[0];
                    } else if (x1 < y1) {
                        return resArr[1];
                    } else {
                        return resArr[2];
                    }
                }
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
        }
    };

    window.onload = function() {
        var tables = getAllTables();
        makeAllTableSortable(tables);
    };

})();

;(function(window, undefined) {

    'use strict';
    
    /**
     * @brief Util
     * @details Some useful functions.
     * 
     * @method  hasClass, removeClass, addClass 操作样式
     * @method  addHanlder 跨浏览器事件处理
     */

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

            removeClass: function(ele, cl) {
                ele.className = this.hasClass(ele, cl) ? ele.className.replace(cl, '') : ele.className;
            },

            addClass: function(ele, cl) {
                ele.className = this.hasClass(ele, cl) ? cl : ele.className + ' ' + cl;
            },

            inherit: function(sub, sup) {
                var prot = _inherit(sup.prototype);
                prot.constructor = sub;
                sub.prototype = prot;
            }
        };
    }());

    /**
     * @brief TableSorter can be use to make table elements be sortable.
     * @details 对具有表头thead的表格适用
     * 
     * @param  options {Object} 相关配置
     * 
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
            return this;
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
            self.compareFunc = self.compareFunc || self.options.compareFunc;
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
            return self;
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
            this.tr = this.tbody.rows;

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

    /**
     * @brief TableFilter
     * @details 对具有表头thead的表格适用
     * 
     * @param  options {Object} 相关配置
     * 
     * @method  filterReset 隐藏所有行
     * @method  addFilter 为输入框添加事件监听器
     * @method  filterHandler 筛选关键词
     */

    var TableFilter = function(options) {
        TableSorter.call(this, options);
        TableSorter.prototype.init.call(this);
    };

    TableFilter.prototype.filterReset = function() {
        for (var i = 0, len = this.tr.length; i < len; i++) {
            Util.addClass(this.tr[i], 'hidden');
        }
    };

    TableFilter.prototype.filterHandler = function() {
        var self = this;
        return function(e) {
            self.tr = self.options.table.tBodies[0].rows;
            var event = e || window.event,
                target = e.target || e.srcElement,
                keyword = target.value;

            self.filterReset();
            for (var i = 0, rowLen = self.tr.length; i < rowLen; i++) {
                for (var j = 0, columnLen = self.tr[i].cells.length; j < columnLen; j++) {
                    var content = self.tr[i].cells[j].textContent || self.tr.cells[j].innerHTML;
                    if (!!!keyword) {
                        Util.removeClass(self.tr[i], 'hidden');
                        self.tr[i].cells[j].innerHTML = content.replace('<strong>', '').replace('</strong>', '');
                    } else {
                        if (content.indexOf(keyword) !== -1) {
                            Util.removeClass(self.tr[i], 'hidden');
                            self.tr[i].cells[j].innerHTML = content.replace(keyword, '<strong>' + keyword +'</strong>');
                            break;
                        }
                    }
                }
            }
        };
    };

    TableFilter.prototype.addFilter = function() {
        this.filter = document.createElement('input');
        this.options.table.parentNode.insertBefore(this.filter, this.options.table);
        Util.addHandler(this.filter, 'keyup', this.filterHandler());
    };

    var getAllTables = function() {
        return document.getElementsByTagName('table');
    };

    var makeTableSortable = function(table) {
        var tb = new TableSorter({
            table: table,
            ascendClass: 'ascend',
            descendClass: 'descend'
        });
        tb.init().listen();
        return table;
    };

    var makeTableFilterable = function(table) {
        var tb = new TableFilter({
            table: table,
        });
        tb.addFilter();
        return table;
    };

    var makeAllTableSortable = function(tables) {
        for (var i = 0, len = tables.length; i < len; i++) {
            makeTableSortable(tables[i]);
        }
    }

    var makeAllTableFilterable = function(tables) {
        for (var i = 0, len = tables.length; i < len; i++) {
            makeTableFilterable(tables[i]);
        }
    };

    window.onload = function() {
        var tables = getAllTables();
        makeAllTableFilterable(tables);
        // makeTableSortable(makeTableFilterable(tables[0]));
        // makeTableFilterable(makeTableSortable(tables[0]));
    };

}(window));

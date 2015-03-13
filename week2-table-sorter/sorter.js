;(function() {
    "use strict"
    var TableSorter = function(options) {
        this.options = options;
        this.ths = this.options.table.getElementsByTagName('th');
        this.tbody = this.options.table.getElementsByTagName('tbody')[0];
        this.tr = this.options.table.getElementsByTagName('tbody')[0].rows;
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
            for (var j = 0, len = arr.length; j < len; j++) {
                this.removeClass(arr[j], this.options.ascendClass);
                this.removeClass(arr[j], this.options.descendClass);
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
                var x1 = x.cells[criteria].innerHTML,
                    y1 = y.cells[criteria].innerHTML;
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

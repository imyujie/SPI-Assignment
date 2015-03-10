!(function() {
    
    var TableSorter = function(options) {
        this.options = options;
        this.ths = this.options.table.getElementsByTagName('th');
        this.tr = this.options.table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        this.listen();
    };

    TableSorter.prototype = {
        hasClass: function(ele, cl) {
            return ele.className.match(new RegExp('(\\s|^)' + cl + '(\\s|$)'));
        },
        removeClass: function(ele, cl) {
            if (this.hasClass(ele, cl)) {
                ele.className = ele.className.replace(new RegExp('(\\s|^)' + cl + '(\\s|$)'), '');
            }
        },
        addClass: function(ele, cl) {
            ele.className = this.hasClass(ele, cl) ? ele.className + ' ' + cl : cl;
        },
        reset: function(arr) {
            for (var j = 0; j < arr.length; j++) {
                this.removeClass(arr[j], this.options.ascendClass);
                this.removeClass(arr[j], this.options.descendClass);
            }
        },
        listen: function() {
            var self = this;
            for (var i = 0; i < this.ths.length; i++) {
                self.ths[i].onclick = 
                (function(idx) {
                    return function() {
                        if (self.hasClass(this, self.options.ascendClass)) {
                            self.reset(self.ths);
                            self.removeClass(this, self.options.ascendClass);
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
                })(i);
            }
        },
        sort: function(criteria, type) {
            var rowCount = this.options.table.rows.length,
                table = this.options.table;

            for (var i = 1; i < rowCount - 1; i++) {
                var k = i;
                for (var j = i + 1; j < rowCount; j++) {
                    if (type === 'asc') {
                        if (table.rows[k].cells[criteria].innerHTML > table.rows[j].cells[criteria].innerHTML)
                            k = j;
                    } else {
                        if (table.rows[k].cells[criteria].innerHTML < table.rows[j].cells[criteria].innerHTML)
                            k = j;
                    }
                }
                if (k > i) {
                    tmp = table.rows[i].innerHTML;
                    table.rows[i].innerHTML = table.rows[k].innerHTML;
                    table.rows[k].innerHTML = tmp;
                }
            }
        }
    };

    var getAllTables = function() {
        return document.getElementsByTagName('table');
    };

    var makeAllTableSortable = function(tables) {
        for (var i = 0; i < tables.length; i++) {
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

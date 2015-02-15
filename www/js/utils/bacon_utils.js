define(["underscore", 'bacon'], function(_,Bacon){
    function subtract(prev,next){return next-prev;}
    function delta(diff){
        diff || (diff = subtract);
        return function(memo,next){
            if (memo.value){
                memo.delta = diff(memo.value, next);
            }
            memo.value = next;
            return memo;
        };
    }
    function replace(cancel){
        return function(memo, next){
            var c = _.isFunction(cancel)?
                cancel(memo, next):
                cancel;
            memo.prev = memo.current;
            if (!c){
                memo.current = next;
            }
            return memo;
        };
    };
    function changed(memo){
        return memo.prev !== memo.current;
    };
    var Observable = Bacon.Observable.prototype;
    Observable.scan_delta = function(diff){
        return this.scan({}, delta(diff)).filter(".delta");//.map("delta") 
    }
    Observable.scan_replace = function(initial, cancel){
        return this.scan({current:initial}, replace(cancel)).filter(changed);
    }
    /*
        this.property("active", this.property("parent").flatMap(function(p){
            if (!p){return Bacon.constant(true);}
            return p.property("active").combine(p.property("current"), function(active, current){
                return active && current === this;
            }.bind(this));
        }.bind(this)));
    */
    Observable.scan_sequence = function(next){
    }
    return Bacon;
})
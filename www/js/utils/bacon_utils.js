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
    function equivalent(prev,next){return next===prev;}
    function replace(add, remove, cancel){
        //By default, only cancel if we're replacing something with itself.
        !_.isUndefined(cancel) || (cancel = equivalent);
        return function(prev, next){
            var c = _.isFunction(cancel)?cancel(next,prev):cancel;
            if (c) {
                return prev
            };
            if (!!prev && _.isFunction(remove)){
                remove(prev, next)
            }
            if (!!next && _.isFunction(add)){
                add(next, prev);
            }
            return next;
        }
    }
    var Observable = Bacon.Observable.prototype;
    Observable.scan_delta = function(diff){
        return this.scan({}, delta(diff)).filter(".delta").map(".delta");
    }
    Observable.scan_replace = function(initial, add, remove, cancel){
        return this.scan(initial, replace(add,remove,cancel));
    }
    return Bacon;
})
define(["underscore"], function(_){
    /*
        Helper function to be used with scan to replace properties.
        onPrev - function to be called on the previous value before replacement.
        onNext - function to be called on the next value before replacement. 
        cancel - if true, no replacement is done, and onPrev/onNext are not called.
    */
    function replace(onPrev, onNext, cancel){
        return function(prev, next){
            var c = _.isFunction(cancel)? cancel(prev,next):cancel;
            //Avoid replacing values with themselves
            if (c || prev === next) return prev;
            if (prev && onPrev){ onPrev(prev, next);}
            if (next && onNext){
                var result = onNext(next, prev);
                return result || next;
            ;}
            return next;
        }
    };
    
    function pair_up(key, value){
        return ({}[key] = value);
    }
    
    function multi_pair(){
        return _.reduce(arguments, function(memo, next){
            if (memo.key){
                memo.out[memo.key] = next;
                memo.key = undefined;
            } else {
                memo.key = next;
            }
            return memo;
        }, {out:{}}).out;
    }
    /*
        A helper function that makes it easy to designate replaceable properties.
        stream - the target bus to pull values from.
        initial - the initial value. needs to be pushed at the end in order for replace to work correctly.
    */
    function scan_replace(stream, initial, onPrev, onNext, cancel){
        var scan = stream.scan(undefined, 
            replace(onPrev, onNext, cancel));
        scan.onValue();
        if (initial !== undefined) stream.push(initial);
        return scan;
    };
    
    /*
        Helper function used to 
    */
    function delta(diff, initial){
        diff || (diff = function(a,b){return a-b;});
        initial || (initial = 0.0);
        return function(memo, next){
                memo.delta = memo.value? diff(next,memo.value):initial;
                memo.value = next;
                return memo;
        };
    }
    return {replace: replace,scan_replace: scan_replace, delta:delta, pair_up:pair_up, multi_pair:multi_pair};
})
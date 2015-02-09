define(['underscore','backbone_streams','utils/bacon_utils'], function(_, Backbone, Bacon){
    function integrate(prev_value, value, delta){
        if (_.isNumber(value)) return value;
        if (_.isNumber(prev_value)){
            if (delta) prev_value += delta;
            return prev_value;
        }
        return null;
    }
    var TimelinePoint = Backbone.StreamingModel.extend({
        defaults: {
            time: 0,
            value: null,
            delta: null
        },
        initialize: function(params){
            this.property("prev",this.stream("prev").scan_replace())
                .onValue(this.fix_connection.bind(this,"next"));
            this.property("next",this.stream("next").scan_replace())
                .onValue(this.fix_connection.bind(this,"prev"));
            this.on_property("prev", function(diff){
                if (diff.prev){
                    this.unplug();
                };
                if (diff.current){
                    this.unplug = diff.current.on_property("integral", function(value){
                        this.fire_stream("integral", value);
                    }.bind(this));
                };
            }.bind(this));
            this.property("integral", Bacon.combineWith(integrate, 
                            this.stream("integral").toProperty(undefined), 
                            this.property("value"), 
                            this.property("delta")
                           )
             ).onValue(
                function(value){
                    this.set("integral", value);
                }.bind(this)
            );
        },
        fix_connection: function(reverse, diff){
            if (diff.prev){
                diff.prev.fire_stream(reverse, undefined);
            };
            if (diff.current){
                diff.current.fire_stream(reverse, this);
            };
        },
    });
    return TimelinePoint;
});
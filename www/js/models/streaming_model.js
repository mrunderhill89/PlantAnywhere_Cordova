define(['underscore', 'backbone', 'utils/bacon_utils', 'utils/stream_box'], function(_, Backbone, Bacon, Streams){
    var StreamingModel = Backbone.Model.extend({
        constructor: function(attributes, options){
            this.streams = new Streams();
            this.on("change", function(model, options){
                _.each(model.changed, function(value, key){
                    this.stream("change:"+key).push({
                        model:model,
                        value:value,
                        previous:model._previousAttributes[key],
                        options:options
                    });
                }.bind(this));
            })
            //Call Super Constructor
            Backbone.Model.apply(this, arguments);
        },
        attr_property: function(name){
            if (!this.streams.properties[name]){
                var stream = this.stream("change:"+name).map(".value");
                this.streams.properties[name] = stream.toProperty(this.get(name));
            }
            return this.streams.properties[name];
        },
        modify: function(attr, mod){
            var prev = this.get(attr);
            if (_.isFunction(mod)){
                this.set(attr, mod(prev));
            } else if (typeof(prev) === typeof(mod)){
                var next = mod;
                if (!prev || (_.isNumber(mod))){
                    next = prev + mod;
                } else if (_.isString(mod)){
                    next = prev.concat(mod);
                }
                this.set(attr, next);
            }
            return this;
        }
    });
    Streams.mixin(StreamingModel.prototype,"streams");
    return StreamingModel;
})
define(['underscore','bacon'], function(_, Bacon){
    function Streams(streams, properties){
        streams || (streams = {});
        properties || (properties = {});
        this.stream_control = {};
        this.streams = {};
        this.properties = {};
        _.each(streams, function(value,key){
            this.stream(key);
        }.bind(this));
        _.each(properties, function(value,key){
            this.property(key,key,value);
        }.bind(this));
    }
    _.extend(Streams,{
        prototype: _.extend(Streams.prototype, {
            mixin: function(parent, functions){
                functions || (functions=['stream','property']);
                _.each(functions, function(fun){
                    parent[fun] = function(){
                        return this[fun].apply(this,arguments);
                    }.bind(this);
                }.bind(this));
            },
            stream: function(name){
                this.streams[name] || 
                    (this.streams[name] = new Bacon.Bus());
                return this.streams[name];
            },
            property: function(name, stream, initial){
                if (!this.properties[name]){
                    stream || (stream = name);
                    this.properties[name] = this.stream(stream).toProperty(initial);
                };
                return this.properties[name];
            }
        }),
        mixin: function(prototype, property, functions){
            property || (property = "streams");
            functions || (functions=['stream','property']);
            _.each(functions, function(fun){
                prototype[fun] = function(){
                    var instance = this[property];
                    return instance[fun].apply(instance,arguments);
                };
            }.bind(this))
        }
    });
    return Streams;
})
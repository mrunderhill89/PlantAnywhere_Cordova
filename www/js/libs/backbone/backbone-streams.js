(function(root, factory) {
    // Set up Backbone-associations appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'backbone', 'bacon'], function(_, Backbone, Bacon) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            return factory(root, Backbone, Bacon, _);
        });

    // Next for Node.js or CommonJS.
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore'),
            Backbone = require('backbone'),
            Bacon = require('bacon');
        factory(root, Backbone, Bacon, _);
        if (typeof module !== 'undefined' && module.exports) {
            module.exports = Backbone;
        }
        exports = Backbone;

    // Finally, as a browser global.
    } else {
        factory(root, root.Backbone, root.Bacon, root._);
    }

}(this, function(root, Backbone, Bacon, _) {
    // Backbone.Streams
  // ---------------

  // An extension of the event system for Backbone.js using Functional Reactive Programming
  // through Bacon.js. API should be the same as the default Backbone.Events module.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
    var Streams = Backbone.Streams = function(streams, properties){
        streams || (streams = {});
        properties || (properties = {});
        this.streams = {};
        this.properties = {};
        _.each(streams, function(value,key){
            this.stream(key);
        }.bind(this));
        _.each(properties, function(value,key){
            this.property(key,key,value);
        }.bind(this));
    };
    var default_mixins = {
        'stream':'stream',
        'property':'property',
        'on_stream':'on_stream',
        'on_property':'on_property',
        'once_stream':'once_stream',
        'once_property':'once_property',
        'fire_stream':'fire_stream',
    };
    _.extend(Streams,{
        prototype: _.extend(Streams.prototype, {
            //Mixes the stream object's functions into the parent.
            mixin: function(parent, functions){
                //Set default mixin functions here.
                functions || (functions=default_mixins);
                _.each(functions, function(stream_f, backbone_f){
                    if (!parent[backbone_f]){
                        parent[backbone_f] = function(){
                            return this[stream_f].apply(this,arguments);
                        }.bind(this);
                    }
                }.bind(this));
            },
            //Returns a stream, creating a new one if necessary
            stream: function(name, stream){
                if (!this.streams[name]){
                    this.streams[name] = (stream instanceof Bacon.Observable)?
                        stream:
                        new Bacon.Bus();
                }
                return this.streams[name];
            },
            property: function(name, stream, initial){
                if (!this.properties[name]){
                    if (stream instanceof Bacon.Property){
                        this.properties[name] = stream;
                    } else if (stream instanceof Bacon.Observable){
                        this.properties[name] = stream.toProperty(initial);
                    } else if (_.isString(stream)){
                        this.properties[name] = this.stream(name).toProperty(initial);
                    } else {
                        throw("Streams.Property: Expected property or string for 'stream' parameter. Got "+typeof(stream)+" '"+stream+"' instead.");
                    }
                };
                return this.properties[name];
            },
            on_stream: function(name, callback){
                return this.stream(name).onValue(callback);
            },
            once_stream: function(name, callback){
                return this.stream(name).onValue(function(){
                    callback.apply(this,arguments);
                    return Bacon.noMore;
                });
            },
            fire_stream: function(name, value){
                this.stream(name).push(value);
            },
            on_property: function(name, callback){
                return this.property(name).onValue(callback);
            },
            once_property: function(name, callback){
                return this.property(name).onValue(function(){
                    callback.apply(this,arguments);
                    return Bacon.noMore;
                });
            },            
        }),
        mixin: function(prototype, property, functions){
            property || (property = "streams");
            //Set default mixin functions here.
            functions || (functions=default_mixins);
            _.each(functions, function(stream_f, backbone_f){
                if (!prototype[backbone_f]){
                    prototype[backbone_f] = function(){
                        var instance = this[property];
                        return instance[stream_f].apply(instance,arguments);
                    };
                }
            }.bind(this))
        }
    });
    
    /* 
        A simple wrapper class that incorporates the Streams mixin and adds a few extra functions specific to models.
    */
    var StreamingModel = Backbone.StreamingModel = Backbone.Model.extend({
        constructor: function(attributes, options){
            var stream_params = ((options && options.streams) || {});
            var property_params = ((options && options.properties) || {});
            this.streams = new Streams(stream_params, property_params);
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
        //Automatically creates properties for the model's attributes
        property: function(name, stream, initial){
            if (!this.streams.properties[name] && this.has(name)){
                return this.streams.property(
                    name, 
                    this.stream("change:"+name).map(".value"),
                    this.get(name)
                );
            }
            return this.streams.property(name,stream,initial);
        },
        //Uses this.property instead of this.streams.property.
        on_property: function(name, callback){
            return this.property(name).onValue(callback);
        },
        //Uses this.property instead of this.streams.property.
        once_property: function(name, callback){
            return this.property(name).onValue(function(){
                callback.apply(this,arguments);
                return Bacon.noMore;
            });
        }, 
        /*
            This isn't stream related. It's just a helper function to cut
            down on having to call get and set over and over.
            If "mod" is a function, the previous value is passed into it to create the new value.
            Otherwise, if "prev" and "mod" are both numbers, then the mod value is added to prev.
        */
        modify: function(attr, mod){
            var prev = this.get(attr);
            if (_.isFunction(mod)){
                this.set(attr, mod(prev));
            } else if (_.isNumber(prev) && _.isNumber(mod)){
                this.set(attr, prev+mod);
            }
            return this;
        }
    });
    Streams.mixin(StreamingModel.prototype,"streams");
    
    /* 
        A simple wrapper class that incorporates the Streams mixin and adds a few extra functions specific to views.
    */
    var StreamingView = Backbone.StreamingView = Backbone.View.extend({
        constructor: function(options){
            var stream_params = (options.streams || {});
            var property_params = (options.properties || {});
            this.streams = new Streams(stream_params, property_params);
            this.on_stream("render", function(){
                this.render.apply(this, arguments);
            }.bind(this));
            Backbone.View.apply(this,arguments);
        }
    });
    Streams.mixin(StreamingView.prototype,"streams")

    return Backbone;
}))
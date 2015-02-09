define(['underscore','backbone','utils/bacon_utils', 'models/timeline_point'], function(_, Backbone, Bacon, TimelinePoint){
    var KeyFrames = Backbone.Collection.extend({
        binary_search: function(time, check, front, back){
            _.isNumber(front) || (front = 0);
            _.isNumber(back) || (back = this.length-1);
            _.isFunction(check) || (check = this.compare_time.bind(this));
            //Sanity Checks
            // Is the first entry after the target?
            var check_front = check(time,front);
            if (check_front == 0){
                return {
                    exact:front,
                    closest:front
                };
            } else if (check_front > 0){
                return {
                    after:front,
                    closest:front
                };                
            }
            // Is the last entry before the target?
            var check_back = check(time,back);
            if (check_back == 0){
                return {
                    exact:back,
                    closest:back
                };
            } else if (check_back < 0){
                return {
                    before:back,
                    closest:back
                };                
            }
            var mid, check_mid;
            while(back-front > 1){
                mid = front + Math.floor((back-front)/2);
                check_mid = check(time,mid);
                if(check_mid == 0){//found an exact match
                    return {
                        exact:mid,
                        closest:mid
                    };
                } else if (check_mid > 0){//target is before midpoint
                    back = mid;
                } else {//target is after midpoint
                    front = mid;
                }
            }
            return {
                before: front,
                after: back,
                closest: front
            };
        },
        compare_time: function(time, id){
            var frame = this.at(id);
            var f_time = frame.get("time");
            if (time == f_time){
                return 0; //same time
            } else if (time < f_time){
                return 1; //id is after time
            }
            return -1;    //id is before time
        },
        compare_solid_time: function(time, id){
            var inter = this.compare_time(time,id);
            var frame = this.at(id);
            if (inter == 0 && !frame.get("value")){return 1;}
            return inter;
        }
    });
    var Timeline = Backbone.StreamingModel.extend({
        defaults: {
            dependencies:[]
        },
        initialize: function(params){
            var keyframes = new KeyFrames();
            keyframes.on("add", function(model, collection, options){
                var id = options.at;
                if (collection){
                    var next = collection.at(id+1);
                    var prev = collection.at(id-1);
                    model.fire_stream("next", next);
                    model.fire_stream("prev", prev);
                }
            });
            _.each((params && params.points), function(point){
                keyframes.push(point);
            });
            this.set("keyframes", keyframes);
        },
        integrate: function(time){
            var keyframes = this.get("keyframes");
            var search = keyframes.binary_search(time);
            console.log(search);
            if (_.isNumber(search.before) && _.isNumber(search.after)){
                var f_b = keyframes.at(search.before);
                var f_a = keyframes.at(search.after);
                var v_b = f_b.get("integral");
                var v_a = f_a.get("integral");
                var t_b = f_b.get("time");
                var t_a = f_a.get("time");
                var dt = (time-t_b)/(t_a-t_b);
                return ((v_a*dt)+(v_b*(1-dt)));
            };
            return keyframes.at(search.closest).get("integral");
            /*
            var search = keyframes.binary_search(time, keyframes.compare_solid_time.bind(keyframes));
            if (search.exact){return keyframes.at(search.exact).get("value");};
            if (search.before){
                var value = keyframes.at(search.before).get("value");
                return value;
            }
            return keyframes.at(search.closest).get("value");
            */
        }
    });
    return Timeline;
});
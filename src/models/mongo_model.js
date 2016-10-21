module.exports = function(url) {
    var Mongo = require('mongodb');
    var MongoClient = Mongo.MongoClient;
    var db = null;
    
    function baseId(id) {
        if (typeof id.toHexString === 'function') {
            return id.toHexString();
        } else {
            return id;
        }
    }
    
    // TODO fixQueryForId fixes ids only at the top level
    function fixQueryForId(q) {
        for (var key in q) {
            if (q.hasOwnProperty(key)) {
                if (key === 'id') {
                    delete q['id'];
                    q['_id'] = Mongo.ObjectId(q[key]);   
                }
            }
        }
        return q;
    }
    
    // TODO NYI
    function fixQueryByQueryContext(q, queryContext) {
        return q;
        /*for (var key in q) {
            if (q.hasOwnProperty(key)) {
                var v = q[key];
                if (Array.isArray(v)) {
                    v.forEach(function(elem) {
                        fixQueryByQueryContext(elem, )
                    });
                } else if (v instanceof Object) {
                    fixQueryByQueryContext(v, queryContext);
                }
            }
        }*/
    }
    
    this.connect = function(cb) {
        MongoClient.connect(url, function(err, database) {
            db = database;
            cb(err);
        });
    };
    
    this.get = function(table, q, queryContext, cb) {
        q = fixQueryForId(q);
        q = fixQueryByQueryContext(q, queryContext);
        db.collection(table).find(q).toArray(function(err, list) {
            if (!list) {
                list = [];
            }
            list.forEach(function(res) {
                var id = res._id;
                if (id) {
                    delete res['_id'];
                    res['id'] = baseId(id);
                }
            });
            
            cb(err, list);
        });
    };
    
    this.create = function(table, obj, queryContext, cb) {
        db.collection(table).insertOne(obj, function(err, res) {
            delete obj['_id'];
            obj.id = baseId(res.insertedId);
            cb(err, obj);
        });
    };
    
    this.update = function(table, q, obj, queryContext, cb) {
        q = fixQueryForId(q);
        q = fixQueryByQueryContext(q, queryContext);
        
        db.collection(table).update(q, obj, function(err, res) {
            cb(err, res);
        });
    };
    
    this.delete = function(table, q, queryContext, cb) {
        q = fixQueryForId(q);
        q = fixQueryByQueryContext(q, queryContext);
        
        db.collection(table).remove(q, function(err, res) {
            cb(err, res);
        });
    };
};
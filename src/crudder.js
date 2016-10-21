function Request(q) {
    /*
        q = {
            table, type, q, data
        }
    */
    
    this.getTable = function() {
        return q.table;
    };
    
    this.getType = function() {
        return q.type;
    }
    
    this.getQuery = function() {
        return q.q;
    }
    
    this.getData = function() {
        return q.data;
    }
}

function Response(obj) {
    /*
      obj = {
        status, data, error
      }
    */
    this.getPayload = function() {
        return obj;
    };
    
    this.getStatus = function() {
        return obj.status;
    }
    
    this.getError = function() {
        return obj.error;
    }
    
    this.getData = function() {
        return obj.data;
    }
    
    this.isSuccess = function() {
        return obj.status.equals('SUCCESS');
    }
    
    this.getObj = function() {
        return obj;
    }
}

function MultiResponse() {
    var obj = {};
    
    this.addResponse = function(queryName, response) {
        obj[queryName] = response;
    }
    
    this.getResponse = function(queryName) {
        return obj[queryName];
    }
    
    this.getObj = function() {
        return obj;
    }
    
    this.getResponseObj = function() {
        var resp = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                resp[key] = obj[key].getObj();
            }
        }
        return resp;
    }
}

module.exports = function(access, model) {
    var thisObj = this;
    
    this.getAccessObj = function() {
        return access;
    };
    
    this.getModel = function() {
        return model;
    };
    
    this.executeQuery = function(q, cb, responseContext) {
        // TODO check access control
        var req = new Request(q);
        var type = req.getType();
        var table = req.getTable();
        
        switch(type) {
            case 'GET':
                execGet(req, responseContext, cb);
                break;
            case 'CREATE':
                execCreate(req, responseContext, cb);
                break;
            case 'UPDATE':
                execUpdate(req, responseContext, cb);
                break;
            case 'DELETE':
                execDelete(req, responseContext, cb);
                break;
            default:
        }
    };
    
    this.executeMultiQuery = function(q, cb) {
        var responseContext = new MultiResponse();
        var reqs = [];
        for (var key in q) {
            if (q.hasOwnProperty(key)) {
                var req = {
                    key: key,
                    q: q[key]
                };
                reqs.push(req);
            }
        }
        
        if (reqs.length > 0) {
            recursiveMultiQuery(reqs, 0, responseContext, cb);
        } else {
            cb(responseContext);
        }
    };
    
    function recursiveMultiQuery(reqs, position, responseContext, cb) {
        var req = reqs[position];
        thisObj.executeQuery(req.q, function(resp) {
            responseContext.addResponse(req.key, resp);
            
            if (position < reqs.length - 1) {
                recursiveMultiQuery(reqs, position + 1, responseContext, cb);
            } else {
                cb(responseContext);
            }
        }, responseContext);
    }
    
    function execCallback(err, data,  cb) {
        var obj = null;
                    
        if (err) {
            obj = {
                status: 'FAILURE',
                error: err.toString()
            };
        } else {
            obj = {
                status: 'SUCCESS',
                data: data
            };
        }
        cb(new Response(obj));
    }
    
    function execGet(req, responseContext, cb) {
        model.get(req.getTable(), req.getQuery(), responseContext, function(err, data) {
                    execCallback(err, data, cb);
                });
    }
    
    function execCreate(req, responseContext, cb) {
        model.create(req.getTable(), req.getData(), responseContext, function(err, data) {
            execCallback(err, data, cb);
        });
    }
    
    function execUpdate(req, responseContext, cb) {
        model.update(req.getTable(), req.getQuery(), req.getData(), responseContext, function(err, data) {
            execCallback(err, data, cb);
        });
    }
    
    function execDelete(req, responseContext, cb) {
        model.delete(req.getTable(), req.getQuery(), responseContext, function(err, data) {
            execCallback(err, data, cb);
        });
    }
}
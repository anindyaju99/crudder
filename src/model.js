module.exports = function(defaultModel) {
    var registry = {};
    
    function getModel(table) {
        var model = registry[table];
        if (!model) {
            model = defaultModel;
        }
        return model;
    }
    
    // every registered model should implement the get, create, update, delete methods
    this.get = function(table, q, queryContext, cb) {
        var model = getModel(table);
        model.get(table, q, queryContext, cb);
    };
    
    this.create = function(table, obj, queryContext, cb) {
        var model = getModel(table);
        model.create(table, obj, queryContext, cb);
    };
    
    this.update = function(table, q, obj, queryContext, cb) {
        var model = getModel(table);
        model.update(table, q, obj, queryContext, cb);
    };
    
    this.delete = function(table, q, queryContext, cb) {
        var model = getModel(table);
        model.delete(table, q, queryContext, cb);
    };
    
    this.registerModel = function(table, model) {
        registry[table] = model;
    };
    
    this.unregisterModel = function(table) {
        registry[table] = undefined;
    };
}
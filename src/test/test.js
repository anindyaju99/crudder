// assume api is the api end point
// it can either take a REST form or a native complex query form

(function() {
    var Crudder = require('../index');
    var Model = Crudder.Model;
    var DefaultModel = Crudder.Models.Mongo;
    
    var defaultModel = new DefaultModel('mongodb://localhost:27017/test');
    defaultModel.connect(test);
    
    function test(err) {
        if (err) {
            console.log("ERROR - " + err);
            return;
        }
        var model = new Model(defaultModel);
        var crudder = Crudder.create(model);

        var qs = {
            'insert': {
                table: 'crud',
                type: 'CREATE',
                data: {
                    name: 'Test',
                    value: 'Test1'
                }
            },
            'find': {
                table: 'crud',
                type: 'GET',
                q: {
                    name: 'Test'
                }
            }
        };

        /*for (var i in qs) {
            var q = qs[i];
            crudder.executeQuery(q, function(data) {
                console.log("Response (" + i + ") - " + JSON.stringify(data.getObj()));
            });
        }*/

        crudder.executeMultiQuery(qs, function(multiData) {
            console.log("Response - " + JSON.stringify(multiData.getResponseObj()));
        });
    }
})();

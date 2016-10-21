define(function(require) {
	var model = require('model')
	var config = {
		before: function() {
			console.log("请求之前")
		},
		complete: function() {
			console.log("请求完成")
		},
		error: function(){
            console.log('请求错误')
        },

        baseUrl: '',
        sendType: 'json',
        dataType: 'json',
        hasToken: 'true',
        codeKey: 'status.code',
        successCode: 1,
        msgKey: 'status.message',

        modelConfig:{
        	add: {
        		url:'/Domain.Create',
        		method:'POST',
        		hasToken:'true'
        	},
        	get: {
        		url:'/Domain.List',
        		method:'POST',
        		hasToken:'true'
        	},
            del: {
                url:'/Domain.Remove',
                method:'POST',
                hasToken:'true'
            },
            recordlist: {
            	url:'/Record.List',
                method:'POST',
                hasToken:'true'
            },
            recordCreate: {
                url:'/Record.Create',
                method:'POST',
                hasToken:'true'
            },
            recordRemove: {
            	url:'/Record.Remove',
                method:'POST',
                hasToken:'true'
            },        
            recordModify: {
                url:'/Record.Modify',
                method:'POST',
                hasToken:'true'
            },
            recordType: {
                url:'/Record.Type',
                method:'POST',
                hasToken:'true'
            },
            recordLine: {
                url:'/Record.Line',
                method:'POST',
                hasToken:'true'
            }
        }

	}
	var Model = new model(config)
	return Model
})

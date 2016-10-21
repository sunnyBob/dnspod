define(function(require) {

    var $ = require('jquery')

    var View = require('view')

    var Tip = require('js/Tip.js')

    var mustache = require('mustache')

    var Model = require('myModel')

    var addDomainTemplate = require('templates/addDomainTemplate.html.js')

    console.log(addDomainTemplate)

    var addRecTemplate = require('templates/addRecTemplate.html.js')

    var myDomain

    var switchPage = View.extend({
            el:'body',
            events:{
                'click a[name = list],div.allDomain': 'domainPage',
                'click a[name = analyze],a#ana': 'recordPage'
            },
            domainPage: function(e) {
                this.$("span.Tip").html("")
                $(e.target).addClass("active")
                this.$("a[name = analyze]").removeClass("active")
                this.$("#recordPage").addClass("display")
                this.$("#domainPage").removeClass("display")
            },
            recordPage: function(e) {
                console.log(e)
                target = $(e.target)
                this.$("a[name = analyze]").addClass("active")
                this.$("a[name = list]").removeClass("active")
                this.$("#recordPage").removeClass("display")
                this.$("#domainPage").addClass("display")
                if(target.attr('id') === 'ana'){
                    myDomain = target.parent().siblings().eq(0).html()
                    console.log(myDomain)
                    this.$("input[name = analyze]").val(myDomain)
                    new recordDemo().init()
                }
            }
        })
    new switchPage()
    //域名相关
    var domainDemo = View.extend({
    	el: '#domainPage',
        init: function() {
            this.numOfEachPage = 3
            this.currentPage = 1
            this.pageNum = 0
            this.render()
        },
        events: {
            'click button#addbtn': 'add',
            'click a#del': 'Dialog',
            'focus input[name = add]': 'focus',
            'blur  input[name = add]': 'blur',
            'click button[name = lastPage]': 'switchPage',
            'click button[name = nextPage]': 'switchPage',
            'click button.first': 'first',
            'click button.last': 'last',
            'click .domainJumpBtn': 'pageJump',
            'click i.search': 'search',
            'click a.return': 'render'
        },
        render: function(e){
            var that = this
            var data = []
            var n = this.numOfEachPage
            this.$("button[name = lastPage]").addClass("display")
            this.$("button[name = nextPage]").addClass("display")
    	    Model.get({
                    login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                    format: 'json' ,
                    offset: 0,
                    length: n
            }).done(function(resp) {
                console.log(resp)
                if(resp.domains) {
                    var count = (resp.info).domain_total
                        console.log(count)
                    var pageNum = Math.ceil(count / n)
                    that.pageNum = pageNum
                }
                if(pageNum > 1) {
                    that.$("button[name = nextPage]").removeClass("display")
                }
                if(pageNum > 0) {
                    that.$(".pageContainer").removeClass("display")
                    that.$(".children").html(1)
                    that.$(".parent").html(pageNum)
                } else if (pageNum == 0) {
                    that.$(".pageContainer").addClass("display")
                }
                if(that.pageNum == 1) {
                    that.$("buttoinput.jumpn[name = lastPage]").addClass("display")
                    that.$("button[name = nextPage]").addClass("display")
                }
                if(resp.domains) {
                   that.$("#myBody").html(mustache.render(addDomainTemplate, resp.domains))
                }
            }).fail(function(error) {
                console.log(error)
            })
       	},
        first: function () {
            this.currentPage = 1
            var length = this.numOfEachPage
            this.getPage(0, length)
        },
        last: function () {
            this.currentPage = this.pageNum
            var length = this.numOfEachPage
            var offset = (this.currentPage - 1) * length
            this.getPage(offset, length)
        },
        search: function() {
            var that = this
            var val = this.$("input.domainSearch").val()
            this.$(".pageContainer").addClass("display")
            console.log(val)
            if(!val) {
                var message = '没查询到结果'
                new Tip(message)
                that.$("#myBody").html('')
                that.$(".pageContainer").addClass("display")
                that.$("#myBody").append("<a href = '#' class = 'return'>返回列表</a>")
                return
            }
            Model.get({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                keyword: val
            }).done(function(resp, isSucc) {
                console.log(resp)
                if(resp.domains) {
                    that.$("#myBody").html(mustache.render(addDomainTemplate,resp.domains))
                }else{
                    var msg = "不存在此项"
                    new Tip(msg)
                    that.$("#myBody").html('')
                }
                that.$("#myBody").append("<a href = '#' class = 'return'>返回列表</a>")
            }).fail(function(error) {
                console.log(error)
            })
        },
        pageJump: function () {
            var length = this.numOfEachPage
            this.currentPage = this.$("input.jump").val()
            var offset = (this.currentPage - 1) * length
            this.getPage(offset, length)
        },
        getPage: function(offset, length) {
            var that = this
            //上下页按钮隐藏和显示
            var pageNum = this.pageNum
            if(pageNum > 1) {
                this.$("button[name = nextPage]").removeClass("display")
            }
            if(pageNum > 0) {
                this.$(".pageContainer").removeClass("display")
                this.$(".children").html(1)
                this.$(".parent").html(pageNum)
            } else if (pageNum == 0) {
                this.$(".pageContainer").addClass("display")
            }
            if(pageNum == 1) {
                this.$("buttoinput.jumpn[name = lastPage]").addClass("display")
                this.$("button[name = nextPage]").addClass("display")
            }
            if( this.currentPage > 1 ) {
                this.$("button[name = lastPage]").removeClass("display")
            } else {
                this.$("button[name = lastPage]").addClass("display")
            }         
            if( this.currentPage == this.pageNum){
                this.$("button[name = nextPage]").addClass("display")
            } else {
                this.$("button[name = nextPage]").removeClass("display")
            }
            this.$(".children").html(this.currentPage)
            this.$(".parent").html(pageNum)
            Model.get({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                offset: offset,
                length: length
            }).done(function(resp) {
                console.log(resp)
                that.$("#myBody").html(mustache.render(addDomainTemplate, resp.domains))
            }).fail(function(error) {
                console.log(error)
            })
        },
        //上下页跳转
        switchPage: function(e) {
            var target = $(e.target)
            var name = target.attr("name")
            var num = this.pageNum
            if(name === "nextPage") {
                this.currentPage += 1;
                if(this.currentPage > num) {
                    this.currentPage -= 1
                }
            }
            if( name === "lastPage" ) {
                this.currentPage -= 1;
                if(this.currentPage < 1) {
                    this.currentPage += 1
                }
            }
            var length = this.numOfEachPage
            var offset = (this.currentPage - 1) * length
            this.getPage(offset, length)
        },
        blur: function() {
            var domain = $("input[name=add]").val()
            var reg = /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/
            if(!reg.test(domain)){
                new Tip("域名格式错误")
            }
        },
        focus: function() {
            var domain = $("input[name=add]").val()
        },
        add: function() {
            var that = this
            var domain = this.$("input[name=add]").val()
            if(!domain) {
                var msg = "域名不能为空"
                new Tip(msg)
            }
            Model.add({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                domain: domain
            }).done(function(resp) {
                that.render()
                console.log(resp)
            }).fail(function(error) {
                console.log(error)
            })
        },
        dele: function(e) {
            var that = this
            var target = $(e.target)
            var domain = target.parent().siblings().eq(0).html()
            Model.del({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                domain: domain
            }).done(function(resp) {
                Model.get({
                    login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                    format: 'json',
                    offset: 0,
                    length: that.numOfEachPage
                }).done(function (resp) {
                    if((resp.info)) {
                        if((resp.info).domain_total % that.numOfEachPage == 0) {
                            if(that.currentPage > 1) {
                              that.currentPage -= 1
                            }
                            that.pageNum -= 1
                        }
                    }
                    var length = that.numOfEachPage
                    var offset = (that.currentPage - 1) * length
                    that.getPage(offset, length)
                })
            }).fail(function(error) {
                console.log(error)
            })
        },
        Dialog: function(e) {
            var that = this
            $( "#dialog-confirm" ).dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    delete: function() {
                        $( this ).dialog( "close" );
                        that.dele(e)
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
            })
        }
    })
    //记录相关
    var recordDemo = View.extend({
        el: '#recordPage',
        init: function() {
            this.isUsed = false
            this.numOfEachPage = 2
            this.currentPage = 1
            this.pageNum = 0
            this.domain = myDomain
            this.render()
        },
        events: {
            'click button#alybtn, button[name = cancel]': 'render',
            'click button[name = AMRec]': 'showaddForm',
            'click button[name = ARec]': 'addRec',
            'click a#Mdify_': 'showModifyForm',
            'click button[name = MRec]': 'recordModify',
            'click a#del_': 'Dialog',
            'click select[name = recType], select[name = _recType]': 'isDisabled',
            'focus input[name = analyze]': 'focus',
            'blur  input[name = analyze]': 'blur',
            'click button[name = nextPage], button[name = lastPage]': 'switchPage',
            'click button.first': 'first',
            'click button.last': 'last',
            'click .recordJumpBtn': 'pageJump',
            'blur  input.input': 'reccordBlur',
            'click i.record': 'search',
            'click a.return': 'render'
        },
        render: function(e) {
            var that = this
            var data = []
            if(e) {
                var target = $(e.target)
                if(target.attr('name') === 'cancel'){
                    this.isUsed = false
                }
            }
            this.domain = this.$("input[name = analyze]").val()
            this.$(".recordTip").html(this.domain)
            Model.recordlist({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                domain: that.domain,
                offset: 0,
                length: that.numOfEachPage
            }).done(function(resp) {
                console.log(resp)
                var n = that.numOfEachPage
                if(resp.records) {
                    var count = (resp.info).record_total
                    var pageNum = Math.ceil(count / n)
                    that.pageNum = pageNum
                }
                if(pageNum > 1) {
                    that.$("button[name = nextPage]").removeClass("display")
                }
                if(pageNum > 0) {
                    that.$(".pageContainer").removeClass("display")
                    that.$(".children").html(1)
                    that.$(".parent").html(pageNum)
                } else if (pageNum == 0) {
                    that.$(".pageContainer").addClass("display")
                }
                if(that.pageNum == 1) {
                    that.$("buttoinput.jumpn[name = lastPage]").addClass("display")
                    that.$("button[name = nextPage]").addClass("display")
                }
                if(resp.records) {
                    that.$("tbody.recBody").html(mustache.render(addRecTemplate, resp.records))
                }
            }).fail(function(error) {
                console.log(error)
            })
        },
        first: function () {
            this.currentPage = 1
            var length = this.numOfEachPage
            this.getPage(0, length)
        },
        last: function () {
            this.currentPage = this.pageNum
            var length = this.numOfEachPage
            var offset = (this.currentPage - 1) * length
            this.getPage(offset, length)
        },
        pageJump: function () {
            var length = this.numOfEachPage
            this.currentPage = this.$("input.jump").val()
            var offset = (this.currentPage - 1) * length
            this.getPage(offset, length)
        },
        search: function() {
            var that = this
            var val = this.$("input.recordSearch").val()
            console.log(val)
            var data = []
            this.$(".pageContainer").addClass("display")
            console.log(val)
            if(!val) {
                var msg = "没有查询到结果"
                new Tip(msg)
                that.$("tbody.recBody").html('')
                that.$(".pageContainer").addClass("display")
                that.$("tbody.recBody").append("<a href = '#' class = 'return'>返回列表</a>")
                return
            }
            Model.recordlist({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json' ,
                domain: this.domain,
                keyword: val
            }).done(function(resp, isSucc) {
                console.log(resp)
                if(resp.records) {
                    data = resp.records
                    that.$("tbody.recBody").html(mustache.render(addRecTemplate, data))
                }else{
                    new Tip("不存在此项")
                    that.$("tbody.recBody").html('')
                }
                that.$("tbody.recBody").append("<a href = '#' class = 'return'>返回列表</a>")
            }).fail(function(error) {
                console.log(error)
            })
        },
        getPage: function(offset, length) {
            var that = this
            var domain = this.domain
            var pageNum = this.pageNum
            if(pageNum > 1) {
                this.$("button[name = nextPage]").removeClass("display")
            }
            if(pageNum > 0) {
                this.$(".pageContainer").removeClass("display")
                this.$(".children").html(1)
                this.$(".parent").html(pageNum)
            } else if (pageNum == 0) {
                this.$(".pageContainer").addClass("display")
            }
            if(pageNum == 1) {
                this.$("buttoinput.jumpn[name = lastPage]").addClass("display")
                this.$("button[name = nextPage]").addClass("display")
            }
            if( this.currentPage > 1 ) {
                this.$("button[name = lastPage]").removeClass("display")
            } else {
                this.$("button[name = lastPage]").addClass("display")
            }         
            if( this.currentPage == this.pageNum){
                this.$("button[name = nextPage]").addClass("display")
            } else {
                this.$("button[name = nextPage]").removeClass("display")
            }
            this.$(".children").html(this.currentPage)
            this.$(".parent").html(pageNum)
            Model.recordlist({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                domain: domain,
                offset: offset,
                length: length
            }).done(function(resp) {
                that.$(".recBody").html(mustache.render(addRecTemplate, resp.records))
            }).fail(function(error) {
                console.log(error)
            })
        },
        focus: function() {
            var domain = $("input[name = analyze]").val()
            this.$(".tip").html("")
        },
        blur: function() {
            var domain = $("input[name = analyze]").val()
            if(!domain) {
                this.$(".tip").html("域名不能为空")
            }
        },
        switchPage: function(e) {
            var target = $(e.target)
            var name = target.attr("name")
            var num = this.pageNum
            if(name === "nextPage") {
                this.currentPage += 1;
                if(this.currentPage > num) {
                    this.currentPage -= 1
                }
            }
            if( name === "lastPage" ) {
                this.currentPage -= 1;
                if(this.currentPage < 1) {
                    this.currentPage += 1
                }
            }
            var length = this.numOfEachPage
            var offset = (this.currentPage - 1) * length
            this.getPage(offset, length)
        },
        reccordBlur: function(e) {
            var $target = $(e.target)
            var value = $target.val()
            var name = $target.attr("name")
            console.log(name)
            switch(name) {
                case 'value': 
                    var reg = /((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/
                    if(!value) {
                        new Tip("请填写记录值")
                    }
                    else if(!reg.test(value)) {
                        new Tip("记录值格式错误")
                    }
                    break;
                case 'MX':
                    if(!value) {
                        new Tip("请填写MX值")
                    }
                    else if(value < 0 || value > 20) {
                        new Tip("MX值取值范围错误")
                    }
                    break;
                case 'ttl':
                    if(!value) {
                        new Tip("请填写ttl值")
                    }
                    else if(value < 600 || value > 604800) {
                        new Tip("ttl值取值范围错误")
                    }
                    break;
                case '_value': 
                    var reg = /((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/
                    if(!value) {
                        new Tip("请填写记录值")
                    }
                    else if(!reg.test(value)) {
                        new Tip("记录值格式错误")
                    }
                    break;
                case '_MX':
                    if(!value) {
                        new Tip("请填写MX值")
                    }
                    else if(value < 0 || value > 20) {
                        new Tip("MX值取值范围错误")
                    }
                    break;
                case '_ttl':
                    if(!value) {
                        new Tip("请填写ttl值")
                    }
                    else if(value < 600 || value > 604800) {
                        new Tip("ttl值取值范围错误")
                    }
                    break;
            }
        },
        showaddForm: function() {
            this.getType()
            this.getLine()
            $(".form").toggleClass("display")
        },
        isDisabled: function(e) {
            var val = $(e.target).val()
            if(val === 'MX'){
                this.$("input[name = MX]").attr("disabled",false)
                this.$("input[name = _MX]").attr("disabled",false)
            }
            else{
                this.$("input[name = MX]").attr("disabled",true)
                this.$("input[name = _MX]").attr("disabled",true)
            }
        },
        typeRender: function(list, dom) {
            var html = []
            $.each(list, function(i, obj) {
                html.push("<option>"+obj+"</option>")
            })
            dom.html(html.join(''))
        },
        getType: function(e) {
            var that = this
            Model.recordType({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                domain_grade: 'D_Free'
            }).done(function(resp) {
                var types = resp.types
                that.typeRender(types, that.$('.form select[name = recType]'))
                that.typeRender(types, that.$('select[name = _recType]'))
                if(e) {
                    that.$("select[name = _recType]").find("option:selected").text(that.selected[0])
                }
            }).fail(function(error) {
                console.log(error)
            })
        },
        getLine: function(e) {
            var that = this
            var domain = this.domain
            Model.recordLine({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                domain_grade: 'D_Free',
                domain_id: domain
            }).done(function(resp) {
                console.log(resp)
                var types = resp.lines
                that.typeRender(types, that.$('.form select[name = lineType]'))
                that.typeRender(types, that.$('select[name = _lineType]'))
                if(e) {
                    that.$("select[name = _lineType]").find("option:selected").text(that.selected[1])
                }
            }).fail(function(error) {
                console.log(error)
            })
        },
        showModifyForm: function(e) {
            var isUsed = this.isUsed
            if(!isUsed) {
                var target = $(e.target)
                console.log(target)
                var td = target.parent().siblings()
                this.target = target
                this.$("#modifyForm").remove()
                target.parent().parent().html(require('templates/modifyTemplate.html.js'))
                this.getLine(this.target)
                this.getType(this.target)
                this.selected = []
                this.selected.push(td.eq(1).html())
                this.selected.push(td.eq(2).html())
                this.$("input[name = _value]").val(td.eq(3).html()) 
                this.$("input[name = _MX]").val(td.eq(4).html()) 
                this.$("input[name = _ttl]").val(td.eq(5).html()) 
                if(target.attr('id') === 'Mdify_'){
                    this.isUsed = true
                }
            }
        },
        addRec: function() {
            var that = this
            var domain = this.$("input[name = analyze]").val()
            var value = this.$("input[name = value]").val()
            var MX = this.$("input[name = MX]").val()
            console.log(MX)
            var ttl = this.$("input[name = ttl]").val()
            var recType = this.$("select[name = recType]").find("option:selected").text()
            var lineType = this.$("select[name = lineType]").find("option:selected").text()
            if(!domain) {
                new Tip("域名不能为空")
                return
            }
            if(!value) {
                new Tip("记录值不能为空")
                return
            }
            if(!ttl) {
                new Tip("ttl不能为空")
                return
            }
            if(!domain) {
                new("解析域名不能为空")
                return
            }
            Model.recordCreate({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                domain: domain,
                record_type: recType,
                record_line: lineType,
                value: value,
                mx: MX,
                ttl: ttl,
                lang: 'cn'
            }).done(function(resp){
                new Tip(resp.status.message)
                that.render()  
            }).fail(function(error) {
                console.log(error)
            })
        },
        recordRemove: function(e) {
            var that = this
            var $target = $(e.target)
            var rec_ID = $target.attr("name")
            var domain = this.domain
            Model.recordRemove({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                record_id: rec_ID,
                domain: domain
            }).done(function(resp) {
                Model.recordlist({
                    login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                    format: 'json',
                    domain: that.domain,
                    offset: 0,
                    length: that.numOfEachPage
                }).done(function (resp) {
                    if((resp.info)) {
                        if((resp.info).record_total % that.numOfEachPage == 0) {
                            if(that.currentPage > 1) {
                                that.currentPage -= 1
                            }
                            that.pageNum -= 1
                        }
                    }
                    var length = that.numOfEachPage
                    var offset = (that.currentPage - 1) * length
                    that.getPage(offset,length)
                })
            }).fail(function(error) {
                console.log(error)
            })
        },
        Dialog: function(e) {
            var that = this
            $( "#dialog-confirm" ).dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    delete: function() {
                        $( this ).dialog( "close" );
                        that.recordRemove(e)
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
            })
        },
        recordModify: function() {
            var that = this
            var $target = that.target
            var rec_ID = $target.attr("name")
            var domain = this.domain
            var recType = this.$("select[name = _recType]").find("option:selected").text()
            var lineType = this.$("select[name = _lineType]").find("option:selected").text()
            console.log(recType)
            console.log(lineType)
            var value = this.$("input[name = _value]").val()
            var MX = this.$("input[name = _MX]").val()
            var ttl = this.$("input[name = _ttl]").val()
            var length = this.numOfEachPage
            var offset = (this.currentPage - 1) * length
            var array = [{
                name: '@',
                type: recType,
                line: lineType,
                value: value,
                mx: MX,
                ttl: ttl,
                id: rec_ID
            }]
            Model.recordModify({
                login_token: '16382,fbb175387db46af2b8cc40d9417db7c5',
                format: 'json',
                record_id: rec_ID,
                domain: domain,
                record_type: recType,
                record_line: lineType,
                value: value,
                mx: MX,
                ttl: ttl
            }).done(function(resp) {
                console.log(resp)
                that.getPage(offset,length)
                that.isUsed = false
            }).fail(function(error) {
                console.log(error)
            })
        }
    })
    new domainDemo()
})
Ext.ns('ERP');
Ext.ns('ERP','ERP.Chat');

Ext.util.uid = function (){

    var dateObject = new Date();
    var uniqueId =
    dateObject.getFullYear() + '' +
    dateObject.getMonth() + '' +
    dateObject.getDate() + '' +
    dateObject.getTime();

    return Ext.util.MD5(uniqueId);

};

ERP.Chat.PainelChat = Ext.extend(Ext.Panel, {
    // override initComponent
    uid:Ext.util.uid(),
    initComponent: function() {
        // used applyIf rather than apply so user could
        // override the defaults
        Ext.applyIf(this, {
            frame: true,
            layout: 'border',
            items: [{
                xtype: 'panel',
                region: 'center',
                layout:'border',
                items:[
                {
                    xtype:'ERPGridChat',
                    uid:this.uid,
                    region:'center'
                },{
                    xtype: 'ERPFormChat',
                    uid:this.uid,
                    region: 'south',
                    autoScroll:false,
                    layout:'fit',
                    split:true,
                    height:110,
                    minSize: 100,
                    maxSize: 150,
                    collapsible: true,
                    containerScroll: true,
                    collapseMode: 'mini'
                }
                ]
            },{
                xtype: 'panel',
                region: 'west',
                xtype:'ERPGridChatUsers',
                split:true,
                width:200,
                minSize: 100,
                maxSize: 250,
                collapsible: true,
                containerScroll: true,
                collapseMode: 'mini'
            }]
        })
        // call the superclass's initComponent implementation
        ERP.Chat.PainelChat.superclass.initComponent.call(this);
    },
    // override initEvents
    initEvents: function() {
        // call the superclass's initEvents implementation
        ERP.Chat.PainelChat.superclass.initEvents.call(this);

    // now add application specific events
    // notice we use the selectionmodel's rowselect event rather
    // than a click event from the grid to provide key navigation
    // as well as mouse navigation

    }
});
// register an xtype with this class
Ext.reg('ERPChat', ERP.Chat.PainelChat);

ERP.Chat.GridChat = Ext.extend(Ext.grid.GridPanel, {

    // configurables
    border:false,
    frame:false,
    autoExpandColumn: 'mensagem',
    autoScroll: true,
    autoSizeColumns: true,
    anchor:'0',
    clicksToEdit: 1,
    //split: true,
    loadMask: true,
    forceFit:true,
    lastCheck: new Date().format('U'),
    //autoHeight:true,

    // {{{
    initComponent:function() {

        // hard coded - cannot be changed from outside
        var config = {
            // store
            store:[]

            // column model
            ,
            columns:[
            {
                id:'user',
                header: "",
                autoWidth: true,
                sortable: true,
                dataIndex: 'user',
                hidden:false,
                renderer:function(val, cell, record){

                    var user = record.data.user;
                    var data = record.data.data;

                    //data = data.format('h:i:s');

                    return '{'+data+'} '+user+' diz:';

                }
            }
            ,{
                id:'data',
                header: "Data",
                autoWidth: true,
                sortable: true,
                dataIndex: 'data',
                hidden:true
            }
            ,{
                id:'mensagem',
                header: "Mensagem",
                autoWidth: true,
                sortable: true,
                dataIndex: 'mensagem',
                hidden:true
            }
            ]
            // force fit
            ,
            viewConfig:{
                forceFit:true,
                scrollOffset:0,
                enableRowBody:true,
                getRowClass:this.getRowClass
            }

        }; // eo config object

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        ERP.Chat.GridChat.superclass.initComponent.apply(this, arguments);

    } // eo function initComponent

    ,
    getRowClass:function(record, rowIndex, p, store) {

        var recordData = record.get('mensagem');

        p.body = '<div style="margin:10 10 10 30">'+recordData+'</div>';

        return p.body ? 'x-grid3-row-with-body' : '';

    }

    ,
    sync: function() {


        var newmsg = Ext.data.Record.create([
        {
            name:'user'
        },{
            name:'data'
        },{
            name:'mensagem'
        }
        ]);

        Ext.Ajax.request({
            url : 'php/chat.php',
            method: 'POST',
            params :{
                cmd: 'GridChat',
                time:this.lastCheck,
                uid:this.uid
            },
            scope:this,
            success: function ( result, request ) {

                var jsonData = Ext.util.JSON.decode(result.responseText);
                var novo = jsonData.rows;
                var time = jsonData.time;

                this.lastCheck = time;

                Ext.each(
                    novo,
                    function(item){

                        this.store.add(new newmsg({
                            user:item.user,
                            data:item.time,
                            mensagem:item.message
                        }));

                        //console.debug(this.getView().scroller.getValue());

                        //this.view.scrollTo("top",this.getStore().getCount() - 1);

                        this.getView().scroller.scroll("b",999,true);

                    },
                    this
                    );

            },
            failure: function ( result, request ) {}
        });

    }

    ,
    onRender:function() {

        // call parent
        ERP.Chat.GridChat.superclass.onRender.apply(this, arguments);

        // load store
        //this.store.load();
        Ext.TaskMgr.start({
            scope:this,
            run: function(){
                this.sync();
            },
            interval:3000
        })
    } // eo function onRender

}); // eo extend

Ext.reg('ERPGridChat', ERP.Chat.GridChat);

ERP.Chat.GridChatUsers = Ext.extend(Ext.grid.GridPanel, {

    // configurables
    border:false,
    frame:false,
    autoExpandColumn: 'user',
    autoScroll: true,
    autoSizeColumns: true,
    anchor:'0',
    clicksToEdit: 1,
    //split: true,
    loadMask: true,
    forceFit:true,
    lastCheck: new Date().format('U'),
    //autoHeight:true,

    // {{{
    initComponent:function() {

        // hard coded - cannot be changed from outside
        var config = {
            // store
            store:new Ext.data.Store({
                url: 'php/chat.php',
                reader:new Ext.data.JsonReader({
                    fields:[
                    {
                        name: 'user'
                    }
                    ],
                    root: 'rows'
                })
                ,
                sortInfo:{
                    field:'user',
                    direction:'DESC'
                }
                ,
                baseParams:{
                    cmd:'GridChatUsers'
                }
            })

            // column model
            ,
            columns:[
            {
                id:'user',
                header: "Users Online",
                autoWidth: true,
                sortable: true,
                dataIndex: 'user',
                hidden:false
            }
            ]
            // force fit
            ,
            viewConfig:{
                forceFit:true,
                scrollOffset:0,
                enableRowBody:true
            }

        }; // eo config object

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        ERP.Chat.GridChatUsers.superclass.initComponent.apply(this, arguments);

    } // eo function initComponent

    ,
    onRender:function() {

        // call parent
        ERP.Chat.GridChatUsers.superclass.onRender.apply(this, arguments);

        // load store
        //this.store.load();
        Ext.TaskMgr.start({
            scope:this,
            run: function(){
                this.store.reload();
            },
            interval:15000
        })
    } // eo function onRender

}); // eo extend

Ext.reg('ERPGridChatUsers', ERP.Chat.GridChatUsers);

ERP.Chat.FormChat = Ext.extend(Ext.form.FormPanel, {

    // defaults - can be changed from outside
    border:false
    //,frame:true
    ,
    labelWidth:80
    ,
    url:'php/chat.php'

    ,
    constructor:function(config) {
        config = config || {};
        config.listeners = config.listeners || {};
        ERP.Chat.FormChat.superclass.constructor.call(this, config);
    }

    ,
    initComponent:function() {

        // hard coded - cannot be changed from outside
        var config = {
            monitorValid:true
            //,autoScroll:true
            ,
            cls: 'myform'
            ,
            labelAlign: 'top'
            ,
            items:[
            {
                //anchor:'100%',
                //autoHeight:true,
                allowBlank:false,
                xtype: 'htmleditor',
                name:'mensagem',
                hideLabel:true,
                listeners:{
                    scope:this,
                    initialize:function(editor){

                        Ext.EventManager.on(
                            editor.doc,
                            'keypress',
                            function(event){
                                if(event.getKey() == Ext.EventObject.ENTER){
                                    this.submit();
                                }
                            },
                            this
                            );

                    }
                }
            },{
                xtype:'hidden',
                name:'uid',
                //value:Ext.util.uid()
                scope:this,
                value:this.uid
            }
            ],
            buttons:[{
				text:'Enviar'
				,formBind:true
				,scope:this
				,handler:this.submit
			}]
        }; // eo config object

        // apply config
        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        ERP.Chat.FormChat.superclass.initComponent.apply(this, arguments);

    } // eo function initComponent

    /**
	* Form onRender override
	*/
    ,
    onRender:function() {

        // call parent
        ERP.Chat.FormChat.superclass.onRender.apply(this, arguments);

    } // eo function onRender

    /**
	* Submits the form. Called after Submit buttons is clicked
	* @private
	*/
    ,
    submit:function() {
        this.getForm().submit({
            url:this.url
            ,
            scope:this
            ,
            success:this.onSuccess
            ,
            failure:this.onFailure
            ,
            params:{
                cmd:'saveForm'
            }
            ,
            waitMsg:'Saving...'
        });
    } // eo function submit

    ,
    reset:function() {
        this.getForm().reset();
    } // eo function submit

    /**
	* Success handler
	* @param {Ext.form.BasicForm} form
	* @param {Ext.form.Action} action
	* @private
	*/
    ,
    onSuccess:function(form, action) {
        this.reset();
    } // eo function onSuccess

    /**
	* Failure handler
	* @param {Ext.form.BasicForm} form
	* @param {Ext.form.Action} action
	* @private
	*/
    ,
    onFailure:function(form, action) {
        this.showError(action.result.error || action.response.responseText);
    } // eo function onFailure

    /**
	* Shows Message Box with error
	* @param {String} msg Message to show
	* @param {String} title Optional. Title for message box (defaults to Error)
	* @private
	*/
    ,
    showError:function(msg, title) {
        title = title || 'Error';
        Ext.Msg.show({
            title:title
            ,
            msg:msg
            ,
            modal:true
            ,
            icon:Ext.Msg.ERROR
            ,
            buttons:Ext.Msg.OK
        });
    } // eo function showError

}); // eo extend

// register xtype
Ext.reg('ERPFormChat', ERP.Chat.FormChat);

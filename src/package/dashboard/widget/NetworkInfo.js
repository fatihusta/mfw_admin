Ext.define('Mfw.dashboard.widget.NetworkInfo', {
    extend: 'Ext.Container',
    alias: 'widget.widget-network-info',

    viewModel: {
        data: {
            widget: null
        }
    },

    margin: 8,
    cls: 'mfw-widget',
    layout: 'center',

    items: [{
        xtype: 'toolbar',
        style: { background: 'transparent' },
        docked: 'top',
        shadow: false,
        padding: '0 8 0 16',
        items: [{
            xtype: 'container',
            style: 'font-weight: 100;',
            bind: {
                html: '<span style="color: #333; display: inline-block;">Network Information</span>'
            }
        }, '->', {
            xtype: 'component',
            itemId: 'timer',
            margin: '0 5 0 0',
            hidden: true,
            bind: {
                hidden: '{widget.interval === 0}'
            }
        }, {
            iconCls: 'md-icon-refresh',
            ui: 'round',
            handler: 'reload'
        }]
    }, {
        xtype: 'container',
        html: 'Not implemented yet!'
    }],
    listeners: {
        removed: function (widget) {
            if (widget.tout) {
                clearTimeout(widget.tout);
            }
        }
    },

    controller: {
        init: function (widget) {
            widget.tout = null;
            WidgetsPipe.add(widget);
        },

        reload: function () {
            var me = this;
            WidgetsPipe.add(me.getView());
        }
    }


});

Ext.define('Mfw.setup.step.Lte', {
    extend: 'Ext.Panel',
    alias: 'widget.step-lte',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    padding: '24 0',

    scrollable: true,

    items: [{
        xtype: 'component',
        width: 500,
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center;">Cellular Connection</h1><hr/>'
    }, {
        xtype: 'container',
        itemId: 'forms',
        layout: 'hbox'
    }],

    listeners: {
        activate: 'onActivate'
    },

    controller: {
        onActivate: function (view) {
            var me = this,
                store = Ext.getStore('interfaces');

            view.down('#forms').removeAll();

            if (!store.isLoaded()) {
                store.load(function () {
                    me.setLteInterfaces();
                });
            } else {
                me.setLteInterfaces();
            }
        },

        // add lte forms
        setLteInterfaces: function () {
            var me = this,
                view = me.getView(),
                store = Ext.getStore('interfaces');

            store.clearFilter(true);
            store.each(function (intf) {
                if (intf.get('type') === 'WWAN') {
                    view.down('#forms').add({
                        xtype: 'lteform',
                        margin: '0 16',
                        viewModel: {
                            data: {
                                intf: intf
                            }
                        }
                    });
                }
            });
        },

        continue: function (cb) {
            var me = this,
                vm = me.getViewModel(),
                view = me.getView(),
                store = Ext.getStore('interfaces'),
                isValid = true;

            view.query('formpanel').forEach(function (form) {
                if (!form.validate()) {
                    isValid = false;
                }
            });

            if (!isValid) {
                vm.set('processing', false);
                return;
            }

            // if no changes made just skip to next step
            if (store.getModifiedRecords().length <= 0) {
                cb();
                return;
            }

            store.each(function (record) {
                record.dirty = true;
                record.phantom = false;
            });

            store.sync({
                success: function () {
                    cb();
                },
                callback: function () {
                    vm.set('processing', false);
                }
            });
        }
    }
});

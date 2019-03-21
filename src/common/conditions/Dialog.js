Ext.define('Mfw.common.conditions.Dialog', {
    extend: 'Ext.Dialog',
    alias: 'widget.conditions-dialog',

    viewModel: {
        data: {
            visibleAdd: false
        }
    },

    config: {
        condition: null
    },

    bind: {
        title: '{action === "ADD" ? "Add" : "Edit"} <span style="color: #777;"></span> Condition',
    },
    width: 500,
    height: 280,

    bodyPadding: '0 16',

    showAnimation: {
        duration: 0
    },

    layout: 'fit',

    items: [{
        xtype: 'formpanel',
        padding: 0,
        keyMapEnabled: true,
        keyMap: {
            enter: {
                key: Ext.event.Event.ENTER,
                handler: 'onSubmit'
            }
        },
        items: [{
            xtype: 'selectfield',
            name: 'column',
            label: 'Select field'.t(),
            labelAlign: 'top',
            placeholder: 'Choose field'.t(),
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            forceSelection: true,
            options: Table.allColumns,
            required: true,
            listeners: {
                change: 'onColumnChange',
                painted: function (f) { f.focus(); }
            }
        }, {
            xtype: 'containerfield',
            layout: 'hbox',
            defaults: {
                required: true
            },
            items: [{
                xtype: 'selectfield',
                name: 'operator',
                label: 'Operator'.t(),
                labelAlign: 'top',
                placeholder: 'Choose operator'.t(),
                width: 180,
                margin: '0 16 0 0',
                displayTpl: '{text} [ {value} ]',
                itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
                value: 'EQ',
                options: Globals.operators
            }, {
                xtype: 'textfield',
                itemId: 'valueTextField',
                autoComplete: false,
                clearable: false,
                flex: 1,
                name: 'value',
                label: 'Value'.t(),
                labelAlign: 'top',
                placeholder: 'Enter value ...'
            }]
        }]
    }, {
        xtype: 'toolbar',
        docked: 'bottom',
        items: ['->', {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: 'onCancel'
        }, {
            bind: {
                text: '{action === "ADD" ? "Add" : "Update"}'
            },
            ui: 'action',
            handler: 'onSubmit'
        }]
    }],

    controller: {
        init: function (dialog) {
            var vm = dialog.getViewModel(),
                form = dialog.down('formpanel'),
                conditions = vm.get('route.conditions');

            // editing existing condition
            if (dialog.conditionIdx >= 0) {
                form.setValues(conditions[dialog.conditionIdx]);
                vm.set('action', 'EDIT');
            } else {
                form.setValues({
                    column: '',
                    operator: 'EQ',
                    value: ''
                });
                vm.set('action', 'ADD');
            }
        },

        onColumnChange: function (field, value) {
            var me = this,
                vm = me.getViewModel(),
                dialog = me.getView(),
                form = dialog.down('formpanel'),
                conditions = vm.get('route.conditions'),
                customEditor = form.down('containerfield').getAt(2),
                // conditionIdx = me.sheet.getViewModel().get('conditionIdx'),
                column = Ext.Array.findBy(Table.sessions.columns, function (item) {
                    return item.dataIndex === value;
                });

            if (!column) {
                console.warn('Column ' + value + ' not defined!');
                return;
            }

            // remove an existing custom column value field editor if exists
            if (customEditor) { form.down('containerfield').remove(customEditor); }

            var columnField = Table.createColumnField(column.dataIndex);

            // add custom column value field
            if (columnField) {
                // hide default textfield
                form.down('#valueTextField').setName('').hide().disable();
                // add custom field editor
                form.down('containerfield').add(columnField);

                // set again the values because of the custom field
                if (dialog.conditionIdx >= 0 && conditions[dialog.conditionIdx].column === columnField.columnName) {
                    form.setValues(conditions[dialog.conditionIdx]);
                }
            } else {
                // show default textfield
                form.down('#valueTextField').setName('value').show().enable();
                form.down('#valueTextField').setValue('').setError(null);
            }
        },

        onCancel: function () {
            var me = this;
            me.getView().destroy();
        },

        onSubmit: function () {
            var me = this,
                dialog = me.getView(),
                vm = me.getViewModel(),
                route = vm.get('route'),
                form = me.getView().down('formpanel');

            if (!form.validate()) { return; }

            if (vm.get('action') === 'ADD') {
                route.conditions.push(form.getValues());
            } else {
                route.conditions[dialog.conditionIdx] = form.getValues();
            }

            if (dialog.ownerCmp.isXType('dashboard')) {
                Mfw.app.redirectTo(DashboardUtil.routeToQuery(route));
            } else {
                Mfw.app.redirectTo(ReportsUtil.routeToQuery(route));
            }

            me.getView().destroy();
        }
    }

});
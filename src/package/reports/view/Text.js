Ext.define('Mfw.reports.Text', {
    extend: 'Ext.Panel',
    alias: 'widget.text-report',

    viewModel: {
        data: {
            text: ''
        }
    },

    items: [{
        xtype: 'container',
        padding: 16,
        bind: {
            html: '<h2 style="font-weight: 100;">{text}</h2>'
        }
    }],

    controller: {
        init: function () {
            var me = this,
                vm = me.getViewModel();

            /**
             * reload report data when sinceHours changed
             */
            vm.bind('{sinceHours}', function (since) {
                var record = vm.get('record');
                if (!record || record.get('type') !== 'TEXT') {
                    return;
                }
                me.loadData();
            });
        },

        loadData: function (cb) {
            var me = this,
                view = me.getView().up('report') || me.getView().up('widget-report'),
                viewModel = me.getViewModel(),
                record = viewModel.get('record'),
                tz = moment().tz(Mfw.app.tz.displayName),
                sinceHours = me.getViewModel().get('sinceHours'),
                userConditions, sinceCondition;

            if (!record) { return; }

            // remove existing since condition
            userConditions = record.userConditions();
            sinceCondition = userConditions.findBy(function (c) {
                return c.get('column') === 'time_stamp' && c.get('operator') === 'GT';
            });
            if (sinceCondition >= 0) {
                userConditions.removeAt(sinceCondition);
            }

            // add updated since
            record.userConditions().add({
                column: 'time_stamp',
                operator: 'GT',
                value: tz.subtract(sinceHours, 'hour').valueOf()
            });

            view.mask({xtype: 'loadmask'});
            /**
             * data is an array of objects {column_name: value}
             * textString is defined in report rendering settings like:
             * text ... {0}... {1} end text
             */
            ReportsUtil.fetchReportData(record, null, function (data) {
                var args = [];

                view.unmask();

                // If we receive an error from the fetchReportData call, we still need to call the callback before returning.
                // This prevents this widget from blocking other widgets that need to be processed
                if (data === 'error') { 
                    if (cb) { cb(); }
                    return; 
                }
                if (!record.getRendering() || !record.getRendering().get('textString')) {
                    console.error('Invalid report settings detected. textString rendering missing!');
                    viewModel.set('text', 'Invalid report settings!');
                    if (cb) { cb(); }

                    return;
                }

                args.push(record.getRendering().get('textString'));

                Ext.Array.each(data, function (d) {
                    Ext.Object.each(d, function (key, val) {
                        args.push(val);
                    });
                });

                if (cb) { cb(); }

                viewModel.set('data', data);
                viewModel.set('text', Ext.String.format.apply(this, args));
            });
        }
    }


});

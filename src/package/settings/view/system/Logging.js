Ext.define('Mfw.settings.system.Logging', {
    extend: 'Ext.Panel',
    alias: 'widget.mfw-settings-system-logging',

    title: 'Logging',
    layout: 'fit',

    viewModel: {
        data: {
            logtype: 'logread' // 'logread' or 'dmesg'
        }
    },

    items: [{
        xtype: 'container',
        style: 'font-size: 14px;',
        layout: 'fit',
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'button',
                bind: {
                    ui: '{logtype === "logread" ? "action" : ""}'
                },
                text: 'Logread',
                handler: 'switchLogType',
                value: 'logread'
            },
            {
                xtype:'button',
                text: 'Dmesg',
                bind: {
                    ui: '{logtype === "dmesg" ? "action" : ""}'
                },
                handler: 'switchLogType',
                value: 'dmesg',
                margin: '0 0 0 16'
            }, {
                xtype: 'toolbarseparator',
                style: 'background: #CCC',
                margin: '0 16'
            }, {
                xtype:'button',
                text: 'Reload',
                iconCls: 'md-icon-refresh',
                tooltip: 'Refresh',
                handler: 'fetchLogs',
                margin: '0 8 0 0'
            }, {
                xtype:'button',
                text: 'Save',
                iconCls: 'x-fa fa-save',
                tooltip: 'Save',
                handler: 'saveLogs'
            }]
        }, {
            // use textarea to avoid converting new-line chars into line break (<br>) tags
            xtype: 'textareafield',
            editable: false,
            cls: 'mfw-logger', // custom class to style the content
            itemId: 'logger',
            value: ''
        }]
    }],

    listeners: {
        activate: 'fetchLogs'
    },
    controller: {
        switchLogType: function (btn) {
            this.getViewModel().set('logtype', btn.getValue());
            this.fetchLogs();
        },

        /**
         * fetches the logs for the selected logtype
         */
        fetchLogs: function () {
            var logContainer = this.getView().down('#logger'),
                logType = this.getViewModel().get('logtype'),
                scrollEl = logContainer.ariaEl.dom;

            logContainer.setValue('');

            Ext.Ajax.request({
                url: '/api/logging/' + logType,
                success: function (response) {
                    // insert log result
                    logContainer.setValue(Ext.util.Base64.decode(Ext.decode(response.responseText).logresults));
                    // hopefully should scroll to bottom of textarea
                    scrollEl.scrollTop = scrollEl.scrollHeight;
                },
                failure: function () {
                    // will fallback to the generic error handler, no need to set something
                }
            });
        },

        saveLogs: function () {
            var log = this.getView().down('#logger').getValue(),
                logtype = this.getViewModel().get('logtype'),
                time = moment.tz(Mfw.app.tz.displayName).format('DD-MM-YY-hhmmA'), // timestamp used in file name
                link = document.createElement('a');

            // create a link with log content and save to a file
            link.setAttribute('href', 'data:text;charset=utf-8,' + log);
            link.setAttribute('download', logtype.toLowerCase() + '_' + time + '.log');
            link.click();
        }
    }

});

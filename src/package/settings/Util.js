Ext.define('Mfw.settings.Util', {
    alternateClassName: 'Util',
    singleton: true,

    api: window.location.origin + '/api',

    /**
     * Called recursively to transform/sanitize data sent back to server
     * by removing/cleaning up extra fields generated by the UI
     */
    sanitize: function (data) {
        Ext.Object.each(data, function (key, value) {
            if (Ext.String.startsWith(key, '_') || key === 'id' || key === 'output' || key === 'mfw.model.table.Table') {
                delete data[key];
            }

            // remove null or empty string keys
            if (value === '' || value === null) {
                delete data[key];
            }

            if (Ext.isArray(value)) {
                Ext.Array.each(value, function (v) {
                    Util.sanitize(v);
                });
            }
            if (Ext.isObject(value)) {
                Util.sanitize(value);
            }
        });
        return data;
    },

    /** it should export the top model/store and not associeted stores */
    export: function (from, filename) {
        var isStore = from instanceof Ext.data.Store,
            isModel = from instanceof Ext.data.Model,
            data = [], out, link;


        if (isModel) {
            data = from.getData(true);
        }

        if (isStore) {
            from.each(function (r) {
                data.push(r.getData(true));
            });
        }

        Util.sanitize(data);

        out = 'data:text/json;charset=utf-8,' + Ext.JSON.encode(data);
        out = encodeURI(out);

        link = document.createElement('a');
        link.setAttribute('href', out);
        link.setAttribute('download', filename + '.json');
        link.click();
    },

    // adds timezone computation to ensure dates showing in UI are showing actual server date
    serverToClientDate: function (serverDate) {
        if (!serverDate) { return null; }
        return Ext.Date.add(serverDate, Ext.Date.MINUTE, new Date().getTimezoneOffset() / 60000);
    },

    // extracts the timezone computation from UI dates before requesting new data from server
    clientToServerDate: function (clientDate) {
        if (!clientDate) { return null; }
        return Ext.Date.subtract(clientDate, Ext.Date.MINUTE, new Date().getTimezoneOffset() / 60000);
    },

    // getFirstPacketConditions will retrieve all condition types that do not have disableOnFirstPacket == true
    getFirstPacketConditions: function() {
        return Conditions.list.filter(function(item) {return item.disableOnFirstPacket != true; }).map(function(item) {return item.type; });
    },

    /**
     * Method used to show the upgrade warning alert
     * which will trigger the upgrade process (if YES chosen)
     * used in System/Upgrade view and main header upgrade menu
     */
    upgradeNow: function() {
        Ext.Msg.show({
            title: '<i class="x-fa fa-exclamation-triangle"></i> Warning',
            message: 'The upgrade might take a few minutes!<br/>During this period the internet connection can be lost.<br/><br/>Do you want to continue?',
            showAnimation: null,
            hideAnimation: null,
            buttons: [{
                text: 'NO',
                handler: function () { this.up('messagebox').hide(); }
            }, {
                text: 'YES',
                ui: 'action',
                margin: '0 0 0 16',
                handler: function (btn) {
                    btn.up('messagebox').hide();

                    /**
                     * show the MANUAL upgrade pending view
                     * the upgrade call is made in pending view
                     */
                    Mfw.app.viewport.add({
                        xtype: 'upgrade-pending',
                        type: 'MANUAL'
                    }).show();
                }
            }]
        });
    },

    /**
     * generic method to copy a string to clipboard
     * @param {String} str
     */
    copyToClipboard: function (str) {
        // uses a hidden textarea element
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        // this executes the actual copy
        document.execCommand('copy');
        // remove the textarea helper
        document.body.removeChild(el);
    },

});

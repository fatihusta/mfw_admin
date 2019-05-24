Ext.define('Mfw.settings.Util', {
    alternateClassName: 'Util',
    singleton: true,

    api: window.location.origin + '/api',
    // api: 'http://192.168.101.233/api',


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
        // console.log(data);
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


    operators: [
        { value: '==', text: 'Equals'.t(), sign: ' = ' },
        { value: '!=', text: 'Not Equals'.t(), sign: ' != ' },
        { value: '>', text: 'Greater Than'.t(), sign: ' > ' },
        { value: '<', text: 'Less Than'.t(), sign: ' < ' },
        { value: '>=', text: 'Greater Than or Equal'.t(), sign:' >= ' },
        { value: '<=', text: 'Less Than or Equal'.t(), sign: ' <= ' }
    ],

    limitRateUnits: [
        { text: 'Bytes/Second',   value: 'BYTES_PER_SECOND' },
        { text: 'KBytes/Second',  value: 'KBYTES_PER_SECOND' },
        { text: 'MBytes/Second',  value: 'MBYTES_PER_SECOND' },
        { text: 'Packets/Second', value: 'PACKETS_PER_SECOND' },
        { text: 'Packets/Minute', value: 'PACKETS_PER_MINUTE' },
        { text: 'Packets/Hour',   value: 'PACKETS_PER_HOUR' },
        { text: 'Packets/Day',    value: 'PACKETS_PER_DAY' },
        { text: 'Packets/Week',   value: 'PACKETS_PER_WEEK' }
    ],

    addressTypes: [
        { text: 'Unspecified', value: 'unspec' },
        { text: 'Unicast', value: 'unicast' },
        { text: 'Local', value: 'local' },
        { text: 'Broadcast', value: 'broadcast' },
        { text: 'Anycast', value: 'anycast' },
        { text: 'Multicast', value: 'multicast' },
        { text: 'Blackhole', value: 'blackhole' },
        { text: 'Unreachable', value: 'unreachable' },
        { text: 'Prohibit', value: 'prohibit' }
    ],

    connectionStates: [
        { text: 'New', value: 'new' },
        { text: 'Established', value: 'established' },
        { text: 'Related', value: 'related' },
        { text: 'Invalid', value: 'invalid' }
    ],

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

    constructor: function() {
        this.initConfig({
            operatorsMap: Ext.Array.toValueMap(this.operators, 'value'),
            limitRateUnitsMap: Ext.Array.toValueMap(this.limitRateUnits, 'value'),
            addressTypesMap: Ext.Array.toValueMap(this.addressTypes, 'value'),
            connectionStatesMap: Ext.Array.toValueMap(this.connectionStates, 'value')
        });
    }
});

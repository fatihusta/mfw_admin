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


    ruleOperators: [
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

    // Rules Conditions definition
    conditions: [{
        type:'LIMIT_RATE',
        text: 'Limit Rate'.t(),
        operators: ['<', '>'],
        field: {
            xtype: 'numberfield',
        },
        unitField: {
            xtype: 'selectfield',
            temId: 'unitField',
            name: 'rate_unit',
            label: 'Rate Unit',
            labelAlign: 'top',
            placeholder: 'Choose rate unit ...',
            forceSelection: true,
            editable: false,
            // width: 220,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>'
            // options: this.limitRateUnits
        }
    }, {
        type:'IP_PROTOCOL',
        text: 'IP Protocol'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            forceSelection: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            // value: 6, // a default value
            options: Globals.protocols
        }
    }, {
        type:'SOURCE_INTERFACE_NAME',
        category: 'Source',
        text: 'Source Interface Name'.t(),
        operators: ['==', '!=']
    }, {
        type:'DESTINATION_INTERFACE_NAME',
        category: 'Destination',
        text: 'Destination Interface Name'.t(),
        operators: ['==', '!=']
    }, {
        type:'SOURCE_ADDRESS',
        category: 'Source',
        text: 'Source Address'.t(),
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'SOURCE_ADDRESS_V6',
        category: 'Source',
        text: 'Source Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'DESTINATION_ADDRESS',
        category: 'Destination',
        text: 'Destination Address'.t(),
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'DESTINATION_ADDRESS_V6',
        category: 'Destination',
        text: 'Destination Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'SOURCE_ADDRESS_TYPE',
        category: 'Source',
        text: 'Source Address Type'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            forceSelection: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: [
                { text: 'Unspecified', value: 'unspec' },
                { text: 'Unicast', value: 'unicast' },
                { text: 'Local', value: 'local' },
                { text: 'Broadcast', value: 'broadcast' },
                { text: 'Anycast', value: 'anycast' },
                { text: 'Multicast', value: 'multicast' },
                { text: 'Blackhole', value: 'blackhole' },
                { text: 'Unreachable', value: 'unreachable' },
                { text: 'Prohibit', value: 'prohibit' }
            ]
        }
    }, {
        type:'DESTINATION_ADDRESS_TYPE',
        category: 'Destination',
        text: 'Destination Address Type'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            forceSelection: true,
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: [
                { text: 'Unspecified', value: 'unspec' },
                { text: 'Unicast', value: 'unicast' },
                { text: 'Local', value: 'local' },
                { text: 'Broadcast', value: 'broadcast' },
                { text: 'Anycast', value: 'anycast' },
                { text: 'Multicast', value: 'multicast' },
                { text: 'Blackhole', value: 'blackhole' },
                { text: 'Unreachable', value: 'unreachable' },
                { text: 'Prohibit', value: 'prohibit' }
            ]
        }
    }, {
        type:'SOURCE_PORT',
        category: 'Source',
        text: 'Source Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
        }
    }, {
        type:'DESTINATION_PORT',
        category: 'Destination',
        text: 'Destination Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'SOURCE_INTERFACE_ZONE',
        category: 'Source',
        text: 'Source Interface Zone'.t(),
        operators: ['==', '!=']
    }, {
        type:'DESTINATION_INTERFACE_ZONE',
        category: 'Destination',
        text: 'Destination Interface Zone'.t(),
        operators: ['==', '!=']
    }, {
        type:'CLIENT_INTERFACE_ZONE',
        category: 'Client',
        text: 'Client Interface Zone'.t(),
        operators: ['==', '!=']
    }, {
        type:'SERVER_INTERFACE_ZONE',
        category: 'Server',
        text: 'Server Interface Zone'.t(),
        operators: ['==', '!=']
    }, {
        type:'CLIENT_PORT',
        category: 'Client',
        text: 'Client Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'SERVER_PORT',
        category: 'Server',
        text: 'Server Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'LOCAL_PORT',
        category: 'Local',
        text: 'Local Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'REMOTE_PORT',
        category: 'Remote',
        text: 'Remote Port'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'numberfield',
            validators: ['number']
        }
    }, {
        type:'CLIENT_ADDRESS',
        category: 'Client',
        text: 'Client Address'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'CLIENT_ADDRESS_V6',
        category: 'Client',
        text: 'Client Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'SERVER_ADDRESS',
        category: 'Server',
        text: 'Server Address'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'SERVER_ADDRESS_V6',
        category: 'Server',
        text: 'Server Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'LOCAL_ADDRESS',
        category: 'Local',
        text: 'Local Address'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'LOCAL_ADDRESS_V6',
        category: 'Local',
        text: 'Local Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'REMOTE_ADDRESS',
        category: 'Remote',
        text: 'Remote Address'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'REMOTE_ADDRESS_V6',
        category: 'Remote',
        text: 'Remote Address IPv6'.t(),
        operators: ['==', '!='],
        field: {
            xtype: 'textfield',
            validators: ['ipaddress']
        }
    }, {
        type:'CLIENT_HOSTNAME',
        category: 'Client',
        text: 'Client Hostname'.t(),
        operators: ['==', '!=']
    }, {
        type:'SERVER_HOSTNAME',
        category: 'Server',
        text: 'Server Hostname'.t(),
        operators: ['==', '!=']
    }, {
        type:'LOCAL_HOSTNAME',
        category: 'Local',
        text: 'Local Hostname'.t(),
        operators: ['==', '!=']
    }, {
        type:'REMOTE_HOSTNAME',
        category: 'Remote',
        text: 'Remote Hostname'.t(),
        operators: ['==', '!=']
    }, {
        type:'CLIENT_USERNAME',
        category: 'Client',
        text: 'Client Username'.t(),
        operators: ['==', '!=']
    }, {
        type:'SERVER_USERNAME',
        category: 'Server',
        text: 'Server Username'.t(),
        operators: ['==', '!=']
    }, {
        type:'LOCAL_USERNAME',
        category: 'Local',
        text: 'Local Username'.t(),
        operators: ['==', '!=']
    }, {
        type:'REMOTE_USERNAME',
        category: 'Remote',
        text: 'Remote Username'.t(),
        operators: ['==', '!=']
    }, {
        type: 'CT_STATE',
        text: 'Connection State',
        operators: ['==', '!='],
        field: {
            xtype: 'selectfield',
            editable: false,
            displayTpl: '{text} [ {value} ]',
            itemTpl: '{text} <span style="color: #999">[ {value} ]</span>',
            options: [
                { text: 'Established', value: 'established' },
                { text: 'Related', value: 'related' },
                { text: 'Invalid', value: 'invalid' }
            ]
        }
    }],

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
        this.conditions[0].unitField.options = this.limitRateUnits;
        this.initConfig({
            ruleOperatorsMap: Ext.Array.toValueMap(this.ruleOperators, 'value'),
            ruleConditionsMap: Ext.Array.toValueMap(this.conditions, 'type'),
            limitRateUnitsMap: Ext.Array.toValueMap(this.limitRateUnits, 'value')
        });
    }
});

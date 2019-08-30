Ext.define('Mfw.setup.cmp.Wifi', {
    extend: 'Ext.form.Panel',
    alias: 'widget.wifiform',

    layout: {
        type: 'vbox'
    },

    items: [{
        xtype: 'container',
        width: 300,
        layout: {
            type: 'vbox'
        },
        defaults: {
            clearable: false,
            labelAlign: 'left',
            // labelTextAlign: 'right'
        },
        items: [{
            xtype: 'container',
            margin: '0 0 16 0',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 24px;',
                bind: {
                    html: '{intf.name}'
                }
            }, {
                flex: 1
            }, {
                xtype: 'togglefield',
                bind: {
                    userCls: '{intf.enabled ? "on" : "off"}', // custom styling class
                    boxLabel: '<strong>{intf.enabled ? "Enabled" : "Disabled"}</strong>',
                    value: '{intf.enabled}'
                }
            }]
        }, {
            xtype: 'selectfield',
            userCls: 'x-custom-field',
            label: 'Mode',
            required: true,
            autoSelect: true,
            options: [
                { text: 'Access Point', value: 'AP' },
                { text: 'Client', value: 'CLIENT' }
            ],
            disabled: true,
            bind: {
                value: '{intf.wirelessMode}',
                disabled: '{!intf.enabled}'
            }
        }, {
            xtype: 'numberfield',
            userCls: 'x-custom-field',
            label: 'Channel',
            required: true,
            disabled: true,
            bind: {
                value: '{intf.wirelessChannel}',
                disabled: '{!intf.enabled}'
            }
        }, {
            xtype: 'selectfield',
            userCls: 'x-custom-field',
            label: 'Encryption',
            required: true,
            autoSelect: true,
            disabled: true,
            options: [
                { text: 'None', value: 'NONE' },
                { text: 'WPA1', value: 'WPA1' },
                { text: 'WPA12', value: 'WPA12' },
                { text: 'WPA2', value: 'WPA2' }
            ],
            bind: {
                value: '{intf.wirelessEncryption}',
                disabled: '{!intf.enabled}'
            }
        }, {
            xtype: 'textfield',
            userCls: 'x-custom-field',
            label: 'SSID',
            required: true,
            disabled: true,
            bind: {
                value: '{intf.wirelessSsid}',
                disabled: '{!intf.enabled}'
            }
        }, {
            xtype: 'passwordfield',
            userCls: 'x-custom-field',
            name: 'password',
            label: 'Password',
            required: true,
            disabled: true,
            bind: {
                value: '{intf.wirelessPassword}',
                disabled: '{!intf.enabled}'
            }
        }]
    }]
});


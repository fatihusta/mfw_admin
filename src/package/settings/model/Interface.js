Ext.define('Mfw.model.v4Alias', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'v4Address', type: 'string' },
        { name: 'v4Prefix',  type: 'integer' }
    ]
});

Ext.define('Mfw.model.v6Alias', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'v6Address', type: 'string' },
        { name: 'v6Prefix',  type: 'integer' }
    ]
});

Ext.define('Mfw.model.DhcpOptions', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'enabled',     type: 'boolean' },
        { name: 'description', type: 'string' },
        { name: 'value',       type: 'string' }
    ]
});

Ext.define('Mfw.model.OpenVpnConfFile', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'encoding', type: 'string' },
        { name: 'contents', type: 'string' }
    ]
});

Ext.define('Mfw.model.WireguardPeer', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'publicKey',       type: 'string' },
        { name: 'allowedIps',      type: 'auto' },
        { name: 'host',            type: 'string' },
        { name: 'port',            type: 'integer' },
        { name: 'presharedKey',    type: 'string' },
        { name: 'keepalive',       type: 'integer' }, // seconds
        { name: 'routeAllowedIps', type: 'boolean' }
    ]
});


// Ext.define('Mfw.model.VrrpV4Alias', {
//     extend: 'Ext.data.Model',
//     idProperty: '_id',
//     identifier: 'uuid',
//     fields: [
//         { name: 'enabled', type: 'boolean' },
//         { name: 'description', type: 'string' },
//         { name: 'value', type: 'string' }
//     ]
// });

Ext.define('Mfw.model.Interface', {
    extend: 'Ext.data.Model',
    alias: 'model.interface',
    // idProperty: 'interfaceId',
    // identifier: {
    //     type: 'sequential',
    //     seed: 0
    // },
    fields: [
        { name: 'interfaceId', type: 'integer', allowNull: true },
        { name: 'name',        type: 'string', allowNull: false, allowBlank: false },
        { name: 'device',      type: 'string', allowNull: true },
        { name: 'wan',         type: 'boolean', allowNull: true },
        { name: 'qosEnabled',  type: 'boolean', allowNull: true },
        { name: 'hidden',      type: 'boolean', defaultValue: false },
        { name: 'type',        type: 'string' }, // ["NIC","VLAN","WIFI","OPENVPN","WIREGUARD","WWAN"]
        { name: 'configType',  type: 'string' }, // ["ADDRESSED","BRIDGED"]
        { name: 'enabled',     type: 'boolean', defaultValue: true },
        { name: 'addressSource', type: 'string', allowNull: true },

        { name: 'natEgress',  type: 'boolean', allowNull: true },
        { name: 'natIngress', type: 'boolean', allowNull: true },

        // IPv4
        { name: 'v4ConfigType',    type: 'string', allowNull: true }, // ["STATIC","DHCP","PPPOE","DISABLED"]
        // IPv4 STATIC
        { name: 'v4StaticAddress', type: 'string', allowNull: true },
        { name: 'v4StaticPrefix',  type: 'integer', allowNull: true }, // 1 - 32
        { name: 'v4StaticGateway', type: 'string', allowNull: true },
        { name: 'v4StaticDNS1',    type: 'string', allowNull: true },
        { name: 'v4StaticDNS2',    type: 'string', allowNull: true },
        // IPv4 Auto (DHCP) overrides
        { name: 'v4DhcpAddressOverride', type: 'string', allowNull: true },
        { name: 'v4DhcpPrefixOverride',  type: 'auto', allowNull: true }, // 1 - 32
        { name: 'v4DhcpGatewayOverride', type: 'string', allowNull: true },
        { name: 'v4DhcpDNS1Override',    type: 'string', allowNull: true },
        { name: 'v4DhcpDNS2Override',    type: 'string', allowNull: true },
        // IPv4 PPPoE
        { name: 'v4PPPoEUsername',     type: 'string', allowNull: true },
        { name: 'v4PPPoEPassword',     type: 'string', allowNull: true },
        { name: 'v4PPPoEUsePeerDNS',   type: 'boolean', allowNull: true },
        { name: 'v4PPPoEOverrideDNS1', type: 'string', allowNull: true },
        { name: 'v4PPPoEOverrideDNS2', type: 'string', allowNull: true },
        // ! hasMany v4Aliases

        // IPv6
        { name: 'v6ConfigType',       type: 'string', allowNull: true }, // ["DHCP","SLAAC","ASSIGN","STATIC","DISABLED"]
        // IPv6 STATIC
        { name: 'v6StaticAddress',    type: 'string', allowNull: true },
        { name: 'v6StaticPrefix',     type: 'integer', allowNull: true }, // 1 - 128
        { name: 'v6StaticGateway',    type: 'string', allowNull: true },
        { name: 'v6StaticDNS1',       type: 'string', allowNull: true },
        { name: 'v6StaticDNS2',       type: 'string', allowNull: true },
        // IPv6 DHCP overrides
        { name: 'v6DhcpDNS1Override', type: 'string', allowNull: true },
        { name: 'v6DhcpDNS2Override', type: 'string', allowNull: true },
        // IPv6 Assign
        { name: 'v6AssignHint',   type: 'string', allowNull: true },
        { name: 'v6AssignPrefix', type: 'integer', allowNull: true }, // 1 -128
        // ! hasMany v6Aliases

        { name: 'routerAdvertisements', type: 'boolean', allowNull: true },
        { name: 'bridgedTo',            type: 'integer', allowNull: true },
        { name: 'downloadKbps',         type: 'integer', allowNull: true },
        { name: 'uploadKbps',           type: 'integer', allowNull: true },
        { name: 'macaddr',              type: 'string', allowNull: true },

        // DHCP serving
        { name: 'dhcpEnabled',         type: 'boolean', allowNull: true },
        { name: 'dhcpRangeStart',      type: 'string', allowNull: true },
        { name: 'dhcpRangeEnd',        type: 'string', allowNull: true },
        { name: 'dhcpLeaseDuration',   type: 'integer', allowNull: true },
        { name: 'dhcpGatewayOverride', type: 'string', allowNull: true },
        { name: 'dhcpPrefixOverride',  type: 'integer', allowNull: true }, // 1 - 32
        { name: 'dhcpDNSOverride',     type: 'string', allowNull: true },
        // ! hasMany dhcpOptions

        // VRRP
        { name: 'vrrpEnabled',  type: 'boolean', allowNull: true },
        { name: 'vrrpID',       type: 'integer', allowNull: true }, // 1 - 255
        { name: 'vrrpPriority', type: 'integer', allowNull: true }, // 1 - 255
        // ! hasMany vrrpV4Aliases

        // WIFI
        { name: 'wirelessSsid',       type: 'string', allowNull: true },
        { name: 'wirelessEncryption', type: 'string', allowNull: true }, // ["NONE", "WPA1", "WPA12", "WPA2"]
        { name: 'wirelessMode',       type: 'string', allowNull: true }, // ["AP", "CLIENT"]
        { name: 'wirelessPassword',   type: 'string', allowNull: true },
        { name: 'wirelessChannel',    type: 'integer', allowNull: true },
        { name: 'wirelessThroughput', type: 'string', allowNull: true },

        // OpenVPN
        { name: 'openvpnUsernamePasswordEnabled', type: 'boolean', allowNull: true },
        { name: 'openvpnUsername',                type: 'string',  allowNull: true },
        { name: 'openvpnPasswordBase64',          type: 'string',  allowNull: true },
        { name: 'openvpnBoundInterfaceId',        type: 'string',  allowNull: true },
        // ! hasOne openvpnConfFile

        // wireguard
        { name: 'wireguardPrivateKey', type: 'string', allowNull: true },
        { name: 'wireguardAddresses',  type: 'auto', allowNull: true },
        { name: 'wireguardPort',       type: 'integer', allowNull: true },
        // ! hasMany wireguardPeers

        // WWAN
        { name: 'simNetwork', type: 'string', allowNull: true },
        { name: 'simApn', type: 'string', allowNull: true },
        { name: 'simProfile', type: 'integer', allowNull: true },
        { name: 'simPin', type: 'integer', allowNull: true },
        { name: 'simDelay', type: 'integer', allowNull: true },
        { name: 'simTimeout', type: 'integer', allowNull: true },
        { name: 'simAuth', type: 'string', allowNull: true }, // ["NONE", "PAP", "CHAP", "BOTH"]
        { name: 'simUsername', type: 'string', allowNull: true },
        { name: 'simPassword', type: 'string', allowNull: true },
        { name: 'simMode', type: 'string', allowNull: true }, // ["ALL", "WWAN", "UMTS", "GSM", "CDMA", "TDSCDMA"]
        { name: 'simPdptype', type: 'string', allowNull: true }, // ["IPV4", "IPV6", "IPV4V6"]
        { name: 'simPlmn', type: 'integer', allowNull: true },
        { name: 'simAutoconnect', type: 'boolean', allowNull: true },

        /**
         * object filled with interface status props
         * !!! persist flag as false avoids making record dirty !!!
         */
        { name: '_status', type: 'auto', allowNull: true, persist: false },

        /**
         * helper fields to convert Kbps to Mbps
         */
        { name: '_downloadMbps', type: 'number', allowNull: true, persist: false,
            calculate: function (data) {
                return data.downloadKbps ? data.downloadKbps/1000 : null;
            }
        },
        { name: '_uploadMbps', type: 'number', allowNull: true, persist: false,
            calculate: function (data) {
                return data.uploadKbps ? data.uploadKbps/1000 : null;
            }
        }, {
            name: '_icon',
            type: 'string',
            persist: false,
            calculate: function (data) {
                var icon = 'fa-signal';
                switch (data.type) {
                    case 'NIC': icon = 'fa-network-wired'; break;
                    case 'WIFI': icon = 'fa-wifi'; break;
                    case 'OPENVPN':
                    case 'VLAN': icon = 'fa-project-diagram'; break;
                    default:
                }
                return '<i class="x-fa ' + icon + '"></i>';
            }
        }
    ],

    hasMany: [{
        model: 'Mfw.model.v4Alias',
        name: 'v4Aliases',
        associationKey: 'v4Aliases'
    }, {
        model: 'Mfw.model.v6Alias',
        name: 'v6Aliases',
        associationKey: 'v6Aliases'
    }, {
        model: 'Mfw.model.DhcpOptions',
        name: 'dhcpOptions',
        associationKey: 'dhcpOptions'
    }, {
        model: 'Mfw.model.v4Alias',
        name: 'vrrpV4Aliases',
        associationKey: 'vrrpV4Aliases'
    }, {
        model: 'Mfw.model.wireguardPeer',
        name: 'wireguardPeers',
        associationKey: 'wireguardPeers'
    }],

    hasOne: [{
        model: 'Mfw.model.OpenVpnConfFile',
        name: 'openvpnConfFile',
        associationKey: 'openvpnConfFile'
    }],

    proxy: {
        type: 'ajax',
        api: {
            read: Util.api + '/settings/network/interfaces',
            update: Util.api + '/settings/network/interfaces'
        },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allowSingle: false, // wrap single record in array
            allDataOptions: {
                associated: true,
                persist: true
            },
            transform: {
                fn: Util.sanitize,
                scope: this
            }
        }
    },

    /**
     * Converts downloadKbps, uploadKbps from Mbps into Kbps
     * @param {String} fieldName
     * @param {Float} value
     */
    set: function(fieldName, value) {
        this.callParent(arguments);
        if (fieldName === '_downloadMbps') {
            this.set('downloadKbps', value * 1000);
        }
        if (fieldName === '_uploadMbps') {
            this.set('uploadKbps', value * 1000);
        }
    }
});


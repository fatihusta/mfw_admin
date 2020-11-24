/**
 * WireGuard interface options
 * shown only if interface type is WIREGUARD
 */
Ext.define('Mfw.settings.interface.WireGuard', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-wireguard',

    viewModel: {
        data: {
            activeCard: 'wg-conf',
            // the first peer of wg interface, populated on init
            peer: null,
            wireguardEditMode: 'MANUAL',
        },
        formulas: {
            // WireGuard has an array of interface addresses.
            // For the purpose of most of our implementaton, we only care about populating the first address.
            wireguardPrimaryAddress: {
                get: function (get){
                    return this.get('intf').wireguardAddresses().first() ? this.get('intf').wireguardAddresses().first().get('address') : '';
                },
                set: function(value){
                    this.get('intf').wireguardAddresses().first().set('address', value);
                }
            }
        }
    },

    scrollable: true,
    layout: 'vbox',

    items: [{
        xtype: 'formpanel',
        width: 400,
        bind: {
            flex: '{isDialog ? 1 : "auto"}'
        },
        items: [{
            xtype: 'component',
            padding: '16 0',
            style: 'font-weight: 100; font-size: 20px;',
            html: 'WireGuard VPN Configuration'
        },{
            xtype: 'containerfield',
            layout: 'hbox',
            defaults: {
                required: false,
                clearable: false
            },
            items:[{
                xtype: 'selectfield',
                label: 'Configuration Mode',
                required: true,
                autoSelect: true,
                hidden: true,
                flex: 1,
                options: [
                    { text: 'Import from clipboard', value: 'PASTE' },
                    { text: 'Manual', value: 'MANUAL' }
                ],
                bind: {
                    value: '{wireguardEditMode}',
                    hidden: '{intf.type !== "WIREGUARD"}',
                    required: '{intf.type === "WIREGUARD"}',
                    disabled: '{intf.type !== "WIREGUARD"}'
                },
            },{
                xtype: 'button',
                iconCls: 'x-far fa-copy',
                tooltip: 'Copy configuration to clipboard for remote connection',
                hidden: true,
                bind: {
                    hidden: '{wireguardEditMode != "MANUAL" || intf.type !== "WIREGUARD"}',
                },
                handler: 'copyConfiguration'
            }]
        }, {
            xtype: 'textfield',
            // label: 'Paste configuration from clipboard',
            margin: '0 0 32 0',
            placeholder: 'paste WireGuard configuration from clipboard here ...',
            clearable: false,
            autoComplete: false,
            labelAlign: 'top',
            flex: 1,
            bind: {
                hidden: '{wireguardEditMode != "PASTE" && intf.type == "WIREGUARD"}',
            },
            listeners: {
                paste: 'pasteConfiguration'
            }
        }, {
            xtype: 'container',
            bind: {
                hidden: '{wireguardEditMode != "MANUAL" && intf.type == "WIREGUARD"}',
            },
            items:[{
                xtype: 'fieldset',
                title: 'Local',
                margin: '0 0 32 0',
                items:[{
                    xtype: 'container',
                    margin: '0 0 0 -8',
                    layout: {
                        type: 'hbox',
                        align: 'bottom'
                    },
                    items: [{
                        /**
                         * the key is dummy generated in UI
                         * it should be retreived via an API status call (see MFW-940)
                         */
                        xtype: 'component',
                        flex: 1,
                        bind: {
                            html: '<div style="color: rgba(17, 17, 17, 0.54)">Public key</div>' +
                                        '<div style="color: #555; margin-top: 8px;">' +
                                        '{intf.wireguardPublicKey}' +
                                        '</div>',
                        }
                    }]
                },{
                    xtype: 'containerfield',
                    layout: 'hbox',
                    margin: '0 0 0 -8',
                    defaults: {
                        // flex: 1,
                        required: false,
                        clearable: false
                    },
                    items:[{
                        xtype: 'selectfield',
                        label: 'Type',
                        placeholder: 'Select type ...',
                        required: true,
                        autoSelect: true,
                        hidden: true,
                        options: [
                            { text: 'Roaming', value: 'ROAMING' },
                            { text: 'Tunnel', value: 'TUNNEL' }
                        ],
                        bind: {
                            value: '{intf.wireguardType}',
                            hidden: '{intf.type !== "WIREGUARD"}',
                            required: '{intf.type === "WIREGUARD"}',
                            disabled: '{intf.type !== "WIREGUARD"}'
                        },
                        listeners:{
                            select: 'wireguardTypeSelect'
                        }
                    },{
                        xtype: 'textfield',
                        label: 'Listen Port',
                        // margin: '0 0 0 -8',
                        clearable: false,
                        hidden: true,
                        bind: {
                            value: '{intf.wireguardPort}',
                            required: '{intf.type === "WIREGUARD"}',
                            hidden: '{intf.wireguardType !== "TUNNEL"}',
                            disabled: '{intf.type !== "WIREGUARD"}'
                        },
                        validators: 'port'
                    }]
                },{
                    xtype: 'textfield',
                    label: 'Interface IP address',
                    itemId: 'localInterfaceId',
                    margin: '0 0 0 -8',
                    placeholder: 'enter IP address ...',
                    clearable: false,
                    autoComplete: false,
                    labelAlign: 'top',
                    flex: 1,
                    bind: {
                        value: '{wireguardPrimaryAddress}',
                        required: '{intf.type === "WIREGUARD"}',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    },
                    validators: 'ipany'
                }]
            }, {
                xtype: 'fieldset',
                margin: '-16 0 0 0',
                title: 'Remote',
                items: [{
                    xtype: 'textfield',
                    name: 'publicKey',
                    label: 'Public key',
                    margin: '0 0 0 -8',
                    labelAlign: 'top',
                    clearable: false,
                    autoComplete: false,
                    placeholder: 'enter public key ...',
                    flex: 1,
                    bind: {
                        value: '{peer.publicKey}',
                        required: '{intf.type === "WIREGUARD"}',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    },
                    validators: [function (val) {
                        if (val.length !== 44 || val.indexOf(' ') >= 0) {
                            return 'Invalid base64 key value'
                        }
                        return true;
                    }]
                },{
                    xtype: 'container',
                    layout: 'vbox',
                    // margin: '0 0 32 0',
                    margin: '0 0 0 -8',
                    hidden: true,
                    bind: { hidden: '{intf.type !== "WIREGUARD"}' },
                    items: [{
                        xtype: 'containerfield',
                        layout: 'hbox',
                        defaults: {
                            flex: 1,
                            required: false,
                            clearable: false
                        },
                        items: [{
                            xtype: 'textfield',
                            name: 'host',
                            label: 'Endpoint IP address',
                            placeholder: 'enter address ...',
                            clearable: false,
                            autoComplete: false,
                            labelAlign: 'top',
                            flex: 1,
                            bind: {
                                value: '{peer.host}',
                                required: '{intf.type === "WIREGUARD"}',
                                disabled: '{intf.type !== "WIREGUARD"}'
                            },
                            validators: 'ipany'
                        }, {
                            xtype: 'textfield',
                            label: 'Endpoint Listen Port',
                            margin: '0 0 0 16',
                            clearable: false,
                            bind: {
                                value: '{peer.port}',
                                required: '{intf.type === "WIREGUARD"}',
                                disabled: '{intf.type !== "WIREGUARD"}'
                            },
                            validators: 'port'
                        }]
                    }]
                }, {
                    xtype: 'button',
                    margin: '16 0 0 -16',
                    bind: {
                        text: 'Allowed IP Addresses ({peer.allowedIps.count || "none"})',
                        disabled: '{intf.type !== "WIREGUARD"}'
                    },
                    ui: 'action',
                    handler: 'showPeerAllowedIpAddresses'
                }]
            }]
        }]
    }],

    controller: {
        init: function (view) {
            var vm = view.getViewModel(),
                intf = vm.get('intf');

            /**
             * because bindings cannot handle arrays
             * set a new bind on the unique first wireguard interface peer
             */
            vm.set('peer', intf.wireguardPeers().first());

            if(vm.get('isNew')){
                vm.set('wireguardEditMode', 'PASTE');
            }

            /**
             * because wireguard backend requires intf 'device' to be set
             * just gave it the same value as the name
             * only when creating a new interface!
             */
            if (vm.get('isNew')) {
                vm.bind('{intf.name}', function(name) {
                    intf.set('device', name);
                });
            }

            /**
             * attempt not to show field errors on form initialization
             * as the user hasn't done any input yet
             * - requires fields to have a "name"
             * - it should be done after the initial binding occurs (which triggers change event)
             * - it still requires a small delay to be effective
             */
            vm.bind('{intf}', function() {
                Ext.defer(function () { view.down('formpanel').clearErrors(); }, 50);
            });
        },
        /**
         * Generate dialog to allow editing of allowedIP networks.
         */
        showPeerAllowedIpAddresses: function () {
            var me = this;
            me.aliasesDialog = Ext.Viewport.add({
                xtype: 'interface-wireguard-allowedipaddresses',
                width: 500,
                height: 500,
                ownerCmp: me.getView()
            });
            me.aliasesDialog.show();
        },

        // In Roaming mode, can be bound to any WAN interface.
        // In Tunnel mode, must be bound to specific WAN.
        wireguardTypeSelect: function(component, newValue){
            var value = newValue.get('value');
            component.up('mfw-settings-network-interface').getViewModel().set('boundOptionsAllowAny', (value == 'ROAMING') ? true : false);
        },

        // Paste from a NGFW WireGuard copy to pasteboard.
        pasteConfiguration: function(component, options){
            var vm = component.up('mfw-settings-network-interface').getViewModel(),
                interface = vm.get('intf'),
                pasteData = options.event.clipboardData.getData("text/plain"),
                configured = false;

            try{
                // If in JSON format, build peer snippit.
                var jsonPasteData = JSON.parse(pasteData);
                var remote = ["[Peer]"]
                var endpoint = [];
                for( var key in jsonPasteData ){
                    if (jsonPasteData.hasOwnProperty(key)){
                        switch(key){
                            case 'hostname':
                                remote.push('# ' + jsonPasteData[key]);
                                break;
                            case 'publicKey':
                                remote.push('PublicKey=' + jsonPasteData[key]);
                                break;
                            case 'endpointAddress':
                                endpoint[0] = jsonPasteData[key];
                                break;
                            case 'endpointPort':
                                endpoint[1] = jsonPasteData[key];
                                break;
                            case 'networks':
                                remote.push('AllowedIps=' + jsonPasteData[key]);
                                break;
                        }
                    }
                }
                remote.push("Endpoint=" + endpoint.join(':'));
                pasteData = remote.join("\n");
            }catch(e){}

            // Process as a WireGuard configuration file format from the 
            // perspective that is intended for us (NGFW "Remote Client")
            var group = null;
            pasteData.split("\n").forEach( function(line){
                line = line.replace(/(\r\n|\n|\r)/gm,"");
                if(line.toLowerCase() == "[interface]"){
                    group = "local";
                }else if(line.toLowerCase() == "[peer]"){
                    group = "remote";
                }else{
                    // using split() on "=" will remove from target string even beyond a specifying
                    // the limit.  For example, this would remove the neccessary character in private key
                    // so use a manual split on = and space.
                    var delimeterIndex = line.indexOf('=');
                    if(delimeterIndex == -1){
                        delimeterIndex = line.indexOf(' ');
                    }
                    if(delimeterIndex > -1){
                        var key = line.substr(0, delimeterIndex).toLowerCase();
                        var value = line.substr(delimeterIndex + 1);
                        if(group == "local"){
                            switch(key){
                                case "privatekey":
                                    if(value == ""){
                                        Ext.toast('PrivateKey specified but no value; please verify PublicKey on both ends!', 3000);
                                    }else{
                                        /**
                                         * Get public key from private key.
                                         */
                                        Ext.Ajax.request({
                                            url: Util.api + '/wireguard/publickey',
                                            method: 'POST',
                                            params: Ext.JSON.encode({
                                                privateKey: value
                                            }),
                                            async: false,
                                            success: function (response) {
                                                var keypair = JSON.parse(response.responseText);
                                                interface.set('wireguardPrivateKey', keypair.privateKey);
                                                interface.set('wireguardPublicKey', keypair.publicKey);
                                                configured = true;
                                            },
                                            failure: function () {
                                            }
                                        });
                                    }
                                    break;
                                case "address":
                                    interface.wireguardAddresses().first().set('address', value);
                                    configured = true;
                                    break;
                                case "listenport":
                                    interface.set("wireguardType", "TUNNEL");
                                    interface.set("wireguardPort", parseInt(value,10));
                                    configured = true;
                                    break;
                                default:
                                    console.log("Unknown interface key:" + key);
                            }
                        }else if(group == "remote"){
                            var peer = interface.wireguardPeers().first();
                            switch(key){
                                case "publickey":
                                    peer.set('publicKey', value);
                                    configured = true;
                                    break;
                                case "endpoint":
                                    var endpoint = value.split(':');
                                    peer.set('host', endpoint[0]);
                                    peer.set('port', endpoint[1]);
                                    configured = true;
                                    break;
                                case "allowedips":
                                    var allowedIps = peer.allowedIps();
                                    allowedIps.removeAll();
                                    value.split(/[,]/).forEach(function(cidr){
                                        cidr = cidr.replace(/(\r\n|\n|\r)/gm,"");
                                        if(cidr != ""){
                                            cidr = cidr.split("/");
                                            allowedIps.add({
                                                address: cidr[0],
                                                prefix: cidr.length == 2 ? parseInt(cidr[1], 10) : 32
                                            });
                                        }
                                    });
                                    configured = true;
                                    break;
                                case "#":
                                    interface.set('name', value);
                                    configured = true;
                                    break;
                                default:
                                    console.log("Unknown peer key:" + key);
                            }
                        }
                    }
                }
            });

            if(configured){
                component.up('interface-wireguard').getViewModel().set('wireguardEditMode', 'MANUAL');
            }else{
                Ext.toast('No valid WireGuard settings found!', 3000);
            }
        },
        copyConfiguration: function(component){
            // What do do about NGFW and Javascript?
            var vm = component.up('mfw-settings-network-interface').getViewModel(),
                interface = vm.get('intf'),
                peer = interface.wireguardPeers().first();

            var address = interface.wireguardAddresses().first();
            var jsonData = {
                'host' : interface.get('name'),
                'publicKey' : interface.get('wireguardPublicKey'),
                'networks' : address.get('address') + "/" + address.get("prefix"),
            };
            if(interface.get('wireguardType') == 'TUNNEL'){
                var boundInterface = Ext.getStore('interfaces').findRecord('interfaceId', interface.get('boundInterfaceId'));
                if(boundInterface == null){
                    Ext.toast('Could not find bound interface!', 3000);
                    return;
                }else{
                    var address = '';
                    if(boundInterface.get('v4ConfigType')){
                        address = boundInterface.get('v4StaticAddress');
                    }else if(boundInterface.get('v6ConfigType')){
                        address = boundInterface.get('v6StaticAddress');
                    }
                    if(address != ''){
                        jsonData['endpointAddress'] = address;
                        jsonData['endpointPort'] = interface.get('wireguardPort');
                    }
                }
            }

            el = document.createElement('textarea'),
            el.value = JSON.stringify(jsonData);
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            el.select();
            // this executes the actual copy
            document.execCommand('copy');
            // remove the textarea helper
            document.body.removeChild(el);
        }
    },

});

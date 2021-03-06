/**
 * LTE options
 * shown only if interface type is WWAN
 */
Ext.define('Mfw.settings.interface.Lte', {
    extend: 'Ext.Panel',
    alias: 'widget.interface-lte',

    layout: 'fit',

    viewModel: {
        data: {
            /**
             * sim data collected from api status call api/status/wwan/:device
             */
            _simInfo: null,
            /**
             * keep original other network APN (if set) while changing networks
             */
            _originalOtherApn: ''
        },
        formulas: {
            /**
             * SIM details message
             */
            _simInfoMessage: function (get) {
                var simInfo = get('_simInfo');
                if (!simInfo) { return; }
                var message =
                    '<p style="font-size: 14px; font-weight: 600;">SIM Details</p>' +
                    '<ul>' +
                        '<li>IMEI: ' + (simInfo['imei'] || 'n/a') +  '</li>' +
                        '<li>IMSI: ' + (simInfo['imsi'] || 'n/a')  + '</li>' +
                        '<li>ICCID: ' + (simInfo['iccid'] || 'n/a') +  '</li>' +
                    '</ul>';
                return message;
            },

            /**
             * formula to set simNetwork null
             * selectfield does not support null value options
             */
            _simNetwork: {
                get: function (get) {
                    return get('intf.simNetwork');
                },
                set: function (value) {
                    var network = Ext.Array.findBy(Map.options.simNetworks, function (item) {
                        return item.value === value;
                    });
                    if (value !== 'OTHER') {
                        this.set('intf.simNetwork', value);
                        // set sim APN based on network
                        if (network.apn) {
                            this.set('intf.simApn', network.apn);
                        }
                    } else {
                        this.set('intf.simNetwork', null);
                        this.set('intf.simApn', this.get('_originalOtherApn'));
                    }
                }
            }
        }
    },

    items: [{
        xtype: 'container',
        scrollable: true,
        layout: 'hbox',
        items: [{
            xtype: 'formpanel',
            padding: '8 16 16 16',
            width: 400,
            bind: {
                flex: '{isDialog ? 1 : "auto"}'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 20px; font-weight: 100;',
                margin: '16 0',
                html: 'LTE Configuration'
            }, {
                xtype: 'containerfield',
                layout: 'hbox',
                defaults: {
                    flex: 1,
                    required: false,
                    clearable: false,
                    labelAlign: 'top'
                },
                items: [{
                    xtype: 'selectfield',
                    label: 'Network',
                    margin: '0 16 0 0',
                    maxWidth: '150',
                    options: Map.options.simNetworks,
                    placeholder: 'Select network provider ...',
                    forceSelection: true,
                    bind: {
                        value: '{_simNetwork}',
                        required: '{intf.type === "WWAN"}',
                        disabled: '{intf.type !== "WWAN"}'
                    }
                }, {
                    xtype: 'textfield',
                    label: 'APN',
                    margin: '0 0 0 16',
                    autoComplete: false,
                    placeholder: 'Enter APN ...',
                    bind: {
                        value: '{intf.simApn}',
                        required: '{intf.type === "WWAN" && intf.simNetwork !== "AT&T"}',
                        disabled: '{intf.type !== "WWAN" || (intf.simNetwork && intf.simNetwork !== "AT&T")}',
                        hidden: '{intf.simApn === "any"}'
                    }
                }]
            },
            // {
            //     xtype: 'numberfield',
            //     label: 'PIN',
            //     width: 100,
            //     hidden: true,
            //     clearable: false,
            //     autoComplete: false,
            //     bind: {
            //         value: '{intf.simPin}',
            //         hidden: '{intf.simNetwork}',
            //         disabled: '{intf.type !== "WWAN"}'
            //     },
            //     validators: [{
            //         type: 'length',
            //         min: 4,
            //         max: 4
            //     }]
            // }, {
            //     xtype: 'containerfield',
            //     layout: 'hbox',
            //     defaults: {
            //         xtype: 'textfield',
            //         flex: 1,
            //         required: false,
            //         clearable: false
            //     },
            //     items: [{
            //         label: 'Username',
            //         margin: '0 16 0 0',
            //         bind: {
            //             value: '{intf.simUsername}',
            //             hidden: '{intf.simNetwork}',
            //             disabled: '{intf.type !== "WWAN"}'
            //         }
            //     }, {
            //         label: 'Password',
            //         inputType: 'password',
            //         margin: '0 0 0 16',
            //         triggers: {
            //             reveal: {
            //                 type: 'trigger',
            //                 iconCls: 'x-fa fa-eye',
            //                 hidden: true,
            //                 bind: {
            //                     hidden: '{intf.simPassword.length === 0}',
            //                 },
            //                 handler: function (field, trigger) {
            //                     if (field.getDisabled()) {
            //                         return;
            //                     }
            //                     var inputType = field.getInputType();
            //                     if (inputType === 'password') {
            //                         field.setInputType('text');
            //                         trigger.setIconCls('x-fa fa-eye-slash');
            //                     } else {
            //                         field.setInputType('password');
            //                         trigger.setIconCls('x-fa fa-eye');
            //                     }
            //                 }
            //             }
            //         },
            //         bind: {
            //             value: '{intf.simPassword}',
            //             hidden: '{intf.simNetwork}',
            //             disabled: '{intf.type !== "WWAN"}'
            //         },
            //         validators: [{
            //             type: 'length',
            //             min: 8
            //         }]
            //     }]
            // },
            {
                // sim info
                xtype: 'component',
                style: 'color: #555; border: 1px #CCC solid; border-radius: 5px; padding: 5px 15px;',
                margin: '32 0 0 0',
                hidden: true,
                bind: {
                    html: '{_simInfoMessage}',
                    hidden: '{!_simInfo}'
                }
            }]
        }]
    }],

    controller: {
        init: function () {
            var me = this, vm = me.getViewModel(), device;
            vm.bind('{intf}', function (intf) {
                // MFW-494 - in case it's new interface does not exist
                if (!intf) {
                    return;
                }

                // MFW-789 - additional setting/status only if WWAN interface
                if (intf.get('type') === 'WWAN') {
                    if (!intf.get('simNetwork') && intf.get('simApn')) {
                        vm.set('_originalOtherApn', intf.get('simApn'));
                    }
                    device = intf.get('device');

                    if (!device) { return; }

                    Ext.Ajax.request({
                        url: '/api/status/wwan/' + device,
                        success: function (response) {
                            var resp = Ext.decode(response.responseText);
                            vm.set('_simInfo', resp);
                        },
                        failure: function () {
                            console.warn('Unable to get SIM info for device: ' + device);
                        }
                    });
                }
            }, me, {
                single: true
            });
        }
    }

});

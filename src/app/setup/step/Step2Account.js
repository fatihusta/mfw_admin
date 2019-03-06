Ext.define('Mfw.setup.step.Account', {
    extend: 'Ext.Panel',
    alias: 'widget.step-account',

    style: 'color: #555;',

    layout: {
        type: 'vbox',
        align: 'middle'
    },

    // bodyPadding: 24,

    items: [{
        xtype: 'component',
        width: 500,
        padding: '0 0 24 0',
        html: '<h1 style="text-align: center;">Admin Account</h1><hr/>'
    }, {
        xtype: 'formpanel',
        padding: 0,

        width: 300,
        // disabled: true,
        // bind: {
        //     disabled: '{skip.checked}'
        // },
        items: [{
            xtype: 'container',
            layout: {
                type: 'vbox',
                pack: 'right'
            },
            // flex: 1,
            defaults: {
                clearable: false,
                labelAlign: 'top',
                // labelTextAlign: 'right'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 14px;',
                html: 'Choose a new password for the <strong>admin</strong> account'
            }, {
                xtype: 'textfield',
                userCls: 'x-custom-field',
                id: 'password',
                animateUnderline: false,
                // ui: 'faded',
                name: 'password',
                // shadow: true,
                // width: 250,
                // ui: 'solo',
                label: 'Password',
                // labelAlign: 'top',
                // labelTextAlign: 'right',
                required: true,
                value: 'passwd'
            }, {
                xtype: 'passwordfield',
                userCls: 'x-custom-field',
                id: 'confirm',
                name: 'confirm',
                // width: 250,
                // ui: 'solo',
                label: 'Confirm',
                // labelAlign: 'top',
                required: true,
                value: 'passwd'
            }, {
                xtype: 'emailfield',
                userCls: 'x-custom-field',
                name: 'email',
                margin: '16 0 0 0',
                // width: 300,
                // ui: 'solo',
                label: 'Email',
            }, {
                xtype: 'component',
                style: 'color: #777; line-height: 1; padding: 3px;',
                html: 'Administrators receive email alerts and report summaries.'
            }, {
                xtype: 'button',
                margin: '16 0 0 0',
                width: 150,
                text: 'Continue',
                ui: 'action',
                handler: 'onContinue'
            }]
        }]
    }],

    listeners: {
        activate: 'onActivate'
    },

    controller: {
        init: function (view) {
            // set validation on confirm field
            var passField = view.down('#password'),
                confirmField = view.down('#confirm');

            confirmField.setValidators(function (value) {
                if (value !== passField.getValue()) {
                    return 'Passwords do not match!';
                }
                return true;
            });
        },

        onActivate: function (view) {
            var me = this;
            view.down('formpanel').reset(true);
            // me.loadTimezone();
        },

        loadTimezone: function () {
            var me = this,
                form = me.getView().down('formpanel');

            Ext.Ajax.request({
                url: '/api/settings/system/timeZone',
                success: function (result) {
                    var tz = Ext.decode(result.responseText);
                    if (!tz || tz === null) {
                        form.getFields('displayName').setValue('UTC');
                    } else {
                        form.getFields('displayName').setValue(tz.displayName || 'UTC');
                    }

                },
                failure: function () {
                    console.warn('Unable to load Timezone!');
                }
            });
        },


        setAccount: function () {
            var me = this,
                deferred = new Ext.Deferred(),
                adminAccount = Ext.create('Mfw.model.Account'),
                form = me.getView().down('formpanel');

            adminAccount.load({
                success: function (account) {
                    if (account && account.get('username') === 'admin') {
                        var values = form.getValues();
                        account.set('passwordCleartext', values.password);
                        account.set('email', values.email);
                        adminAccount.save({
                            success: function () {
                                deferred.resolve();
                            },
                            failure: function () {
                                deferred.reject();
                            }
                        });
                    } else {
                        // if account admin non existent add it
                    }
                }
            });
            return deferred.promise;
        },

        setTimezone: function () {
            var me = this,
                deferred = new Ext.Deferred(),
                form = me.getView().down('formpanel'),
                tz, tzName = tzName = form.getFields('displayName').getValue();

            tz = Ext.Array.findBy(Globals.timezones, function (zone) {
                return zone.text === tzName;
            });

            Ext.Ajax.request({
                url: '/api/settings/system/timeZone',
                method: 'POST',
                params: Ext.JSON.encode({
                    displayName: tz.text,
                    value: tz.value,
                }),
                success: function () {
                    deferred.resolve();
                },
                failure: function(response) {
                    console.log('server-side failure with status code ' + response.status);
                    deferred.reject();
                }
            });

            return deferred.promise;
        },

        onContinue: function (cb) {
            var me = this,
                wizard = me.getView().up('#wizard'),
                layout = wizard.getLayout();

            layout.next();
            // cb();
            // var me = this, // skip = me.lookup('skip'),
            //     form = me.getView().down('formpanel'),
            //     view = me.getView(),
            //     wizard = view.up('setup-wizard');

            // if (!form.validate()) { return; }

            // wizard.mask({xtype: 'loadmask' });
            // wizard.lookup('bbar').mask();

            // Ext.Deferred.sequence([me.setAccount, me.setTimezone], me)
            //     .then(
            //         function () {
            //             cb();
            //         }, function (error) {
            //             console.error('Unable to save!');
            //         })
            //     .always(function () {
            //         wizard.unmask();
            //         wizard.lookup('bbar').unmask();
            //     });
        }
    }


});

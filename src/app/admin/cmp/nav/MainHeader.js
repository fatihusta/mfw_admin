Ext.define('Mfw.cmp.nav.MainHeader', {
    extend: 'Ext.Toolbar',
    alias: 'widget.mfw-header',
    cls: 'nav',
    docked: 'top',
    zIndex: 999,
    padding: '0 0 0 16',

    items: [{
        xtype: 'component',
        // padding: '0 10',
        margin: '2 16 0 0',
        html: '<a href="#dashboard"><img src="/static/res/untangle-logo-w.svg" style="height: 36px;"/></a>',
        responsiveConfig: { large: { margin: '5 26 0 10', }, small: { margin: '5 26 0 0', } }
    }, {
        xtype: 'container',
        flex: 2,
        layout: 'hbox',
        defaultType: 'button',
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        defaults: {
            ripple: false,
            margin: '0 3'
        },
        items: [{
            text: 'DASHBOARD',
            ripple: false,
            // iconCls: 'x-fa fa-home',
            // iconCls: 'md-icon-dashboard',
            handler: function () { Mfw.app.redirectTo('dashboard'); },
            bind: {
                pressed: '{currentView === "dashboard"}'
            }
        }, {
            text: 'REPORTS',
            ripple: false,
            // iconCls: 'x-fa fa-area-chart',
            // iconCls: 'md-icon-show-chart',
            handler: function () { Mfw.app.redirectTo('reports'); },
            bind: {
                pressed: '{currentView === "reports"}'
            }
        }, {
            // text: 'MONITOR',
            text: 'SESSIONS',
            ripple: false,
            handler: function () { Mfw.app.redirectTo('sessions'); },
            bind: {
                pressed: '{currentView === "monitor"}'
            }
            // arrow: false,
            // iconCls: 'x-fa fa-desktop',
            // iconCls: 'md-icon-computer',
            // menu: {
            //     userCls: 'monitor-menu',
            //     border: false,
            //     width: 150,
            //     items: [{
            //         text: 'SESSIONS',
            //         iconCls: 'icon-monitor sessions',
            //         handler: function (item) { Mfw.app.redirectTo('monitor/sessions'); item.up('menu').hide(); }
            //     }
            //     // {
            //     //     text: 'HOSTS',
            //     //     iconCls: 'icon-monitor hosts',
            //     //     handler: function (item) { Mfw.app.redirectTo('monitor/hosts'); item.up('menu').hide(); }
            //     // }, {
            //     //     text: 'DEVICES',
            //     //     iconCls: 'icon-monitor devices',
            //     //     handler: function (item) { Mfw.app.redirectTo('monitor/devices'); item.up('menu').hide(); }
            //     // }, {
            //     //     text: 'USERS',
            //     //     iconCls: 'icon-monitor users',
            //     //     handler: function (item) { Mfw.app.redirectTo('monitor/users'); item.up('menu').hide(); }
            //     // }
            //     ]
            // }
        }, {
            text: 'SETTINGS',
            ripple: false,
            // iconCls: 'x-fa fa-cog',
            // iconCls: 'md-icon-settings',
            handler: function () { Mfw.app.redirectTo('settings'); },
            bind: {
                pressed: '{currentView === "settings"}'
            }
        }]
    }, '->', {
        text: 'New Upgrade!',
        iconCls: 'x-fa fa-download fa-3x fa-orange',
        iconAlign: 'top',
        arrow: false,
        menuAlign: 'tr-br?',
        style: 'font-weight: 500; font-size: 12px;',
        hidden: true,
        // responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        bind: {
            hidden: '{!upgradeCheck.available}'
        },
        menu: {
            userCls: 'monitor-menu',
            border: false,
            width: 250,
            defaults: {
                style: 'color: #FFF; font-size: 14px;',
            },
            padding: '8 8 16 8',
            items: [{
                xtype: 'component',
                // todo: add version number which currently is empty when calling /api/status/upgrade
                html: '<p>New version available!</p>'
                      // '<a href="#" style="color: #91e971; font-size: 14px; text-decoration: none;">View Changelog</a>'
            }, {
                xtype: 'button',
                margin: '0 16 16 16',
                text: 'UPGRADE NOW',
                ui: 'action',
                handler: function (btn) {
                    btn.up('menu').hide();
                    Util.upgradeNow();
                }
            },
            {
                xtype: 'container',
                layout: 'vbox',
                items: [{
                    xtype: 'component',
                    html: '<hr style="background: #555;"/>',
                    margin: '0 0 8 0'
                }, {
                    xtype: 'component',
                    bind: {
                        html: 'Automatic Upgrade is <strong>{autoUpgradeEnabled ? "Enabled" : "Disabled"}</strong>'
                    }
                }, {
                    xtype: 'component',
                    hidden: true,
                    bind: {
                        hidden: '{!autoUpgradeEnabled}',
                        html: '<br/><span style="font-size: 12px;">The upgrade process will start <strong>{autoUpgradeTime}</strong>.</span>'
                    }
                }, {
                    xtype: 'component',
                    margin: '8 0 0 0',
                    html: '<hr style="background: #555;"/>'
                }]
            }, {
                xtype: 'button',
                text: 'Go To Settings',
                handler: function (btn) {
                    btn.up('menu').hide();
                    Mfw.app.redirectTo('settings/system/upgrade');
                }
            }]
        }
    }, {
        text: 'Suggest Idea',
        iconCls: 'x-fa fa-lightbulb fa-3x fa-white',
        iconAlign: 'top',
        style: 'font-weight: 500; font-size: 12px;',
        hidden: true,
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        handler: 'showSuggest'
    }, {
        text: 'Help',
        iconCls: 'x-fa fa-question-circle fa-3x fa-white',
        iconAlign: 'top',
        style: 'font-weight: 500; font-size: 12px;',
        hidden: true,
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        handler: 'showHelp'
    }, {
        text: 'Logout',
        iconCls: 'x-fa fa-sign-out-alt fa-3x fa-white',
        iconAlign: 'top',
        style: 'font-weight: 500; font-size: 12px;',
        hidden: true,
        responsiveConfig: { large: { hidden: false, }, small: { hidden: true } },
        handler: 'logout'
    }, {
        iconCls: 'x-fa fa-bars fa-white',
        hidden: true,
        responsiveConfig: { large: { hidden: true, }, small: { hidden: false } },
        handler: 'showMenu'
    }],
    listeners: {
        painted: 'onPainted'
    },


    controller: {
        onPainted: function () {
            var me = this;
            me.checkForUpgrades();
            // fire resize event to trigger responsive config for the hamburger menu
            Ext.fireEvent('resize');
        },

        checkForUpgrades: function () {
            var me = this, vm = me.getViewModel(),
                upgradeSettings = {
                    enabled: true,
                    dayOfWeek: 6,
                    // timeOfDay: '18:20'
                    hourOfDay: 0,
                    minuteOfHour: 0
                };

            /**
             * Check for upgrades just once when the app loads,
             * this will be available at app level through viewmodel
            */
            Ext.Ajax.request({
                url: '/api/status/upgrade',
                success: function (response) {
                    var resp = Ext.decode(response.responseText);
                    vm.set('upgradeCheck', resp);
                },
                failure: function () {
                    console.error('Unable to get data');
                }
            });

            Ext.Ajax.request({
                url: '/api/settings/system/autoUpgrade',
                success: function (response) {
                    var resp = Ext.decode(response.responseText),
                        weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                        upgradeTime = new Date();

                    if (resp) {
                        upgradeSettings = resp;
                    }

                    upgradeTime.setHours(upgradeSettings.hourOfDay, upgradeSettings.minuteOfHour, 0, 0);

                    vm.set({
                        autoUpgradeEnabled: upgradeSettings.enabled,
                        autoUpgradeTime: weekDays[upgradeSettings.dayOfWeek] + ' at ' + Ext.Date.format(upgradeTime, 'h:i A')
                    });
                },
                failure: function () {
                    console.warn('Unable to get upgrade settings!');
                }
            });

        },


        logout: function () {
            Ext.Ajax.request({
                url: '/account/logout',
                callback: function () {
                    Mfw.app.setAccount(null);
                    Mfw.app.redirectTo('auth');
                    document.location.reload();
                }
            });
        },

        showMenu: function () {
            var me = this;
            if (!me.menu) {
                me.menu = Ext.Viewport.add({
                    xtype: 'mfw-menu',
                    ownerCmp: me.getView()
                });
            }
            me.menu.show();
        },

        showHelp: function () {
            var hash = window.location.hash;
            window.open(Mfw.app.supportUrl + hash.replace('#', '').replace(/\//g, '+').split('?')[0]);
        },

        showSuggest: function () {
            window.open(Mfw.app.feedbackUrl);
        }
    }
});

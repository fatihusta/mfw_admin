Ext.define('Mfw.dashboard.widget.ServerInfo', {
    extend: 'Ext.Container',
    alias: 'widget.widget-server-info',

    margin: 8,
    cls: 'mfw-widget',
    layout: 'vbox',

    maxWidth: 320,

    items: [{
        xtype: 'toolbar',
        style: { background: 'transparent' },
        docked: 'top',
        shadow: false,
        padding: '0 8 0 16',
        items: [{
            xtype: 'container',
            style: 'font-weight: 100;',
            bind: {
                html: '<span style="color: #333; display: inline-block;">Server Information</span>'
            }
        }, '->', {
            xtype: 'component',
            itemId: 'timer',
            margin: '0 5 0 0',
            hidden: true,
            bind: {
                hidden: '{widget.interval === 0}'
            }
        }, {
            iconCls: 'md-icon-refresh',
            ui: 'round',
            handler: 'reload'
        }]
    }, {
        xtype: 'container',
        userCls: 'info-widget',
        itemId: 'data',
        margin: 16
    }],
    listeners: {
        removed: function (widget) {
            if (widget.tout) {
                clearTimeout(widget.tout);
                widget.tout = null;
            }
            if (widget.timeIntervals) {
                clearInterval(widget.timeIntervals);
                widget.timeIntervals = null;
            }
        }
    },

    controller: {
        init: function (widget) {
            widget.tout = null;
            WidgetsPipe.add(widget);
        },

        getInfo: function () {
            var deferred = new Ext.Deferred();

            Ext.Ajax.request({
                url: '/api/settings/system',
                success: function (response) {
                    var info = Ext.decode(response.responseText);
                    deferred.resolve(info);
                },
                failure: function () {
                    deferred.reject('Unable to get info!');
                }
            });
            return deferred.promise;
        },

        getSystem: function () {
            var deferred = new Ext.Deferred();

            Ext.Ajax.request({
                url: '/api/status/system',
                success: function (response) {
                    var system = Ext.decode(response.responseText);
                    deferred.resolve(system);
                },
                failure: function () {
                    deferred.reject('Unable to get system!');
                }
            });
            return deferred.promise;
        },

        getHardware: function () {
            var deferred = new Ext.Deferred();

            Ext.Ajax.request({
                url: '/api/status/hardware',
                success: function (response) {
                    var hardware = Ext.decode(response.responseText);
                    deferred.resolve(hardware);
                },
                failure: function () {
                    deferred.reject('Unable to get hardware!');
                }
            });
            return deferred.promise;
        },

        getBuild: function () {
            var deferred = new Ext.Deferred(); // create the Ext.Deferred object

            Ext.Ajax.request({
                url: '/api/status/build',
                success: function (response) {
                    var build = Ext.decode(response.responseText);
                    deferred.resolve(build);
                },
                failure: function () {
                    deferred.reject('Unable to get build!');
                }
            });
            return deferred.promise;
        },

        readLicense: function () {
            var deferred = new Ext.Deferred(); // create the Ext.Deferred object

            Ext.Ajax.request({
                url: '/api/status/license',
                success: function (response) {
                    var license = Ext.decode(response.responseText);
                    deferred.resolve(license);
                },
                failure: function () {
                    // resolve even if error
                    deferred.resolve(null);
                }
            });
            return deferred.promise;
        },

        loadData: function (cb) {
            var me = this,
                widget = me.getView(),
                info,
                system,
                hardware,
                build,
                license,
                licenseText,
                shortBuildVersion,
                html = '';

            if (widget.timeIntervals) {
                clearInterval(widget.timeIntervals);
                widget.timeIntervals = null;
            }

            me.getView().mask({xtype: 'loadmask'});
            Ext.Deferred.sequence([me.getInfo, me.getSystem, me.getHardware, me.getBuild, me.readLicense], me)
                .then(function (result) {
                    info = result[0];
                    system = result[1];
                    hardware = result[2];
                    build = result[3];
                    license = result[4];

                    shortBuildVersion = build.pretty_name.split('-')[0];

                    if (!license || license.list.length === 0) {
                        licenseText = '<span style="color: red;">Not licensed</span>';
                    } else {
                        var seats = license.list[0].seats;
                        licenseText = (seats === 1000000 ? 'Unlimited' : seats + ' Mbps');
                    }

                    var boardName = Map.boards[hardware.boardName] || hardware.boardName;

                    // MFW-839 - hide undesired board name ('to-be-filled-by-o-e-m-to-be-filled-by-o-e-m')
                    if (boardName.includes('to-be-filled')) {
                        boardName = '-';
                    }

                    html = '<table style="font-size: 12px;" cellspacing="0" cellpadding="0">' +
                           '<tr><td style="width: 100px;">Board: </td><td>' + boardName + '</td></tr>' +
                           '<tr><td>Build: </td><td>' + shortBuildVersion + '</td></tr>' +
                           '<tr><td>Host: </td><td>' + info.hostName + '</td></tr>' +
                           '<tr><td>Domain: </td><td>' + info.domainName + '</td></tr>' +
                           // if setup was never run, timeZone might not be defined and it's assumed as UTC
                           '<tr><td>Time zone: </td><td>' + (info.timeZone ? info.timeZone.displayName : 'UTC') + '</td></tr>' +
                           '<tr><td>System Time: </td><td id="clock"></td></tr>' +
                           '<tr><td>Up Time: </td><td id="uptime"></td></tr>' +
                           '<tr><td>CPU(s): </td><td>' + hardware.cpuinfo.processors[0].model_name + '</td></tr>' +
                           '<tr><td>Memory: </td><td>' + parseInt(system.meminfo.mem_total/1000, 10) + 'M</td></tr>' +
                           '<tr><td>License: </td><td>' + licenseText + '</td></tr>' +
                           '</table>';
                    me.getView().down('#data').setHtml(html);


                    /**
                     * set time intervals for clock and uptime
                     * !!! important
                     * system date command might be inconsistent with what is displayed in dashboard
                     * because the system timezone seems to be inconsistent with timezone set in settings.json
                     * the below fix is forcing in the UI the timezone found in settings.json
                     */
                    me.setIntervals(moment(system.system_clock).tz(Mfw.app.tz.displayName), Math.round(system.uptime.total));

                    if (cb) { cb(); }
                }, function (error) {
                    console.warn('Unable to get info: ', error);
                })
                .always(function () {
                    me.getView().unmask();
                });
        },


        setIntervals: function (clock, uptime) {
            var me = this, widget = me.getView();
            document.getElementById('clock').innerHTML = clock.format('ddd, D MMM YYYY hh:mm:ss A');
            document.getElementById('uptime').innerHTML = Renderer.uptime(uptime);

            me.clock = clock;
            me.uptime = uptime;

            if (!widget.timeIntervals) {
                widget.timeIntervals = setInterval(function () {
                    me.setIntervals(me.clock.add(1, 'second'), me.uptime + 1);
                }, 1000);
            }
        },

        reload: function () {
            var me = this, widget = me.getView();
            WidgetsPipe.addFirst(widget);
        }
    }
});

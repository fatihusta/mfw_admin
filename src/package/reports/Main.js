Ext.define('Mfw.reports.Main', {
    extend: 'Ext.Panel',
    alias: 'widget.reports',

    layout: 'fit',

    controller: 'reports',

    config: {
        chart: null
    },

    viewModel: {
        data: {
            record: null,
            data: null,

            sinceHours: 24, // default graphs timeframe 24h
            sinceText: '1 day ago',

            globalFilter: '',
            recordsTotal: null,
            recordsFiltered: null,
            eventsMaxRows: 3000, // default 3000 events

            route: {
                cat: null, // report category
                rep: null, // report name
                psince: null, // predefined since, e.g. today, thisweek etc...
                since: null, // timestamp
                until: null, // timestamp
                conditions: [] // user conditions
            }
        }
    },

    items: [{
        xtype: 'toolbar',
        userCls: 'x-subbar',
        shadow: false,
        padding: 8,
        docked: 'top',
        /**
         * MFW-818
         * - added limits for EVENTS reports
         * - added timeframe for non EVENTS reprts (graphs)
         */
        items: [{
            xtype: 'button',
            hidden: true,
            bind: {
                text: 'Since: {sinceText}',
                hidden: '{!record || record.type === "EVENTS"}'
            },
            menu: {
                indented: false,
                mouseLeaveDelay: 0,
                defaults: {
                    handler: 'setSinceLimit',
                },
                items: [
                    { text: '6h ago', value: 6 },
                    { text: '12h ago', value: 12 },
                    { text: '1 day ago', value: 24 },
                    { text: '2 days ago', value: 48 },
                    { text: 'a week ago', value: 24 * 7 }
                ]
            }
        }, {
            xtype: 'button',
            hidden: true,
            bind: {
                text: 'Limit: {eventsMaxRows} events',
                hidden: '{!record || record.type !== "EVENTS"}'
            },
            menu: {
                indented: false,
                mouseLeaveDelay: 0,
                defaults: {
                    handler: 'setEventsLimit',
                },
                items: [
                    { text: '1000 events', value: 1000 },
                    { text: '3000 events', value: 3000 },
                    { text: '5000 events', value: 5000 },
                    { text: '10000 events', value: 10000 },
                    { xtype: 'menuseparator' },
                    {
                        xtype: 'numberfield',
                        // label: 'Custom limit:',
                        // labelAlign: 'top',
                        width: 150,
                        clearable: false,
                        placeholder: 'enter limit and hit <Enter>',
                        minValue: 1,
                        maxValue: 100000,
                        keyMapEnabled: true,
                        keyMap: {
                            enter: {
                                key: Ext.event.Event.ENTER,
                                handler: 'setCustomEventsLimit'
                            }
                        },
                        listeners: {
                            hide: function (menu) {
                                menu.down('numberfield').setValue('');
                            }
                        }
                    }
                ]
            }
        }, {
            xtype: 'toolbarseparator',
            hidden: true,
            bind: {
                hidden: '{!record}'
            }
        }, {
            xtype: 'conditions-fields'
        }, '->', {
            xtype: 'container',
            layout: {
                type: 'hbox',
                align: 'middle'
            },
            hidden: true,
            bind: {
                hidden: '{record.type !== "EVENTS"}'
            },
            items: [{
                xtype: 'component',
                style: 'font-size: 12px; color: #FFF; font-weight: 300;',
                margin: '0 16 0 0',
                bind: {
                    html: 'showing <b>{recordsFiltered}</b> of <b>{recordsTotal}</b>'
                }
            }, {
                xtype: 'searchfield',
                ui: 'alt',
                placeholder: 'global filter',
                width: 240,
                listeners: {
                    change: 'onGlobalFilterChange'
                }
            }]
        }]
    }, {
        xtype: 'panel',
        docked: 'left',
        width: 320,
        zIndex: 999,
        shadow: true,
        layout: 'fit',

        // resizable: {
        //     split: true,
        //     edges: 'east'
        // },

        items: [{
            xtype: 'treelist',
            cls: 'reports-tree',
            scrollable: true,
            ui: 'nav',
            style: {
                background: '#f5f5f5'
            },
            // micro: true,
            // selectable: {
            //     mode: 'single'
            // },

            animation: {
                duration: 150,
                easing: 'ease'
            },
            singleExpand: true,
            expanderFirst: false,
            expanderOnly: false,
            selectOnExpander: true,
            highlightPath: false,
            store: {
                type: 'reports-nav'
            },
            listeners: {
                selectionchange: 'onSelectionChange'
            }
        }],
        tbar: {
            shadow: false,
            padding: '0 8',
            items: [{
                xtype: 'searchfield',
                ui: 'faded',
                flex: 1,
                margin: '0 8 0 0',
                placeholder: 'Find report...'.t(),
                listeners: {
                    change: 'filterReports'
                }
            },
            // {
            //     // iconCls: 'md-icon-import-export',
            //     iconCls: 'x-fa fa-upload',
            //     tooltip: 'Export Reports',
            //     ui: 'round',
            //     arrow: false,
            //     handler: 'exportReports'
            //     // menuAlign: 'tr-br?',
            //     // menu: {
            //     //     items: [{
            //     //         text: 'Export',
            //     //         iconCls: 'x-fa fa-upload',
            //     //         handler: 'exportReports'
            //     //     }, {
            //     //         text: 'Import (not implemented)',
            //     //         iconCls: 'x-fa fa-download'
            //     //     }]
            //     // }
            // }
            ]
        }
    }, {
        xtype: 'report'
    }],

    listeners: {
        deactivate: 'onDeactivate'
    }
});

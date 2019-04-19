Ext.define('Mfw.model.table.Table', {
    extend: 'Ext.data.Model',
    alias: 'model.table',

    idProperty: '_id',
    identifier: 'uuid',
    fields: [
        { name: 'chain_type', type: 'string' },
        { name: 'family',     type: 'string' },
        { name: 'name',       type: 'string' }
    ],

    hasMany: {
        model: 'Mfw.model.table.Chain',
        name: 'chains',
        associationKey: 'chains'
    },

    proxy: {
        type: 'ajax',
        // api: {
        //     read: Util.api + '/settings/network',
        //     update: Util.api + '/settings/network'
        // },
        reader: {
            type: 'json'
        },
        writer: {
            type: 'json',
            writeAllFields: true,
            allDataOptions: {
                associated: true,
                persist: true
            },
            // sanitize data by removing extra UI generated keys
            transform: {
                fn: Util.sanitize,
                scope: this
            }
        }
    }
});

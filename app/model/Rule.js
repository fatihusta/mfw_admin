Ext.define('Mfw.model.Rule', {
    extend: 'Ext.data.Model',
    alias: 'model.rule',

    fields: [
        { name: 'ruleId', type: 'integer' },
        { name: 'enabled', type: 'boolean' },
        { name: 'description', type: 'string' }
    ],

    hasMany: [{
        model: 'Mfw.model.Condition',
        name: 'conditions',
        associationKey: 'conditions'
    }, {
        model: 'Mfw.model.Action',
        name: 'actions',
        associationKey: 'actions'
    }],

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
            }
        }
    }
});

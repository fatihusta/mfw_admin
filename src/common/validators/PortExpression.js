/**
 * Validates that the value is a proper Port value, range
 */
Ext.define('Ext.data.validator.PortExpression', {
    extend: 'Ext.data.validator.Validator',
    alias: 'data.validator.portexpression',

    type: 'portexpression',

    validate: function (value) {
        var matcher = new RegExp('^([0-9-, ]+)$'), // generic matcher
            portMatcher = new RegExp('^()([1-9]|[1-5]?[0-9]{2,4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$'),
            message,
            range;

        // if value expression contains invalid characters throw invalid
        if (!matcher.test(value)) {
            message = 'Invalid port value or range';
        }

        // remove all spaces
        value = value.replace(/ /g,'');

        // split value in expressions
        Ext.Array.each(value.split(','), function (expr) {

            // split expression if it's a range
            range = expr.split('-');

            if (range.length > 2) {
                message = 'Invalid port range: ' + expr;
            }

            Ext.Array.each(range, function (port) {
                if (!portMatcher.test(port)) {
                    message = 'Invalid port value: ' + port;
                }
            });

            // make sure range is valid, start range value smaller than end range value
            if (range.length === 2 && parseInt(range[0], 10) > parseInt(range[1], 10)) {
                message = 'Invalid port range: ' + expr;
            }
        });
        return message ? message : true;
    }
});

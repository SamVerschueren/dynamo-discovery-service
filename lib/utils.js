'use strict';

/**
 * Utility functions that can keep the code clean in the dds file.
 * 
 * @author Sam Verschueren      <sam.verschueren@gmail.com>
 * @since  14 Jul. 2015
 */
module.exports = {
    calcVersionId: function(version, adder) {
        adder = adder || 0;
        
        var splitted = version.toString().split('.'),
            major = this.tryParseInt(splitted[0], 0) + adder,
            minor = this.tryParseInt(splitted[1], 0);
        
        return major*1000000000 + minor;
    },
    tryParseInt: function(str, def) {
        return parseInt(str) || def;
    }
};
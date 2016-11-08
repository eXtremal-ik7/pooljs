/**
 * Created by Yury.Yurchik on 14.10.2016.
 */
Pool.portal.filter('power', function() {
    return function(val, power) {
        switch(power ? power.type : undefined) {
            case 'CPD':
            case 'MHS':
            case 'SOLS':
                return [
                    angular.isNumber(val) ? val / 1000 : val,
                    power.name
                ].join(' ');
            default:
                return val;
        }
    }
});
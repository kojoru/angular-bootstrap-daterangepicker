/**
 * @license ng-bs-daterangepicker-plus v0.1.0
 * (c) 2013 Konstantin Yakushev http://github.com/kojoru/ng-bs-daterangepicker
 * Originally by Luis Farzati
 * License: MIT
 */
(function (angular) {
'use strict';
var link = function($scope, $element, $attributes, ngModel, $compile, $parse){
    var options = {};
    options.format = $attributes.format || 'YYYY-MM-DD';
    options.separator = $attributes.separator || ' - ';
    options.minDate = $attributes.minDate && moment($attributes.minDate);
    options.maxDate = $attributes.maxDate && moment($attributes.maxDate);
    options.dateLimit = $attributes.limit && moment.duration.apply(this, $attributes.limit.split(' ').map(function (elem, index) { return index === 0 && parseInt(elem, 10) || elem; }) );
    options.ranges = $attributes.ranges && $parse($attributes.ranges)($scope);
    options.locale = $attributes.locale && $parse($attributes.locale)($scope);
    options.opens = $attributes.opens || 'right';

    function format(date) {
        return date.format(options.format);
    }

    function formatted(dates) {
        return [format(dates.startDate), format(dates.endDate)].join(options.separator);
    }

    ngModel.$formatters.unshift(function (modelValue) {
        if (!modelValue) return '';
        return modelValue;
    });

    ngModel.$parsers.unshift(function (viewValue) {
        return viewValue;
    });

    $scope.$watch($attributes.ngModel, function (modelValue) {
        if (!modelValue || (!modelValue.startDate)) {
            ngModel.$setViewValue({ startDate: moment().startOf('day').toDate(), endDate: moment().startOf('day').toDate() });
            return;
        }
        $element.data('daterangepicker').setStartDate(moment(modelValue.startDate));
        $element.data('daterangepicker').setEndDate(moment(modelValue.endDate));
        $element.data('daterangepicker').updateView();
        $element.data('daterangepicker').updateCalendars();
        $element.data('daterangepicker').updateInputText();
    });

    $element.daterangepicker(options, function(start, end) {
        $scope.$apply(function () {
            ngModel.$setViewValue({ startDate: start.toDate().setHours(0, 0, 0), endDate: end.toDate().setHours(23, 59, 59) });
        });
    });
};
angular.module('ngBootstrap.dateRangePicker', [])
    .directive('ngDaterange', ['$compile', '$parse', function ($compile, $parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function ($scope, $element, $attributes, ngModel) {
                link($scope, $element, $attributes, ngModel, $compile, $parse);
            }
        };
}]).directive('daterange',['$compile', '$parse', function ($compile, $parse) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function ($scope, $element, $attributes, ngModel) {
                link($scope, $element, $attributes, ngModel, $compile, $parse);
            }
        };
    }]).directive('input',['$compile', '$parse', function ($compile, $parse) {
        return{
            restrict: 'E',
            require: '?ngModel',
            link: function($scope, $element, $attributes, ngModel){
                if ($attributes.type !== 'daterange') return;
                link($scope, $element, $attributes, ngModel, $compile, $parse);
            }
        };
    }]);
})(angular);

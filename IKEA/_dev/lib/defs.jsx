﻿if (!Object.prototype.getProperties) {    Object.prototype.getProperties = function() {        var res = [];        for (var prop in this) {            try {                if (typeof(this[prop]) !== 'function') {                    res.push(prop);                }            } catch(e) {};        }        return res;    }}if (!Object.prototype.eachProperty) {    Object.prototype.eachProperty = function(callback) {        for (var prop in this) {            try {                if (typeof(this[prop]) !== 'function') {                    callback(this, prop);                }            } catch(e) {};        }    }}if (!Object.prototype.each) {    Object.prototype.each = function(callback) {        if (this instanceof Object) {            for (var prop in this) {                if (typeof(this[prop]) !== 'function') {                    callback(this[prop], prop, this);                }            }        }    }}if (!Array.prototype.each) {    Array.prototype.each = function(callback) {        if (this instanceof Array) {            for (var i=0; i<this.length; ++i) {                callback(this[i], i, this);            }        }    }}if (!Array.prototype.first) {    Array.prototype.first = function() {        if (this.length > 0)            return this[0];    }}if (!Array.prototype.last) {    Array.prototype.last = function() {        if (this.length > 0)            return this.slice(-1);    }}var disable_exceptions = true;var throwE = function(TypeError, message) {    if (disable_exceptions) {        alert(TypeError.name + ': ' + message);        return false;    }    throw new TypeError(message);}
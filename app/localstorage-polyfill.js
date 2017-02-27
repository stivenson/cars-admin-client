// I mean, seriously, localStorage is supported even by your mum. How about instead of
// casing the feature out, you give users in-memory (stale) storage instead?
// If they close your application, they deserve to lose data anyway.

if (!('localStorage' in window)) {
    window.localStorage = {
        _data       : {},
        setItem     : function(id, val) { return this._data[id] = String(val); },
        getItem     : function(id) { return this._data.hasOwnProperty(id) ? this._data[id] : undefined; },
        removeItem  : function(id) { return delete this._data[id]; },
        clear       : function() { return this._data = {}; }
    };
}
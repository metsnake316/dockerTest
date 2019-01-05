var MYLIBRARY = MYLIBRARY || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;
            // some other initialising
        },
        getLang : function(i) {
            return _args[i];
        }
    };
}());
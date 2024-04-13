const fr = (function(){
    return {
        isNoVal: function(value){
            return (value === undefined || value === null || value === NaN)
        },
        isFunction : function(value){
            return (!this.isNoVal(value) && value instanceof Function)
        },
        isEmpty : function(value) {
            return ( this.isNoVal(value) || 
            (this.isObject(value) && Object.keys(value).length === 0 ) || 
            (this.isArray(value) && value.length === 0 ) || 
            (this.isString(value) && value.trim().length === 0))
        },
        isArray: function(value){
            return !this.isNoVal(value) && Array.isArray(value)
        },
        isObject: function(value){
            return (typeof value === 'object' && value !== null && !this.isArray(value))
        },
        isString: function(value){
            return (typeof value === 'string')
        },
        getValueIfDefined: function(object, path, defValue){
            const _path = Array.isArray(path) ? path : path.split('.');
            if(object && _path.length)
                return this.getValueIfDefined(object[_path.shift()], _path, defValue);
            return object === undefined ? defValue : object;
        },
        isBoolean: function(val){
            return (typeof val === "boolean");
        },
        isNumber: function(val){
            return typeof val === 'number' && isFinite(n);
        },
        apply : function(iObj, cObj, defVal){
            try{
                if(defVal){
                    this.apply(iObj, defVal);
                }
                if(iObj && cObj && typeof cObj === 'object'){
                    for(var p in cObj){
                        iObj[p] = cObj[p];
                    }
                }
                return iObj;
            }catch(e){console.log('Error in apply: ', e)}
        },
        htmlEncode: function(value){
            return !value ? value : String(value).replace(/&/g, "&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/\\/g, "&bsol;").replace(/'/g,"&apos;");
        },
        htmlDecode: function(value){
            return !value || typeof value === 'object' ? value : String(value).replace(/&amp;/g,"&").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,'"').replace(/&bsol;/g,"\\").replace(/&apos;/g,"'");
        },

    }
})();

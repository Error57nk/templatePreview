class TEXT_INPUT{
    constructor(conf, callback){
        this.callback = fr.isFunction(callback) && callback;
        this.initConfig(conf || {});
        this.initDom();
        this.wrapper.comp = this;
        return this.wrapper;
    }
    initConfig(conf){
        this.compId = fr.getValueIfDefined(conf, 'compId', 'error57nk');
        this.iconLeft = fr.getValueIfDefined(conf, 'iconLeft', false);
        this.iconRight = fr.getValueIfDefined(conf, 'iconRight', false);
        this.label = fr.getValueIfDefined(conf, 'label', false);
        this.returnCnf = fr.getValueIfDefined(conf, 'returnCnf', {"returnConf": false});
        
        this.evBubbel = fr.getValueIfDefined(conf, 'evBubbel', false);
        this.inputConfig = fr.getValueIfDefined(conf, 'inputConfig', {type:'text', placeholder:'text'});
        
    }
    initDom(){
        const style = `.fr-main_wrap{border:1px solid #ccc;display:flex;justify-content:center;align-items:center}.fr-main_wrap .fr-wrap_icon{padding:0 3px;cursor:pointer}.fr-main_wrap .fr-input:focus-visible{outline:0;background:#cff399}.fr-main_wrap .fr-input{flex:1;border:unset;padding:0 5px;background:#f1f1f1;}`;
        if(!($('fr-inputStyle').length > 0)){
            const styleTag = `<style id="">${style}</style>`;
            $('body').append(styleTag);
        }
        let cl_id = " " + this.__getIdClass('input')
        let ipCnf = {...this.inputConfig};
        ipCnf['class'] = ipCnf.class ? ipCnf.class + cl_id : cl_id;
        this.wrapper = $('<div>', {id:this.compId, class: this.__getIdClass('main_wrap')});
        this.input = $('<input>', ipCnf);
        this.iconLeft && this.wrapper.append(this.__getIcon(this.iconLeft, 'left'));
        this.wrapper.append(this.input);
        this.iconRight && this.wrapper.append(this.__getIcon(this.iconRight, 'right'));
        this.__initInputEvent(this.input);
        return this.wrapper;
    }
    __getIcon(icoClass, icoOf){
        let icoWrap = $('<span>', {class:this.__getIdClass('wrap_icon')})
        let i = $('<i>', {class:this.__getIdClass('icon')})
        i.addClass(icoClass);
        icoWrap.append(i);
        icoWrap.off('click').on('click', this.eventFunnel.bind(this, icoOf, 'click'))
        return icoWrap;
    }
    __initInputEvent(input){
        input.off('keyup').on('keyup', this.eventFunnel.bind(this, 'input', 'keyup'))
        input.off('keydown').on('keydown', this.eventFunnel.bind(this, 'input', 'keydown'))
        input.off('blur').on('blur', this.eventFunnel.bind(this, 'input', 'blur'))
    }
    __getIdClass(stStr, postFix = false){
        postFix = postFix ? postFix : stStr;
        return this.compId + '_' + postFix + " fr-" + stStr;       
    }
    eventFunnel(evntOf, evType, ev){
        let value = evntOf;
        if(!this.evBubbel){
            // ev.preventDefault()
            ev.stopPropagation()
            ev.stopImmediatePropagation()
        }
        if(evntOf === 'input'){
            value = ev.target.value
        }
        console.log(value,  evType, this.returnCnf, ev);
        (evType === 'keyup') && fr.isFunction(this.onKeyUp) && this.onKeyUp(value, this.returnCnf, ev)
        (evType === 'keydown') && fr.isFunction(this.onKeyDown) && this.onKeyDown(value, this.returnCnf, ev)
        (evType === 'blur') && fr.isFunction(this.onBlur) && this.onBlur(value, this.returnCnf, ev)
        (evType === 'left' || evType === 'right') && fr.isFunction(this.onIconClick) && this.onBlur(evType , this.returnCnf, ev)

        fr.isFunction(this.callback) && this.callback(value,  evType, this.returnCnf, ev)
    }
    setValue(val){this.input.val(val)}
    getValue(){return this.input.val()}
    enable(isEnable=true){(typeof isEnable === "boolean") && this.input.prop('disabled', !isEnable);}
    hide(){this.wrapper.hide()}
    show(){this.wrapper.show()}    
}
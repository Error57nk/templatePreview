class ValueBox{
    constructor(tDom, config){
        this.initConfig(config)
        if(tDom.length > 0){
            this.targetDom = tDom;
            this.initDom(tDom);
        }
    }
    initConfig(cnf){
        this.UNIT_LIST = fr.getValueIfDefined(cnf, 'unitList', ['px','%','vh','vw','rem','ch']);
        this.defIpConfig = {key:'left', placeHolder:'left', defVal:'0', defUnit:'px', iconCls:'fas fa-arrow-circle-right'};
        this.INPUT_CONFG = fr.getValueIfDefined(cnf, 'inputConfig', false);
        this.INPUT_COUNT = fr.getValueIfDefined(cnf, 'totalInput', false);
        this.AUTO_SHOW = fr.getValueIfDefined(cnf, 'showInit', false);
        this.COMP_ID = fr.getValueIfDefined(cnf, 'compId', 'error57nk');
        
        this.onChnage = fr.getValueIfDefined(cnf, 'onValueChange', false);
        this.onEnter = fr.getValueIfDefined(cnf, 'onEnter', false);
        this.onBlur = fr.getValueIfDefined(cnf, 'onBlur', false);
    }
    initDom(tDom){
        let tInput = (this.INPUT_CONFG && this.INPUT_CONFG.length) || this.INPUT_COUNT || 1;
        this.compBox = $('<div>',{id:this.COMP_ID, class:'wrp_' + this.COMP_ID + ' ' + tInput + this.COMP_ID});
        this.inputListDom = {}
        for(let i=0; i < tInput; i++){
            let inputConf = (this.INPUT_CONFG && this.INPUT_CONFG[i]) || this.defIpConfig; 
            this.compBox.append(this.__getInputDom(i, inputConf, this.inputListDom))
        }
        tDom.append(this.compBox);
    }
    __getInputDom(idx, ipConf, domRefObj){
        let compBox = $('<div>',{class:'ipBx ipWrp_' + idx + ' key_' + ipConf.key});
        let icon = $('<i>',{class:'ipBxIcon ipWrpIcon_' + idx + ' ' + ipConf.iconCls});
        let span = $('<span>',{class:'ipBxIcon ipWrpIconBx_' + idx});
        let input = $('<input>',{class:'ipBxFld ipWrpFld_' + idx, value:ipConf.defVal});
        let select = $('<select>',{class:'ipBxUnit ipWrpUnit_' + idx});
        let selectOption = fr.getValueIfDefined(ipConf, 'unitOption', this.UNIT_LIST);
        this.__getSelectorOption(select, selectOption, ipConf.defUnit);
        span.append(icon)
        compBox.append(span, input, select);
        let dom = {compBox,span,icon,input}
        domRefObj[idx] = {dom, config: ipConf}
        let config = {...ipConf, domRefObj}
        this.attachEvent(input, select, config)
        return compBox;
    }
    attachEvent(input, select, cnf){
        if(input && input.length > 0){
            input.off('blur').on('blur', this.valueChnage.bind(this, 'blur', cnf))
            input.off('keyup').on('keyup', this.valueChnage.bind(this, 'keyup', cnf))            
        }
        if(select, select.length>0){
            select.off('change').on('change', this.valueChnage.bind(this, 'change', cnf)) 
        }
    }
    valueChnage(evType, cnf, ev){
        let value = ev.target.value;
        console.log(evType, cnf, value);
    }
    unitChange(cnf, ev){
        let value = $(ev).val();
        console.log(evType, cnf, value)
    }
    __getSelectorOption(pDom, optionList, defVal){
        optionList.forEach(op =>{
            let isSelected = (op === defVal);
            let opn = $('<option>', {text: op, value:op});
            isSelected && opn.attr('selected', true);
            pDom.append(opn)
        })
    }
    initEvent(){}
}
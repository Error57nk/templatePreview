
class AutoSuggest{
    domObj//parent root dom obj
    typingTimer    
    constructor(domSelector, config=false, onSelect = false){
        const tags ={srcResBox:'X2F1dG9SZXM=', compId:'ZnJfYXNf', boxTag:'X2J4', styleTag:'ZnJfc3R5bGU=', iconTag:'X2J4aW5wdXRfaWNvbg==',inputTag:'X2J4aW5wdXQ=',}
        for(let tg in tags){ this[tg] = atob(tags[tg])}
        this.domObj = $(domSelector)
        this.onSelect = fr.isFunction(onSelect)? onSelect : false;
        this.getAllConfig(config);


        if(this.domObj.length > 0){  
            this.init();               
        }else{this.logger("Invalid Dom:", domSelector)}       
        
    }
    getAllConfig(config = {}){
        
        this.doneTypingInterval = fr.getValueIfDefined(config,'doneTypingInterval', 300);
        this.isPannel = fr.getValueIfDefined(config,'isPannel', false);
        this.isCustomTemplate = fr.getValueIfDefined(config,'isCustomTemplate', false);
        this.isMultiSelect = fr.getValueIfDefined(config,'isMultiSelect', false);
        this.minSearchLen = fr.getValueIfDefined(config,'minSearchLen', 1);
        
        const data = fr.getValueIfDefined(config,'data', [{select:'select'}]);
        this.dataKey = fr.getValueIfDefined(config,'dataKey', false);
        this.dataVal = fr.getValueIfDefined(config,'dataVal', false);
        this.searchKeyList = fr.getValueIfDefined(config,'searchKeyList', false);
        this.placeHolder = fr.getValueIfDefined(config,'placeHolder', 'search');
        
        this.compUID = fr.getValueIfDefined(config, 'compId', false);
        this.style = fr.getValueIfDefined(config,'compStyle', 'compStyle');
        this.debug = fr.getValueIfDefined(config,'debug', true);
        

        
        this.setData(data, this.dataKey, this.dataVal, this.searchKeyList)
    }
    init(config = false){       
        
        this.searchResultBx = $('<div>', {class:this.getClass('srcResBox')});
        $('body').append(this.searchResultBx)
        this.#createInputBox(this.domObj);
        this.#createSearchPannel(this.searchResultBx);
        this.logger("Component Loaded.")
        
        if(!($('#' + this.getClass('styleTag', true)).length > 0)){
            $('body').append(`<style id="${this.getClass('styleTag', true)}">${this.__getStyle()}</style>`)
        }
    }
    __getStyle(){
        const st = `.${this.getClass('boxTag',true)}{position:relative}.${this.getClass('inputTag',true)}{width:100%}.${this.getClass('iconTag',true)}{position:absolute;top:50%;right:5px;transform:translateY(-50%)}.${this.getClass('srcResBox', true)} ul{overflow:hidden;overflow-y:auto;max-height:200px;background:#fff;box-shadow:1px 1px 3px #00000070;}.${this.getClass('srcResBox', true)} ul li{padding: 2px 7px;cursor:pointer;border-bottom:1px solid #ccc;margin-top:2px}.${this.getClass('srcResBox', true)} ul li:hover,.${this.getClass('srcResBox', true)} ul li.active{background:#ccc}`
        return st
    }
    #createInputBox(pObj){
        this.ipBox = $('<div>', {class: this.getClass('boxTag')})
        this.inputFld = $('<input>',{type:"text", class:this.getClass('inputTag'), placeholder: this.placeHolder});
        
        // adding event
        this.inputFld.keyup(this.keyUp.bind(this));
        this.inputFld.on('blur', (ev) => {
            this.hideShowSearchBox()
        });
        this.inputFld[0].addEventListener('keydown', (ev)=>{
            console.log("Evenet trigger --->", ev.key)
            let items = this.resultUl.find('li');
            let activeIndex = parseInt(this.resultUl.find('.active').attr('data-index'));
            let currIndex = activeIndex;
            if (ev.key === 'Enter') {
                this.#onOptionClick(ev);
            }else if (ev.key === 'ArrowUp' || ev.key === 'ArrowDown') {
                ev.preventDefault();
                if (ev.key === 'ArrowUp') {
                    currIndex = (activeIndex > 0) ? (currIndex - 1) : (items.length - 1) ;
                } else if (ev.key === 'ArrowDown') {
                    currIndex = (activeIndex < items.length - 1)? (currIndex + 1) : 0;
                }
                if (currIndex >= 0 && currIndex < items.length && currIndex != activeIndex) {
                    this.resultUl.find('.active').removeClass('active');
                    $(items[currIndex]).addClass('active');
                }
            }else{
                this.keyDown(ev);
            }
        });
          
        this.inputIco = $('<i>', {class:'fas fa-search ' + this.getClass('iconTag')})
        this.ipBox.append(this.inputFld,this.inputIco)
        pObj.append(this.ipBox)
    }
    getClass(tagId, onlyDef = false){
        let tag = fr.getValueIfDefined(this, tagId, tagId);
        let uCls = false
        !onlyDef && (uCls = (this.compUID === false) ? false : (this.compUID + tag));        
        return (this.compId + tag) + (uCls ? ' ' + uCls : '') 
    }
    keyUp(ev){
        if(ev.key === 'ArrowUp' || ev.key === 'ArrowDown' || ev.key === 'Enter'){return}
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(()=>{
            let val = ev.target.value
            this.logger(val)
            this.filterData(val)
        }, this.doneTypingInterval);
    }
    keyDown(ev){
        clearTimeout(this.typingTimer);
    }


    #createSearchPannel(pObj){
        pObj.addClass('d-none ');
        this.resultUl = $('<ul />',{class:'m-0 p-0'})
        pObj.append(this.resultUl)
        
    }
    filterData(val){
        if(val.length >= this.minSearchLen){
            if(this.isAjaxFilter){
                this.logger("Sending Request for Filter")
            }else{               
                let rt = this.dataMap.filter((obj)=>{
                    let rgex = new RegExp(`${val}`,'gi');
                    if(this.searchKeyList && fr.isArray(this.searchKeyList)){                        
                        return this.searchKeyList.some(kv => (kv in obj) && rgex.test(obj[kv]))
                    }else{
                        return rgex.test(obj[this.dataSetVal]);
                    }
                })
                // console.log(rt)
                this.currFilterData = rt;
                this.setPannelData(rt)
            }
        }
    }
    setData(dataArrObj, dKey = false, dVal = false, searchKeyList = false){
        this.dataMap = dataArrObj;
        this.dataSetKey = dKey ? dKey : ( dVal ? dVal : Object.keys(this.dataMap[0])[0]);
        this.dataSetVal = dVal ? dVal : ( dKey ? dKey : Object.keys(this.dataMap[0])[0]);
        this.searchKeyList = searchKeyList;
        if(this.isPannel){
            this.setPannelData();
            this.currFilterData = this.dataMap;
        }
    }
    getPostionCss(dom){
        let top = dom.offset().top;
        let left = dom.offset().left;
        let height = dom.outerHeight();
        let width = dom.outerWidth();
        top = top + height;        
        return {position:'absolute', top: top + 'px', left:left + 'px', width: width + 'px'}
    }
    setPannelData(setData = false){ 
        // position autosuggest at input
        let csRef = this.getPostionCss(this.inputFld);        
        this.searchResultBx.css(csRef);
        const mapData = (dataMap) => {            
            this.resultUl.html("")
            if(dataMap.length > 0){
                dataMap.forEach( (obj, index) => {
                    let key = obj[this.dataSetKey];
                    let val =  obj[this.dataSetVal];
                    let aclass = (index === 0) ? 'active' : '';
                    this.logger("KEY -> " + key + " VAL -> " + val)
                    let op = $('<li>',{class:aclass, title: val,'data-key': key, 'data-val': val,'data-index': index});
                    if(this.renderCustomTemplate && fr.isFunction(this.renderCustomTemplate)){
                        op.html(this.renderCustomTemplate(obj))
                    }else{
                        op.text(val);                       
                    }
                    op.off().on('mousedown', this.#onOptionClick.bind(this))
                    this.resultUl.append(op)
                });
            }else{
                $('<li>',{text:'No Result!'}).appendTo(this.resultUl);
            }            
        }       
        if(!setData){
            mapData(this.dataMap)
        }else{
            mapData(setData)
        }
        if(this.searchResultBx.hasClass('d-none')){
            this.hideShowSearchBox(true);   
        }
    }
    // renderCustomTemplate(data){
    //     let htmlTemp = `<div>${data['name']} | ${data['age']}</div>`;
    //     return htmlTemp;
    // }
    #onOptionClick(ev){
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        this.currSelected = this.resultUl.find('.active');
        let val = this.currSelected[0].dataset['val'];
        let key = this.currSelected[0].dataset['key'];
        let index = this.currSelected[0].dataset['index'];
        this.inputFld.val(val)
        if(!this.isMultiSelect){
            $('.opActive').removeClass('opActive');
        }        
        if(this.isPannel){
            this.currSelected[0].classList += "opActive"
        }else{
            this.hideShowSearchBox();            
        }
        this.selectedItem(val, key, this.currFilterData[index])
    }
    hideShowSearchBox(isShow = false){
        isShow ? this.searchResultBx.removeClass('d-none') : this.searchResultBx.addClass('d-none')
    }
    selectedItem(val, key, completeObj){
        let context = this
        this.resultValue = {val, key, completeObj, context}
        if(fr.isFunction(this.onSelect)){
            this.onSelect(val, key,completeObj, context)
        }
    }
    getSelected(){
        return this.resultValue || false;
    }
    logger(...args){ this.debug && console.log("AutoSuggest: ", args.join(' '))}
    
}


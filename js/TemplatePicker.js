class TemplatePicker{
    rootDom = null;
    isAppend = true;
    currRootDom = null;
    multipleInstance = false;
    constructor(){

    }
    launch(){
        if(this.rootDom){
            this.entryDom = this.rootDom;
            // Launch Dom At rootDom
        }else{
            if(this.entryDom && !this.multipleInstance){
              this.entryDom.remove()
            }
            this.entryDom = $('<div>');
            this.applyStyle(this.entryDom);
            $('body').append(this.entryDom);
        }
        this.#initDom();            
    }
    applyStyle(domObj, styConfig=false){
        // domObj.s
        if(!styConfig){
            let milliseconds = 1000
            domObj.css({height:'100%',width:'0px',background:'#ccc',position:'fixed',top:'0',right:'0'})
            // domObj.addClass('tmActive');
            // setTimeout(()=>), milliseconds);
            setTimeout(function(){domObj.addClass('tmActive')}, 10);
           
        }

    }
    #initDom(){

    }
}
import AttributeValues from "./AttributeValues.js";
import {Client,TypeaheadOptions} from 'getaddress-api/lib';
import { ResultsFailedEvent } from "./Events.js";


export default class Typeahead
{

    private filterTimer?: ReturnType<typeof setTimeout>
    private blurTimer?: ReturnType<typeof setTimeout>
    private list?: HTMLDataListElement;
   

    constructor(readonly input:HTMLInputElement,readonly client:Client,
        readonly attributeValues:AttributeValues)
    {
        
    }

    public destroy(){
        this.destroyInput();
        this.destroyList();
    }

    private destroyList()
    {
        if(this.list)
        {
            this.list.remove();
        }
    }

    private destroyInput(){

        this.input.removeAttribute('list');
        this.input.removeEventListener('focus',this.onInputFocus);
        this.input.removeEventListener('paste',this.onInputPaste); 
        this.input.removeEventListener('keydown', this.onKeyDown);
        this.input.removeEventListener('keyup', this.onKeyUp); 
        this.input.removeEventListener('input', this.onInput); 
    }

    private onInputFocus =  () => {
        
            this.input.select();
        
    };

    private onInputPaste = () => {
        setTimeout(()=>{this.populateList();},100);
    };

    
    public build()
    {

        this.input.setAttribute('list', `${this.attributeValues.listId}`);
        this.input.addEventListener('focus', this.onInputFocus);
        this.input.addEventListener('paste', this.onInputPaste);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('keyup', this.onKeyUp);
        this.input.addEventListener('input', this.onInput);

        this.list = document.createElement('DATALIST') as HTMLDataListElement;
        if(this.list)
        {
            this.list.id = this.attributeValues.listId;
        }
        
        this.input.insertAdjacentElement("afterend",this.list);
    }

    private onInput =(e:Event) => {
        if(this.list && (e instanceof InputEvent == false) && e.target instanceof HTMLInputElement)
        {
            const input = e.target as HTMLInputElement;
            
            Array.from(this.list.querySelectorAll("option"))
            .every(
                (o:HTMLOptionElement) => {
                    if(o.innerText === input.value){
                        this.handleSuggestionSelected(o);
                        return false;
                    }
                    return true;
                });
        }
    }

    private onKeyUp = (event:KeyboardEvent) => {
        this.debug(event);
        this.handleKeyUp(event);
    };  

    private onKeyDown = (event:KeyboardEvent) => {
        this.debug(event);
        this.handleKeyDownDefault(event);
    }; 

    private debug = (data:any)=>{
        if(this.attributeValues.options.debug){
            console.log(data);
        }
    };

   
    handleComponentBlur = (force: boolean = false) =>{
        
        clearTimeout(this.blurTimer);

        const delay: number = force ? 0 : 100;
        this.blurTimer = setTimeout(() => {
            this.clearList();
            
        }, delay);
    }



    handleSuggestionSelected = async (suggestion:HTMLOptionElement)=>{

        this.clearList();
    };

   

    handleKeyDownDefault = (event: KeyboardEvent)=>{
        
        let isPrintableKey = event.key && (event.key.length === 1 || event.key === 'Unidentified');
        if(isPrintableKey)
        {
            clearTimeout(this.filterTimer);
            
            this.filterTimer = setTimeout(() => 
            {
                this.populateList();

            },this.attributeValues.options.delay);
        }
       
    };

    

    handleKeyUp = (event: KeyboardEvent)=>{
        if(event.code === 'Backspace' || event.code === 'Delete')
        {
            if(event){
                const target =(event as Event).target
                if (target == this.input)
                {
                    this.populateList();
                } 
            }
        }
    };



    populateList = async ()=>{
            
            const options:Partial<TypeaheadOptions> = {};

            if(this.attributeValues.options?.search){
                options.search = this.attributeValues.options.search;
            }

            const query = this.input.value?.trim();
            const result = await this.client.typeahead(query, options);
            
            if(result.isSuccess){

                const success = result.toSuccess();
                const newItems:Node[] = [];

                if( this.list && success.results.length)
                {
                  
                    for(let i = 0; i< success.results.length; i++){
                        
                        const li = this.getListItem(success.results[i]);
                        newItems.push(li);
                    }

                    this.list.replaceChildren(...newItems);

                }
                else
                {
                    this.clearList(); 
                }
                
            }
            else
            {
                const failed = result.toFailed();
                ResultsFailedEvent.dispatch(this.input,query,failed.status,failed.message);
            }
    };

    
    clearList = ()=>
    {
        if(this.list)
        {
            this.list.replaceChildren(...[]);
        }
    };

    getListItem = (result:string)=>
    {
        const option = document.createElement('OPTION') as HTMLOptionElement;
        option.innerText = result;
        return option;
    };

    


}
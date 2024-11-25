import { Options } from "./Options.js";

export default class AttributeValues{
    
    readonly listId:string;
    readonly id_prefix?:string;
   

    constructor(readonly options:Options, index:number)
    {
        let suffix= "";
        if(index > 0)
        {
            suffix = `-${index}`;
        }

        this.id_prefix = options.id_prefix;
       
        this.listId = `${this.id_prefix}-list${suffix}`;
    }

  
    
}
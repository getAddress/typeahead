import { Options,SearchOn } from "./Options";
import Client from 'getaddress-api';

import AttributeValues from "./AttributeValues";
import Typeahead from "./Typeahead";

class InstanceCounter
{
    public static instances:Typeahead[] = [];

    static add(autocomplete:Typeahead){
        this.instances.push(autocomplete);
    }

}

export function typeahead(id:string, search_on:SearchOn|SearchOn[] , api_key:string)
{

    if(!id){
        return;
    }

    const allOptions = new Options();

    if(search_on instanceof Array)
    {
        allOptions.search = search_on;
    }
    else
    {
        allOptions.search = [search_on];
    }

    let textbox = document.getElementById(id) as HTMLInputElement;
    if(!textbox){
        textbox = document.querySelector(id) as HTMLInputElement;
    }
    if(!textbox){
        return;
    }
    
    const client = new Client(api_key);
    
    const index = InstanceCounter.instances.length;

    const attributeValues = new AttributeValues(allOptions,index);
    
    const typeahead = new Typeahead(textbox,client,attributeValues);
    typeahead.build();
    
    InstanceCounter.add(typeahead);
}

export function destroy()
{
    for(const instance of InstanceCounter.instances){
        instance.destroy();
    }
    InstanceCounter.instances = [];
}




export class ResultsFailedEvent 
{
    static dispatch(element:HTMLElement|Document, term:string,status:number, message:string){
        
        const evt  = new Event("getaddress-typeahead-results-failed",{bubbles:true});
        evt["status"] = status;
        evt["message"] = message;
        evt["term"] = term;
        element.dispatchEvent(evt);
    }
}


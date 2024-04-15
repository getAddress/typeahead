export type SearchOn = "postcode"| "locality"| "town_or_city"| "district"| "county"| "country";

export class Options 
{
    id_prefix?:string = "getAddress-typeahead";
    delay:number = 200;
    debug=false;
    search?:SearchOn[] = undefined;

    constructor(options:Partial<Options> = {})
    {
        Object.assign(this, options);
    }
}

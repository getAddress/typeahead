export type SearchOn = "postcode"| "line_1"| "line_2"| "line_3"| "locality"| "town_or_city"| "district"| "county"| "country";

export class Options 
{
    id_prefix?:string = "getAddress-typeahead";
    delay:number = 200;
    debug=false;
    search:SearchOn[] = undefined;

    constructor(options:IOptions = {})
    {
        for (const prop in options) {
            if (options.hasOwnProperty(prop) && typeof options[prop] !== 'undefined') {
                this[prop] = options[prop];
            }
        }
    }
}

export interface IOptions{
    id_prefix?:string;
    delay?:number;
    debug?:boolean;
    search?:SearchOn[];
}


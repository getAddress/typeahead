export type SearchOn = "postcode" | "locality" | "town_or_city" | "district" | "county" | "country";
export declare class Options {
    id_prefix?: string;
    delay: number;
    debug: boolean;
    search?: SearchOn[];
    constructor(options?: Partial<Options>);
}

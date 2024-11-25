import { SearchOn } from "./Options.js";
declare function typeahead(id: string, search_on: SearchOn | SearchOn[], api_key: string): void;
declare function destroy(): void;
export { typeahead, destroy, SearchOn };

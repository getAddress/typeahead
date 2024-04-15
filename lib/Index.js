import { Options } from "./Options";
import Client from 'getaddress-api';
import AttributeValues from "./AttributeValues";
import Typeahead from "./Typeahead";
class InstanceCounter {
    static add(autocomplete) {
        this.instances.push(autocomplete);
    }
}
InstanceCounter.instances = [];
export function typeahead(id, search_on, api_key) {
    if (!id) {
        return;
    }
    const allOptions = new Options();
    if (search_on instanceof Array) {
        allOptions.search = search_on;
    }
    else {
        allOptions.search = [search_on];
    }
    let textbox = document.getElementById(id);
    if (!textbox) {
        textbox = document.querySelector(id);
    }
    if (!textbox) {
        return;
    }
    const client = new Client(api_key);
    const index = InstanceCounter.instances.length;
    const attributeValues = new AttributeValues(allOptions, index);
    const typeahead = new Typeahead(textbox, client, attributeValues);
    typeahead.build();
    InstanceCounter.add(typeahead);
}
export function destroy() {
    for (const instance of InstanceCounter.instances) {
        instance.destroy();
    }
    InstanceCounter.instances = [];
}
//# sourceMappingURL=Index.js.map
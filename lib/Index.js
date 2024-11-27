import { Options } from "./Options.js";
import { Client } from 'getaddress-api';
import AttributeValues from "./AttributeValues.js";
import Typeahead from "./Typeahead.js";
class InstanceCounter {
    static add(autocomplete) {
        this.instances.push(autocomplete);
    }
}
InstanceCounter.instances = [];
function typeahead(id, search_on, api_key) {
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
function destroy() {
    for (const instance of InstanceCounter.instances) {
        instance.destroy();
    }
    InstanceCounter.instances = [];
}
export { typeahead, destroy };
//# sourceMappingURL=Index.js.map
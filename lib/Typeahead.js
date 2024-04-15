var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ResultsFailedEvent } from "./Events";
export default class Typeahead {
    constructor(input, client, attributeValues) {
        this.input = input;
        this.client = client;
        this.attributeValues = attributeValues;
        this.onInputFocus = () => {
            this.input.select();
        };
        this.onInputPaste = () => {
            setTimeout(() => { this.populateList(); }, 100);
        };
        this.onInput = (e) => {
            if (this.list && (e instanceof InputEvent == false) && e.target instanceof HTMLInputElement) {
                const input = e.target;
                Array.from(this.list.querySelectorAll("option"))
                    .every((o) => {
                    if (o.innerText === input.value) {
                        this.handleSuggestionSelected(o);
                        return false;
                    }
                    return true;
                });
            }
        };
        this.onKeyUp = (event) => {
            this.debug(event);
            this.handleKeyUp(event);
        };
        this.onKeyDown = (event) => {
            this.debug(event);
            this.handleKeyDownDefault(event);
        };
        this.debug = (data) => {
            if (this.attributeValues.options.debug) {
                console.log(data);
            }
        };
        this.handleComponentBlur = (force = false) => {
            clearTimeout(this.blurTimer);
            const delay = force ? 0 : 100;
            this.blurTimer = setTimeout(() => {
                this.clearList();
            }, delay);
        };
        this.handleSuggestionSelected = (suggestion) => __awaiter(this, void 0, void 0, function* () {
            this.clearList();
        });
        this.handleKeyDownDefault = (event) => {
            let isPrintableKey = event.key && (event.key.length === 1 || event.key === 'Unidentified');
            if (isPrintableKey) {
                clearTimeout(this.filterTimer);
                this.filterTimer = setTimeout(() => {
                    this.populateList();
                }, this.attributeValues.options.delay);
            }
        };
        this.handleKeyUp = (event) => {
            if (event.code === 'Backspace' || event.code === 'Delete') {
                if (event) {
                    const target = event.target;
                    if (target == this.input) {
                        this.populateList();
                    }
                }
            }
        };
        this.populateList = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const options = {};
            if ((_a = this.attributeValues.options) === null || _a === void 0 ? void 0 : _a.search) {
                options.search = this.attributeValues.options.search;
            }
            const query = (_b = this.input.value) === null || _b === void 0 ? void 0 : _b.trim();
            const result = yield this.client.typeahead(query, options);
            if (result.isSuccess) {
                const success = result.toSuccess();
                const newItems = [];
                if (this.list && success.results.length) {
                    for (let i = 0; i < success.results.length; i++) {
                        const li = this.getListItem(success.results[i]);
                        newItems.push(li);
                    }
                    this.list.replaceChildren(...newItems);
                }
                else {
                    this.clearList();
                }
            }
            else {
                const failed = result.toFailed();
                ResultsFailedEvent.dispatch(this.input, query, failed.status, failed.message);
            }
        });
        this.clearList = () => {
            if (this.list) {
                this.list.replaceChildren(...[]);
            }
        };
        this.getListItem = (result) => {
            const option = document.createElement('OPTION');
            option.innerText = result;
            return option;
        };
    }
    destroy() {
        this.destroyInput();
        this.destroyList();
    }
    destroyList() {
        if (this.list) {
            this.list.remove();
        }
    }
    destroyInput() {
        this.input.removeAttribute('list');
        this.input.removeEventListener('focus', this.onInputFocus);
        this.input.removeEventListener('paste', this.onInputPaste);
        this.input.removeEventListener('keydown', this.onKeyDown);
        this.input.removeEventListener('keyup', this.onKeyUp);
        this.input.removeEventListener('input', this.onInput);
    }
    build() {
        this.input.setAttribute('list', `${this.attributeValues.listId}`);
        this.input.addEventListener('focus', this.onInputFocus);
        this.input.addEventListener('paste', this.onInputPaste);
        this.input.addEventListener('keydown', this.onKeyDown);
        this.input.addEventListener('keyup', this.onKeyUp);
        this.input.addEventListener('input', this.onInput);
        this.list = document.createElement('DATALIST');
        if (this.list) {
            this.list.id = this.attributeValues.listId;
        }
        this.input.insertAdjacentElement("afterend", this.list);
    }
}
//# sourceMappingURL=Typeahead.js.map
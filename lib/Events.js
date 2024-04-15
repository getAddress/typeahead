export class ResultsFailedEvent {
    static dispatch(element, term, status, message) {
        const evt = new Event("getaddress-typeahead-results-failed", { bubbles: true });
        evt["status"] = status;
        evt["message"] = message;
        evt["term"] = term;
        element.dispatchEvent(evt);
    }
}
//# sourceMappingURL=Events.js.map
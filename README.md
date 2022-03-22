Javascript - Typeahead.

## Install

###  From NPM
```
npm install getaddress-typeahead
```
### Or CDN
```
<script src="https://cdn.getaddress.io/scripts/getaddress-typeahead-1.0.1.min.js"></script>
```

## Example Usage
```
  <label for="textbox_postcode" class="control-label">Postcode:</label>
  <input type="text" id="textbox_postcode" > 


  <script>
    getAddress.typeahead("textbox_postcode","postcode", "API Key or Domain Token");
  </script>

```
## Options
The full list of options, and their defaults:
```
getAddress.typeahead(
        'textbox_id',
         search_on: 'postcode|line_1|line_2|line_3|locality|town_or_city|district|county|country', /*the field to search on*/
        'API KEY or Domain Token'
        }
    );
```


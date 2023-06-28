# WIP: MMM-AQI

> **Warning**
> This module is in active development, it is not yet functional.

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Displays information from [World Air Quality Index project](https://aqicn.org/api/). This module will require a [free api key from AQICN](https://aqicn.org/data-platform/token/)

## Installation

In ~/MagicMirror/modules
```sh
git clone https://github.com/JHWelch/MMM-AQI.git
```
Install NPM dependencies
```sh
cd MMM-AQI
npm install
```

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'MMM-AQI',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option  | Description                                                                      |
| ------- | -------------------------------------------------------------------------------- |
| `token` | **Required** [Free token from AQICN.org](https://aqicn.org/data-platform/token/) |
| `city`  | **Required** The city for which to display the information                       |
<!-- | `updateInterval` | *Optional* Refresh time in milliseconds <br>Default 60000 milliseconds (1 minute) | -->

## Testing
There is a test suite using Jest.
```sh
npm test
```

# MMM-AQI

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

Simple display of AQI information from [World Air Quality Index project](https://aqicn.org/api/). This module will require a [free api key from AQICN](https://aqicn.org/data-platform/token/)

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

| Option           | Required?    | Description                                                            |
| ---------------- | ------------ | ---------------------------------------------------------------------- |
| `token`          | **Required** | [Free token from AQICN.org](https://aqicn.org/data-platform/token/)    |
| `city`           | **Required** | The city for which to display the information                          |
| `colorMode`      | *Optional*   | Color mode for the AQI display <br>Default `default` (color) See       |
| `updateInterval` | *Optional*   | Refresh time in milliseconds <br>Default 60000 milliseconds (1 minute) |

### Colors

You can update the color mode of the AQI display by setting the `colorMode` option. The following options are available:

| Option    | Description                                      |
| --------- | ------------------------------------------------ |
| `default` | Default AQI colors. Primary green/red/yellow.    |
| `dimmed`  | Dimmed AQI colors. Based on colors used by AQICN |

#### Custom Colors
You can fully customize the colors of the AQI display by overriding the following classes in your custom.css file. See the [MMM-AQI.css](MMM-AQI.css) file for the default values. Make sure to set `background-color` and `color` to override the default values.

```css
.aqi-label--good { /** set background-color & color */}

.aqi-label--moderate { /** set background-color & color */}

.aqi-label--sensitive { /** set background-color & color */}

.aqi-label--unhealthy { /** set background-color & color */}

.aqi-label--very-unhealthy { /** set background-color & color */}

.aqi-label--hazardous { /** set background-color & color */}
```

## Development

### Testing

There is a test suite using Jest.

```sh
npm test
```

### Linting
```sh
# Run linting
npm run lint

# Fix linting errors
npm run fix
```

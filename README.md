## Material Design Icons

This application uses Material Design Icons (https://materialdesignicons.com, https://github.com/google/material-design-icons). This library is available under the Apache 2.0 license, which can be obtained from http://www.apache.org/licenses/LICENSE-2.0.

## Config

config.json:

```jsonc
{
    "ssl": { // Only define this object if you want to use SSL
        "certificate": "", // Path to certificate. For LetsEncrypt, this file is called "fullchain.pem"
        "key": "" // Path to key. For LetsEncrypt, this file is called "privkey.pem"
    },

    "host": "", // Default: "localhost"
    "port": 0 // Default: 8080
}
```

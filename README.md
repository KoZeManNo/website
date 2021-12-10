# Website

The second version of my personal website, where visitors can change 9 background colors

## Config

config.json:

```jsonc
{
    "ssl": { // Only define this object if you want to use SSL
        "certificate": "", // Path to certificate. For LetsEncrypt, this file is called "fullcert.pem"
        "key": "" // Path to key. For LetsEncrypt, this file is called "privkey.pem"
    },

    "host": "", // Default: "localhost"
    "port": 0 // Default: 8080
}
```
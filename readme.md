# Xitanium Outdoor Driver Programmer Overlay

## Requirements

### node.js

Node.js is a server side software system designed for writing scalable
Internet applications in JavaScript.

  * __Version__: ~0.10.7
  * __Website__: http://nodejs.org/
  * __Download__: http://nodejs.org/download/
  * __Installation guide__: https://github.com/joyent/node/wiki/Installation

### AutoIt

AutoIt is a freeware BASIC-like scripting language designed for automating
the Windows GUI and general scripting.

  * __Version__: ~3.3.8.1
  * __Website__: http://autoitscript.com/
  * __Download__: http://www.autoitscript.com/site/autoit/downloads/

## Installation

Clone the repository:

```
git clone git://github.com/morkai/walkner-xiprog.git
```

or [download](https://github.com/morkai/walkner-xiprog/zipball/master)
and extract it.

Go to the project's directory and install the dependencies:

```
cd walkner-xiprog/
npm install
```

Give write permissions to `walkner-xiprog/data/` directory.

## Configuration

Configuration settings can be changed in the `backend/config.js` file.

  * `httpPort` - port on which the HTTP server should listen for requests.

  * `csvProfilesPath` - path to a directory with the CSV profile files.

  * `loadSaveDelay` - additional delay that should be added to the standard
    delay of the load/save profile AutoIt scripts.

  * `csvOptions` - CSV options used when exporting the history.

## Start

Start the application server in `development` or `production` environment:

  * under Windows:

    ```
    SET NODE_ENV=development
    node walkner-xiprog/backend/server.js
    ```

Application should be available on a port defined in `backend/server.js` file
(`1337` by default). Point the Internet browser to http://127.0.0.1:1337/.

## License

This project is released under the
[CC BY-NC 3.0](https://raw.github.com/morkai/walkner-xiprog/master/license.md).

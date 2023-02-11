# PQL for Visual Studio Code

## Features

Autoptic PQL is a functional language for timeseries data analysis. 

The extension provides syntax highlighting and runtime access to run PQL programs. You can edit,run and view results directly from Visual Studio Code.

## Install PQL extension
- [Download](https://raw.githubusercontent.com/autopticio/vscode-pql/main/downloads/pql-1.0.0.vsix) the extension from the Autoptic repository.
- Install the extension in VSCode
```
code --install-extension pql-1.0.0.vsix
```

## Setup
- Your dev environment needs access to https://autoptic.io, where the PQL APIs are hosted.
- Get a [PQL endpoint](https://www.autoptic.io#signup) and update the extension setting `pql.epid`.

## Getting started 
- Clone the [PQL program catalog](https://github.com/autopticio/catalog/tree/main/examples), `Open from Folder` in the VSCode editor.
- Update `env.json` in the workspace folder with data source configuration. 
- Open a .pql file in the VSCode editor 
- Select `PQL Run` from the VSCode `Command Palette` to run the program.  

## PQL Extension Settings

* `pql.epid`: Unique PQL Access endpoint ID.Get a [free endpoint](https://www.autoptic.io#signup)
* `pql.timeout`: PQL API https request timeout.

## Docs
- Check the [docs](https://github.com/autopticio/catalog) to learn more about PQL.
- Example PQL programs can be downloaded from the [catalog](https://github.com/autopticio/catalog/tree/main/examples).   

## Debug launch.json config example
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Run PQL",
            "program": "${command:pql.run}",
        }
    ]
}
```

## Release Notes

### 1.0.0

Initial release

---

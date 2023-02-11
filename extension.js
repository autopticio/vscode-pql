// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below

const vscode = require('vscode');
var http = require('https');
var path = require('path')
const fs = require('fs');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, "pql" extension is now active!');

    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('pql.run', function () {

        //vscode.window.showInformationMessage('Run PQL Run');
        //Create output channel
        let pqlOut = vscode.window.createOutputChannel("PQL");
        pqlOut.show(true);

        var message;
        if (vscode.workspace.workspaceFolders !== undefined) {

            let wf = vscode.workspace.workspaceFolders[0].uri;
            let varsUri = vscode.Uri.joinPath(wf, "env.json");
            let pqlUri = vscode.window.activeTextEditor.document.uri;
            var vars = fs.readFileSync(varsUri.fsPath, { encoding: 'base64' });
            var pql = fs.readFileSync(pqlUri.fsPath, { encoding: 'base64' });
            var epid = vscode.workspace.getConfiguration("pql").get("epid")
            var timeout = vscode.workspace.getConfiguration("pql").get("timeout")

            if (path.extname(pqlUri.fsPath) !== ".pql") {
                vscode.window.showErrorMessage(`${vscode.Uri.parse(pqlUri)} is not a PQL program. Program run skipped.`);
            } else {
                if (!epid) {
                    let setEP="Add Endpoint ID";
                    vscode.window.showInformationMessage("PQL extension setting 'epid' is not set. Program run skipped.",setEP)
                    .then(selection => {
                        if (selection === setEP) {
                            vscode.commands.executeCommand('workbench.action.openSettings', '@ext:autoptic.pql');
                        }
                    });
                } else {

                    var autopticPath = `/pql/ep/${epid}/run`;
                    var urlparams = {
                        host: 'autoptic.io',
                        port: 443,
                        path: autopticPath,
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json',
                        },
                        timeout: timeout,
                    };

                    try {
                        RunPQL(urlparams, `{"vars": "${vars}", "pql": "${pql}"}`, function (pqlResult) {
                            pqlOut.replace(pqlResult);
    
                            //save output in temp file in the workspace    
                            let outUri = vscode.Uri.joinPath(wf, ".out");
                            try {
                                JSON.parse(pqlResult);
                                outUri = vscode.Uri.joinPath(outUri, "result.json");
                            } catch (e) {
                                outUri = vscode.Uri.joinPath(outUri, "result.html");
                            }
                            vscode.workspace.fs.writeFile(outUri, new TextEncoder().encode(pqlResult));
    
                            let OpenDoc = 'Open in browser';
                            vscode.window.showInformationMessage(outUri.fsPath, OpenDoc)
                                .then(selection => {
                                    if (selection === OpenDoc) {
                                        vscode.env.openExternal(vscode.Uri.parse(outUri));
                                    }
                                });
                        })
                    } catch (err){
                        vscode.window.showErrorMessage(`Unable to run PQL at the moment.${err}`);
                    }
                }
            }
        }
        else {
            message = "PQL: Workspace folder not found, open a folder an try again";
            vscode.window.showErrorMessage(message);
        }

    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
    activate,
    deactivate
}

function RunPQL(options, req, callback) {

    function OnResponse(response) {
        var res = '';
        response.on('data', function (chunk) {
            res += chunk;
        });

        response.on('end', function () {
            return callback(res);
        });
    }
    var request = http.request(options, OnResponse);
    request.write(req);
    request.on('timeout', () => {
        request.destroy(new Error('PQL API request time out.'));
    });
    request.end();
}

'use strict';

var $ = global.jQuery = require('./lib/jquery.min.js');

var dialog = require('electron').remote.dialog;

var _require = require('electron'),
    shell = _require.shell;

var fs = require('fs');

var _require2 = require('electron'),
    ipcRenderer = _require2.ipcRenderer;

var zerorpc = require("zerorpc");
var client = new zerorpc.Client();
client.connect("tcp://127.0.0.1:4242");

var options = {
    width: 250,
    height: 400,
    quality: 20
};

var Stack = [];
var hstry = [];
var currentPlace;

$(document).ready(function () {

    $("#stack").on("click", function () {
        if (hstry.length > 0) {
            if (confirm("Save your sort?") == true) {
                order66();
                hstry = [];
            };
        };
        var path = dialog.showOpenDialog({ properties: ['openDirectory'] });
        if (path != undefined) {
            path = path[0];
            $("#stack").val(path);
            currentPlace = makePlace(path);
            var filelist = fs.readdirSync(path);
            setStack(filelist);
            $("#path").html(currentPlace.html);
        }
        UpdateCard();
    });

    document.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = e.dataTransfer.files[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var f = _step.value;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    });

    document.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
    });

    document.onkeyup = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 37) {
            $('#left').css('box-shadow', '0px 6px #777');
            $('#left').css('transform', 'translateY(0px)');
            SortItem(false);
        }
        if (evt.keyCode == 40) {
            $('#center').css('box-shadow', '0px 6px #777');
            $('#center').css('transform', 'translateY(0px)');
            undo();
            console.log('undobuttonpressed');
        }
        if (evt.keyCode == 39) {
            $('#right').css('box-shadow', '0px 6px #777');
            $('#right').css('transform', 'translateY(0px)');
            SortItem(true);
        }
    };

    document.onkeydown = function (evt) {
        evt = evt || window.event;
        if (evt.keyCode == 37) {
            $('#left').css('box-shadow', 'none');
            $('#left').css('transform', 'translateY(6px)');
        };
        if (evt.keyCode == 39) {
            $('#right').css('box-shadow', 'none');
            $('#right').css('transform', 'translateY(6px)');
        };
        if (evt.keyCode == 40) {
            $('#center').css('box-shadow', 'none');
            $('#center').css('transform', 'translateY(6px)');
        };
    };
});

function setStack(files) {
    Stack = [];
    for (item in files) {
        file = {};
        file.path = currentPlace.path + "/" + files[item];
        file.name = files[item];
        var fd = fs.openSync(file.path, 'r');
        var stats = fs.fstatSync(fd);
        file.dir = stats.isDirectory();
        if (stats.isFile() && file.name.charAt(0) != '.' || stats.isDirectory()) {
            Stack.unshift(file);
        }
    }
}

function makePlace(path) {
    place = {};
    place.path = path;
    pathElements = path.split('/');
    place.name = pathElements[pathElements.length - 1];
    place.html = '<li><p>' + place.name + '<p></li>';
    return place;
}

function order66() {

    if (history.length > 0) {
        for (x in hstry) {
            if (!hstry[x].keep) {
                var path = hstry[x].file.path;
                shell.moveItemToTrash(path);
            }
        }
    }
}

function undo() {
    console.log('undo');
    if (hstry.length > 0) {
        var unsortedfile = {};
        var sortedfile = hstry.pop();
        unsortedfile.name = sortedfile.file.name;
        unsortedfile.path = sortedfile.file.path;
        Stack.unshift(unsortedfile);
        UpdateCard();
    };
}

function SortItem(keep) {
    if (Stack.length > 0) {
        var sortedfile = {};
        sortedfile.keep = keep;
        sortedfile.file = Stack.shift();
        hstry.push(sortedfile);
        UpdateCard();
    };
}

function UpdateCard() {
    //ipcRenderer.send('closeIt');
    if (Stack.length > 0) {
        $("#currentFile").html("<h3>" + Stack[0].name + "</h3>");
        //ipcRenderer.send('previewIt',Stack[0].path);
        if (Stack[0].dir) {
            $('#preview').attr('src', "./img/folder.svg");
        } else {
            client.invoke("getPreview", Stack[0].path, function (error, res) {
                if (error) {
                    console.error(error);
                } else {
                    console.log(res);
                    $('#preview').attr('src', res);
                }
            });
        }
    } else {
        $("#currentFile").html("<h3> all done! </h3>");
    };
    //var file    = new File.createFromFileName(Stack[0].path);
}
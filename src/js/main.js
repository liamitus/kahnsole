// ----------------------------------------------------------------- Polyfill(s)

// Array.prototype.map
// Thanks to stackoverflow user Harry found at
// http://stackoverflow.com/a/16680415/1729686
(function(fn){
    if (!fn.map) fn.map=function(f){var r=[];for(var i=0;i<this.length;i++)if(this[i]!==undefined)r[i]=f(this[i]);return r}
    if (!fn.filter) fn.filter=function(f){var r=[];for(var i=0;i<this.length;i++)if(this[i]!==undefined&&f(this[i]))r[i]=this[i];return r}
})(Array.prototype);

// ------------------------------------------------------------------- Main code

(function () {

    var prompt = '> ';

    // Specifies the command line input; never trust user input.
    var commandLine;

    // Sepcifies a hidden copy of the text a user has entered so far,
    // which is used for resizing the textarea.
    var phantomUserInput;

    // Specifies where print should send the stuff it's printing.
    var output;

    // Wait until the page loads to kick things off.
    window.onload = function() {
        commandLine = el("command-line");
        phantomUserInput = el("phantom-user-input");
        output = el("out");

        focusOnTheCommandLine();
        document.body.addEventListener('click', focusOnTheCommandLine, true); 

        printToCommandLine(prompt);

        bindToTypingEvents(autoSize);

        autoSize();
    };

    // The user doesn't have to click to start typing when the page loads.
    function focusOnTheCommandLine() {
        commandLine.focus();
    }

    // Copy textarea contents; browser will calculate correct height of copy,
    // which will make overall container taller, which will make textarea taller.
    function autoSize() {
        var userInput = readCommandLine();
        var text = newlinesToBreaklines(userInput);
        if (text == '') {
            text = '<br />';
        }
        phantomUserInput.innerHTML = text;
    }

    // Event handling for sane browsers.
    function bind(event, func) {
        if (commandLine.addEventListener) {
            commandLine.addEventListener(event, function() {
                func();
            }, false);
        }
    }

    // IE-specific event handling.
    function bindInShittyBrowser(event, func) {
        if (commandLine.attachEvent) {
            commandLine.attachEvent(event, function() {
                func();
            }, false);
        }
    }

    // Event handling for sane browsers.
    function bindToTypingEvents(func) {
        bind('input', func);
        bind('keydown', func);
        bind('keyup', func);
        bindToTypingEventsInShittyBrowser(func);
    }

    // IE-specific event handling.
    function bindToTypingEventsInShittyBrowser(func) {
        bindInShittyBrowser('onpropertychange', func);
        bindInShittyBrowser('keydown', func);
        bindInShittyBrowser('keyup', func);
    }

    // ---------------------------------------------------- Command line reading

    // Listen for the enter/return key being pressed without the shift key.
    document.onkeydown = function(event) {
        if (event.keyCode == '13' && !event.shiftKey) {
            var userInput = readCommandLine();
            processUserInput(userInput);
            print(userInput);
            clear();
            printToCommandLine(prompt);
            return false;
        }
    };

    // Read the command line, duh.
    function readCommandLine() {
        var userInput = commandLine.value;
        return userInput;
    }

    // Clear the command line.
    function clear() {
        commandLine.value = '';
        phantomUserInput.innerHTML = '';
    }

    function processUserInput(userInput) {
        var processed = removePrompt(userInput);
        switch (processed) {
            case 'help':
                printHelp();
            break;
            default:
                if (processed) {
                print('Command not recognized.');
            }
        }
    }

    // ---------------------------------------------------- Command line actions

    function printHelp() {
        print('No help for you.',
              'Jk help is coming soon...');
    }

    // ---------------------------------------------------------- Helper methods

    // Retrieve the element matching the given query string.
    function el(query) {
        return document.getElementById(query) || document.querySelector(query);
    }

    // Log a message to the browser's console (if it has one).
    function log(message) {
        if (console && console.log) {
            console.log(message);
        }
    }

    // Prints some output to the screen.
    function print() {
        [].map.call(arguments, function (message) {
            log(message);
            var formatted = newlinesToBreaklines(message);
            output.innerHTML = formatted + '<br />' + output.innerHTML;
        });
    }

    function printToCommandLine() {
        [].map.call(arguments, function (message) {
            commandLine.value += message;
        });
    }

    function newlinesToBreaklines(text) {
        return text.replace(/\n/g, '<br/>');
    }

    function removePrompt(userInput) {
        return userInput.substring(prompt.length);
    }

})();

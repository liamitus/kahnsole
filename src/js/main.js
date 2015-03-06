(function () {

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
        var text = newlinesToBreaklines(commandLine.value);
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

    // Listen for the enter/return key being pressed.
    document.onkeydown = function(event) {
        if (event.keyCode == '13' && !event.shiftKey) {
            var userInput = readCommandLine();
            print(userInput);
            return false;
        }
    };

    // Read the command line, duh.
    function readCommandLine() {
        var userInput = commandLine.value;
        log(userInput);
        return userInput;
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
    function print(message) {
        var formatted = newlinesToBreaklines(message);
        output.innerHTML += formatted + '<br />';
    }

    function newlinesToBreaklines(text) {
        return text.replace(/\n/g, '<br/>');
    }

})();

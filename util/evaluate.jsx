#target "indesign"
#targetengine "medianis"
#strict on

$.evalFile('~/_scripts/frameworks/Extendables/extendables.jsx');

var ui = require("ui");

var Evaluate = Evaluate || (function() {
    if (! Evaluate.is_running) {
            
        function main() {
            var dialog;
            
            dialog = new ui.Palette('Evaluar expresión'); //.with(mixins);
            dialog.window.name = 'Evaluador de Expresiones';
            dialog.column('mainFrame').input('exp_edit');
            dialog.mainFrame.input('console');
            
            dialog.show();
        }

        main();
    };
    
    return { is_running: true };
})();


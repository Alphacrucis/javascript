/** IKEA Styles API
    Author: Javier Ramos
    
    Dependencies: extentables
    
    Apply indesign styles to IKEA articles
    */

#target "indesign"
#strict on

#include "~/_scripts/frameworks/Extendables/extendables.jsx"
#include "Lib_IKEAProducts.jsx"

// extends IKEA module with a submodule for styling capabilities
IKEA.Styles = IKEA.Styles || (function() {
    var exported = { name:'IKEA Styles submodule' };
    
    exported.createDefaultStyles = function(doc) {
        var default_styles = ['Articulo'];
        
        default_styles.forEach(function(style) {
            if (!doc.paragraphsStyles.item(style).isValid) {
                doc.paragraphsStyles.add({
                    name:style,
                    fontName: 'Verdana IKEA',
                    pointSize: 7.25, 
                    fontStyle: 'Normal', 
                    tracking:-40, 
                    kerningValue: 9.5

           }
       });
    };

    exported.applyStyles = function(el) {
        var style;

	exported.createDefaultStyles(  )

        // apply styles
        try {
            style = IKEA.paragraphStyle('Articulo', IKEA.PS_ARTICULO);
            el.paragraphs.everyItem().applyParagraphStyle(style);
            el.paragraphs.everyItem().clearOverrides();
        } catch(e) { $.writeln(e); }
        
        var applyStyles = function applyStyle(xmlE) {
            if (xmlE.markupTag.name === 'Article'){
                xmlE.children().forEach(applyStyle);
            } else {
                if (xmlE.markupTag.name === 'name'){
                    xmlE.words.everyItem().fontStyle = 'Bold';
                } else if (xmlE.markupTag.name === 'description'){
                    xmlE.words.everyItem().fontStyle = 'Bold';
                    collectionToArray(xmlE.words).forEach(function(w) {
                        w.contents = w.contents.toString().toLowerCase();
                    });
                } else if (xmlE.markupTag.name === 'price'){
                    xmlE.words.everyItem().fontStyle = 'Bold';
                    var word = xmlE.words.everyItem().getElements().filter(function(w) { 
                            return w.contents.indexOf(price_symbol) >= 0;
                        });
                } else {
                    xmlE.words.everyItem().fontStyle = 'Normal';
                }
            } 
        };
        
        el.children().forEach(applyStyle);
    }

    return exported;
})());

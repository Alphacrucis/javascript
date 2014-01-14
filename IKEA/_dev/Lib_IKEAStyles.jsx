/** IKEA Styles API
    Author: Javier Ramos
    
    Dependencies: extendables
    
    Apply indesign styles to IKEA articles
    */

#strict on

#include "~/_scripts/frameworks/Extendables/extendables.jsx"
#include "~/_scripts/frameworks/Underscore/LoDash.jsx"
#include "Lib_IKEAProducts.jsx"

// Extends IKEA module with a submodule for styling capabilities
// IKEA.Styles = IKEA.Styles || (function() {
IKEA.Styles = (function() {
    var self = this;
    
    var exported = { name:'IKEA Styles submodule' };
    
    exported.createDefaultStyles = function(doc) {
        var default_styles = ['Articulo'];
        
        doc = doc || app.activeDocument;

        default_styles.forEach(function(style) {
            if (!doc.paragraphStyles.item(style).isValid) {
                doc.paragraphStyles.add({ 
                    name:style, 
                    appliedFont: 'Verdana IKEA\tRegular', 
                    pointSize: 7.25, 
                    tracking: -40, 
                    kerningValue: 9.5 
                });
           }
       });
    };

    exported.style = function(name, doc) {
        doc = doc || app.activeDocument;
        
        if (!doc.paragraphStyles.item(name).isValid) {
            this.createDefaultStyles();
        }
    
        return doc.paragraphStyles.item(name);
    };

    exported.applyStyles = function(xmlElement) {
        // apply styles
        try {
            xmlElement.paragraphs.everyItem().applyParagraphStyle(this.style('Articulo'));
            xmlElement.paragraphs.everyItem().clearOverrides();
        } catch(e) { $.writeln(e); }
        
        xmlElement.children().forEach(_.bind(this.applyStyleToElement, this));
    }

    exported.applyStyleToElement = function(xmlElement) {
        var tagName = xmlElement.markupTag.name.toLowerCase();
        
        if (self.has_own('style_on_' + tagName)){
            self['style_on_'+tagName].call(this, xmlElement);
        } else {
            xmlElement.words.everyItem().fontStyle = 'Normal';
        }
    }

    //* Styling functions for each tag name  ********************************************
    
    this.style_on_article = function(xmlElement) {
        xmlElement.children().forEach(_.bind(this.applyStyleToElement, this));
    };

    this.style_on_name = function(xmlElement) {
        xmlElement.words.everyItem().fontStyle = 'Bold';
    };

    this.style_on_description = function(xmlElement) {
        xmlElement.words.everyItem().fontStyle = 'Bold';
        collectionToArray(xmlElement.words).forEach(function(w) {
            w.contents = w.contents.toString().toLowerCase();
        });
    };

    this.style_on_price = function(xmlElement) {
        var price, symbol = IKEA.price_symbol();
        
        xmlElement.words.everyItem().fontStyle = 'Bold';
        
        if (symbol) {
            price = xmlElement.words.everyItem().getElements().filter(function(w) { 
                return w.contents.toString().indexOf(symbol) >= 0;
            });
            price.forEach(function(w) {
                var s = w.contents.toString();
                w.contents = symbol + s.split(symbol).join('');
            });
        }
    };

    this.style_on_price = function(xmlElement) {
        var s = xmlElement.words.firstItem().contents.toString();
        s = s.slice(0,1).toUpperCase() + s.slice(1).rtrim();
        if (s.lastChar() === '.') {
            s = s.slice(0,-1)
        }
        xmlElement.words.firstItem().contents = s;
    };

    return exported;
})();

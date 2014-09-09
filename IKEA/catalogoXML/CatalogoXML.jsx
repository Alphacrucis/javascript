﻿/** IKEA Catalogo XML    Author: Javier Ramos    */#target "indesign"#targetengine "medianis"#script CatalogoXML#strict on/*  --------------------------    Manage all imports    -------------------------- */#include "lib/_imports.jsx"#include "lib/IKEAProduct_UI.jsx"// * --------------------------------------------------------------------------------------------------------/* Global palette window object */var palette;/* if there is a previous palette window, dispose it */if (!!palette) {    palette.close();    palette = undefined;    $.gc(); $.gc();}// * --------------------------------------------------------------------------------------------------------function main() {    try {        IKEA.Config.load();        IKEA.Styles.createDefaultStyles();        palette = main_ui();        palette.show();    } catch(e) { showError(e); }}// * --------------------------------------------------------------------------------------------------------/** Add a product as a XML Article to the target 'destine'. If product if not a Product object, use source    to load the resource from WebApp.    */function add_product(product, source, destine) {    /* TODO: si el destino ya está etiquetado, no volver a insertar */        if (product.constructor.name === 'String') {        product = IKEA.Product(product /* as code */, IKEA.getSource(source));     }            if (product.isValid) {        var target = destine || app.selection[0];        var created = false;                if (!target) {            target = app.activeWindow.activePage.textFrames.add({ geometricBounds:[0,0,30,210] });            created = true;        }            try {            target.contents = '';            var elem = IKEA.XML.append(product, target);            IKEA.Styles.apply(elem);        } catch(e) {             created && target.remove();             throw e;        }            return target;    }}// * --------------------------------------------------------------------------------------------------------function view_product(code, source) {    var product = IKEA.Product(code, IKEA.getSource(source));         IKEA.UI.show_product(product);}// * --------------------------------------------------------------------------------------------------------function process_all(target, source) {    if (app.documents.length === 0 || !app.activeWindow) {        var msg = { 'page':'ninguna página activa', 'spread':'ningún pliego activo', 'document':'ningún documento activo'}[target];        alert("ERROR: No hay " + msg);        return ;    }    _extend_collection(app.documents[0], 'Pages');    var pages = { 'page'    : [app.activeWindow.activePage],                   'spread'  : app.activeWindow.activeSpread.pages.toArray(),                   'document': app.activeDocument.pages.toArray()                }[ target ];        pages.forEach(function(page) {        var tframes = page.allPageItems.filter(function(tf){ return tf instanceof TextFrame; });                // preload all page products        // TODO: filtrar palabras ya etiquetadas        var codes = tframes.map(function(tf){             _extend_collection(tf, 'Words');            return tf.words.map(function(w){                 return w.contents.toString().match(IKEA.RE_LARGECODE);             });        }).flatten().compact();            if (!codes || codes.length === 0) { return ; }            try {            var product_cache = IKEA.Products(codes, IKEA.getSource(source));        } catch(e) { showError(e); return ; }                var pb = pbar("Generar Artículos para página " + page.name, "", tframes.length);            pb.show();                // for each textframe -> paragraphs (reversed) -> words (reversed)        tframes.forEach(function(tf){            try {                _extend_collection(tf, 'Paragraphs');                var ex = tf.paragraphs.length;                tf.paragraphs.forEachR(function(para, ix){                    var wcodes = collectionToArray(para.words);                    para.words.forEachR(function(word) {                        var code = word.contents.toString().match(IKEA.RE_LARGECODE);                        if (code && code.length > 0) {                            pb.display(code);                            var s;                            if (ex-ix > 1) {                                s = word.insertionPoints[0].contents;                                word.insertionPoints[0].contents = '\r';                            }                               try {                                var product = product_cache[code.toString()];                                add_product(product, source, word);                            } catch(e) {                                if (s) word.insertionPoints[0].contents = s;                                throw e;                            }                        }                        pb.step();                    });                });            } catch(e) {                 showError(e.message);             }        });            pb.close();    });}// * --------------------------------------------------------------------------------------------------------function main_ui() {    var buttonStyle     = 'preferredSize: [120, 24]';    var buttonStyleMini = 'preferredSize: [24, 24]';    var wr = """palette {         alignChildren: 'fill',        topGroup: Group {            source: DropDownList { helpTip: 'Indicar el origen de los datos' },            bFields: Button { text: '<>', #buttonStyleMini#                            , helpTip: 'Elegir qué campos importar' },        },        codePanel: Panel {            enabled: false,            lb1: StaticText { text: 'Código Artículo' },            partNumber: EditText { preferredSize: [ 120,24 ]},            bInsert: Button { text: 'Insertar', #buttonStyle#                             , enabled: false                             , helpTip:'Añadir el artículo indicado al documento, en la caja seleccionada o en una nueva.' },            bView: Button { text: 'Ver artículo', #buttonStyle#                           , helpTip:'Mostrar en una ventana los datos del artículo' },        },        doAllPanel: Panel {            enabled: false,            lb1: StaticText { text: 'Aplicar a todo' },            bAllPage    : Button { text: 'Página', #buttonStyle# },            bAllSpread  : Button { text: 'Pliego', #buttonStyle# },            bAllDocument: Button { text: 'Documento', #buttonStyle# },        },        bottomGroup: Group {            alignment: 'fill',            bClose   : Button { text:'Cerrar', preferredSize: [140, 24] }            bConfig  : Button { text: '(C)', #buttonStyleMini#                              , helpTip: 'Modificar Configuración' },        }    }""".replace(/#buttonStyle#/g, buttonStyle).replace(/#buttonStyleMini#/g, buttonStyleMini);    var wnd = new Window(wr);    IKEA.ORIGENES.forEach(function(source) {        wnd.topGroup.source.add('item', source.name);    });     wnd.activePanels = function() {        var enabled = wnd.topGroup.source.selection.text !== '';        wnd.codePanel.enabled = enabled;        wnd.doAllPanel.enabled = enabled;    };    wnd.topGroup.source.onChange = function() { wnd.activePanels(); };        wnd.cancelElement = wnd.bottomGroup.bClose;        wnd.codePanel.partNumber.onChanging = function() {        wnd.codePanel.bInsert.enabled = !!this.text && this.text !== '';    }        wnd.codePanel.bInsert.onClick = function() {         if (!!wnd.codePanel.partNumber.text) {            try_catch( function() {                add_product(wnd.codePanel.partNumber.text.replace(/\,/g,'.'), wnd.topGroup.source.selection.text);            });        }    };        wnd.codePanel.bView.onClick = function() {        if (!!wnd.codePanel.partNumber.text) {            try_catch( function() {                view_product(wnd.codePanel.partNumber.text.replace(/\,/g,'.'), wnd.topGroup.source.selection.text);            });        // try to find a product code in the active textframe        } else if (app.selection && app.selection[0].is(InsertionPoint)) {            var code = IKEA.scanFormatNumber(app.selection[0]);            if (code) {                view_product(code.replace(/\,/g,'.'), wnd.topGroup.source.selection.text);            }        }    };        wnd.doAllPanel.bAllPage.onClick = function() {         wnd.hide(); process_all('page', wnd.topGroup.source.selection.text); wnd.show();     }    wnd.doAllPanel.bAllSpread.onClick = function() {         wnd.hide(); process_all('spread', wnd.topGroup.source.selection.text); wnd.show();     }    wnd.doAllPanel.bAllDocument.onClick = function() {         wnd.hide(); process_all('document', wnd.topGroup.source.selection.text); wnd.show();     }//~     wnd.doXml.bSearch.onClick = function() {//~         search_xml_products();//~     };    // Prepare fields dialog    wnd.showFieldsDialog = function() {        var wr_fields = """dialog {            title: StaticText { text:'Información a incluir:' },            p : Panel {                alignChildren: 'fill',                alignment: 'left',            },            g : Group {                bAccept: Button { 'text': 'Aceptar', #buttonStyle# },                bCancel: Button { 'text': 'Cancelar', #buttonStyle# },            },        }""".replace(/#buttonStyle#/g, 'preferredSize: [90, 24]');                var wnd_f = new Window(wr_fields);        wnd_f.defaultElement = wnd_f.g.bAccept;        wnd_f.cancelElement = wnd_f.g.bCancel;        var conf = IKEA.Config.load();        var checkboxes = IKEA.Config.createCheckboxes( wnd_f.p );        wnd_f.g.bAccept.onClick = function() {            IKEA.Config.mapFromCheckboxes( checkboxes ).save();            wnd_f.close();        };        wnd_f.show();    };    wnd.topGroup.bFields.onClick = function() {        wnd.showFieldsDialog();    }        return wnd;}// * --------------------------------------------------------------------------------------------------------function search_xml_products() {    var xmlProduct = IKEA.XML.search(current('document'), { 'partnumber': '30239726' }); }// * --------------------------------------------------------------------------------------------------------function list_view(codes){    /** Given a list of product codes, show a list with the list and         load data from the Web Database     */    var buttonStyle = 'preferredSize: [120, 24]';    var wr = """palette {         alignChildren: 'fill',        codePanel: Panel {            list: ListBox {},        },        bClose : Button { text:'Cerrar', #buttonStyle# }    }""".replace(/#buttonStyle#/g, buttonStyle);        var wnd = new Window(wr);        codes.each(function(code){            });        return wnd;}// * --------------------------------------------------------------------------------------------------------main();
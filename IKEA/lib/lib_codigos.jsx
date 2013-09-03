﻿#include "~/_scripts/frameworks/Extendables/extendables.jsx"/*  IKEA_codigosLargos(doc)    -----------------------        Devuelve una objeto conteniendo de los códigos largos en el documento 'doc'*/function IKEA_codigosLargos(doc){    app.findGrepPreferences.appliedCharacterStyle = null;    app.findGrepPreferences.appliedParagraphStyle = null;    app.findGrepPreferences.findWhat = "\\d\\d\\d\\.\\d\\d\\d\\.\\d\\d";    var finds = app.activeDocument.findGrep();    return extraerInformacionCodigos(finds);}/*  IKEA_codigosCortos(doc)    -----------------------        Devuelve una objeto conteniendo de los códigos cortos ('almCOD') en el documento 'doc'*/function IKEA_codigosCortos(doc){    app.findGrepPreferences.appliedCharacterStyle = 'AlmCOD';    app.findGrepPreferences.appliedParagraphStyle = null;    app.findGrepPreferences.findWhat = "([\\l\\u](?-i)){3}([\\l\\u](?-i))?";    var finds = app.activeDocument.findGrep();    return extraerInformacionCodigos(finds);}function extraerInformacionCodigos(finds){    var arr = { length:0, codigos:[] };    for (var i=0, e=finds.length; i<e; ++i)    {        var code = finds[i].contents;        if (arr[code] == null)        {            arr[code] = [ finds[i] ];            arr.length++;                        arr.codigos.push(code);        } else {            arr[code].push( finds[i] );        }    }    return arr;}function ProgressBar(count, title) {    var rce = """window {                     orientation:'row', alignChildren:'bottom', text: 'PROGRESO',                     mainPanel: Panel {                         label1: StaticText { text: 'Progreso total', preferredSize:[375, 20], },                         pgBar1: Progressbar { text: '', preferredSize:[275, 10], },                         labelLog: StaticText { text: '', preferredSize:[275,20], },                     },                  }""";             this.wnd = new Window(rce);        count && this.wnd.mainPanel.pgBar1.maxvalue = count;    this.wnd.text = title ? title : "Progreso de la actividad";    this.setMax = function(m) { this.wnd.mainPanel.pgBar1.value = 0; this.wnd.mainPanel.pgBar1.maxvalue = m; };	this.step = function(msg) {        var f = false;        if (!app.scriptPreferences.enableRedraw) { app.scriptPreferences.enableRedraw = true; f = true; }                    this.wnd.mainPanel.pgBar1.value++;        if (msg) this.wnd.mainPanel.label1.text = msg;               if (f) app.scriptPreferences.enableRedraw = false;	}	this.show = function(msg) { if (msg) this.wnd.mainPanel.label1.text = msg; this.wnd.show(); }	this.close = function() { this.wnd.close(); }	this.hide = function() { this.wnd.hide(); }		return this;}var textFramesGrep = function(doc, re, pg) {        pg && pg.show("Buscando TextFrames en el documento");        pg && pg.setMax(doc.allPageItems.length);        return doc.allPageItems.filter(             function(pi) {                 pg && pg.step("TextFrame ID: " + pi.id);                return pi instanceof TextFrame && re.test(pi.contents);             } );    }function codeToNumber(code) { return Number(code.split('.').join('')); }function numberToCode(code) {     var ss = String(code);    while (ss.length < 10)        ss = '0' + ss;    return ss.slice(0,3) + '.' + ss.slice(3,6) + '.' + ss.slice(6);}function priceToNumber(price) {     if (!price) return "";        var ns = /(\D+)?(\d+(?:\.\d+)?)/.exec(price.replace(',','.'));     var n = "";    if (ns)         n = ns[2];    return Number(n);}function priceSplit(price) {     var ns = /(\D+)(\d+(?:\.\d+)?)(.*)/.exec(price.replace(',','.'));     return ns.slice(1)    if (ns) return ns.slice(1) else return "";}function formatPrice(price, decimals) {    try {        !decimals && decimals = 2;                var arr = priceSplit(price); // "US$", "12.2", "/ud."        arr[1] = parseFloat(Math.round(priceToNumber(price) * 100) / 100).toFixed(decimals).toString();                return arr.join('');     } catch(e) { return price; }}var rePrice = /\bUS\$.+?(?: |$)|\bRD\$.+?(?: |$)|\b\$.+?(?: |$)|\€\d+/gm;var reCode  = /\b\d{3}\.\d{3}\.\d{2}\b/gm;// Devuelve, para un TextFrame particular, una lista de pares codigo precio.function getCodePriceForTextFrame(textFrame) {    var r = [];    var trim = function(s) { return s.replace(/^\s+/,'').replace(/\s+$/,''); };    var codes = textFrame.contents.toString().match(reCode);    var prices = textFrame.contents.toString().match(rePrice);    var e = Math.max (codes ? codes.length : 0, prices ? prices.length : 0);    for (var i=0; i<e; ++i) {        var v1 = (codes && i < codes.length) ? codes[i] : "";        if (v1 == "")             continue;        var v2 = (prices && i < prices.length) ? prices[i] : "";        r.push([trim(v1), trim(v2)]);    }    return r;}// Devuelve, para un TextFrame particular, una lista de pares codigo precio y sus objetos Word de indesign asociadosfunction getIKEACodePricePairs2(textFrame) {    var r = [];    var trim = function(s) { return s.replace(/^\s+/,'').replace(/\s+$/,''); };    var codes = textFrame.contents.toString().match(reCode);    var prices = textFrame.contents.toString().match(rePrice);        if (codes)    {        if (codes.length !== prices.length)            $.writeln("Error en TextFrame ID: " + textFrame.id);                var e = Math.max (codes ? codes.length : 0, prices ? prices.length : 0);        for (var i=0; i<e; ++i) {            var vcode = (codes && i < codes.length) ? trim(codes[i]) : "";            if (vcode == "") continue;            var vprice = (prices && i < prices.length) ? trim(prices[i]) : "";                        var wcode=null, wprice=null;            for (var j=0, je=textFrame.words.length; j<je; ++j) {                var sc = textFrame.words[j].contents.toString().match(reCode);                if (sc && trim(sc.toString()) == vcode)                    { wcode = textFrame.words[j]; if (wprice) break; }                var sp = textFrame.words[j].contents.toString().match(rePrice);                if (sp && trim(sp.toString()) == vprice)                    { wprice = textFrame.words[j]; if (wcode) break; }            }            if (wcode)                r.push([vcode, vprice, wcode, wprice]);        }    }    return r;}function getIKEACodePricePairs(textFrame) {    var r = [];    var trim = function(s) { return s.replace(/^\s+/,'').replace(/\s+$/,''); };    var isDigit = function(c) { return /\d|,|\./.test(c.contents); };        if ( reCode.test(textFrame.contents.toString()) ) {        var wcode, wprice;        var words = textFrame.words.everyItem().getElements();                words.forEach( function(word) {            var debug_word = word.contents;            if ( trim(word.contents.toString()).match(reCode) && wprice != null )                 wcode = word;            else if ( trim(word.contents.toString()).match(rePrice) )                 wprice = word;                    if (wcode && wprice) {                var price = wprice.contents;                try {                    var p;                    var cs = wprice.characters.everyItem().getElements();                    for (var i=0; i<cs.length; ++i)                        if (isDigit(cs[i]) && cs[i].position == Position.SUPERSCRIPT) {                            p = i;                            break;                        }                                    if (p != undefined)                         price = price.slice(0, i) + '.' + price.slice(i) ;                } catch(e) {} ;                                r.push([wcode.contents, price, wcode, wprice]);                wcode = null;                wprice = null;            }        } );    }    return r;}
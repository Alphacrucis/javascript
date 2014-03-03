﻿/** IKEA Catalogo XML    Author: Javier Ramos        */#strict on// Extends IKEA module with a submodule for styling capabilitiesIKEA.XML = (function() {    var self = this;        var exported = { name:'IKEA submodule: XML' };    /* ------------------------------------------------------------------------------ */    exported.getRoot = function(doc){        return ((!doc) ? app.activeDocument.xmlElements : doc.xmlElements).item(0);    };        /* ------------------------------------------------------------------------------ */    exported.add = function(root, name, attrs, dest) {        /*  root -> xmlElement root of this one            name -> tag name of the xmlElement            attrs -> array of { name: value } properties            */        if (root === undefined || root === null){            root = self.getRoot(); // document root        } else if (!root.is(XMLElement)) {            throw build_error(ImportError, 'Elemento XML no válido como raíz');        }            var element = root.xmlElements.add(name, dest);        attrs.forEach(function(attr){            var key = attr.keys()[0];            var value = attr.values()[0];            if (!!key && !!value) {                element.xmlElements.add(key).contents = value + ' ';            }        });            return element;    };    /* ------------------------------------------------------------------------------ */    exported.removeXMLElementsByAttr = function(attr, value){        var rootElem = app.activeDocument.xmlElements.item(0);        var leaf = rootElem.children().filter(function(el){                 return (el.xmlAttributes.everyItem().value).contains(value);            });        leaf.forEach(function(el) { el.remove(); });    };    /* ------------------------------------------------------------------------------ */    exported.stringifyObject = function(obj, sep) {        var serialize = [];        for (key in obj) {            if (!obj[key].is(Function)){                serialize.push(obj[key]);            }        }        return serialize.join(sep);    };    /* ------------------------------------------------------------------------------ */    exported.productToXML = function(product, dest){        var partNumber, data, elem, attr, doc;                doc = document(dest);        partNumber = product.get(IKEA.CF_PARTNUMBER);                // Artículo descripción Precio información medidas color formatNumber        data = IKEA.XML.formatProductData(product.defaultFields(IKEA.CF_MEASURE));        elem = IKEA.XML.add(IKEA.XML.getRoot(doc), "Article", data, dest);                elem.xmlAttributes.add(IKEA.CF_PARTNUMBER, partNumber);        elem.xmlAttributes.add(IKEA.CF_PRICENORMAL, product.get(IKEA.CF_PRICENORMAL) || '');        elem.xmlAttributes.add('timeStamp', Date(Date.now()));                return elem;    };    exported.formatProductData = function(data, fields) {        /* Apply transformations and convert the object in an array of properties            indexed by fields */        data = this.format_name(data);        data = this.format_description(data);        data = this.format_color(data);        data = this.format_price(data);        data = this.format_measure(data);        if (!fields) {            fields = ['name', 'description', 'price', 'info', 'measure', 'color', 'code', 'altcode'];        }            var ff = fields.map(            function(field) {                var obj = {};                obj[field] = data[field];                return obj;            });                return ff;    };    exported.format_name = function(data) {        if (data.name) {            data.name = data.name.replace(/\d+x\d+(x\d+)?/g, ''); // removes sizes if in name        }        return data;    };            exported.format_description = function(data) {        if (data.description) {            data.description = data.description.toLowerCase();            data.description = data.description.replace(/\d+x\d+(x\d+)?/g, '')                                               .replace(/\s\s+/g, ' ')                                               .replace(/\s+$/, '');            if (data.color) {                data.description = data.description.replace(data.color.toLowerCase(), '')            }        }        return data;    };    exported.format_color = function(data) {        if (!data.color) {            data.color = '';        }        return data;    };        exported.format_price = function(data) {        var S = IKEA.price_symbol();        if (data.price && data.price.indexOf(S) > 0) {            data.price = S + data.price.replace(S, '');        }        if (!data.price) {            data.price = S+'0.0';        }        return data;    };    exported.format_measure = function(data) {        var dm = data.measure;        if (!dm || (dm.constructor.name === 'Array' && dm.lenght === 0)) {            return data;        }             var res;        var val = dm.values();        if (val.length === 0) {            return data;        }        var sb = dm.values()[0].indexOf('cm') >= 0 ? 'cm' : '"';         if (IKEA.DEBUG) {            dm.values().to_console(true);        }                String.prototype._tr = function() { return this.replace(sb, '').trim(); };        String.prototype._cm = function() { return this.replace(/\s\s+/g, ' ') + sb + '.'; };                    // TODO: reestructurar para que se añada ,alto si aparece Altura, etc.        if (dm.has('ancho') && dm.has('fondo') && dm.has('altura')) {            res = dm['ancho']._tr() + 'x' + dm['fondo']._tr() + ', alto ' + dm['altura']._tr()._cm();        } else if (dm.has('ancho') && dm.has('longitud')) {            res = dm['longitud']._tr() + 'x' + dm['ancho']._tr()._cm();            if (dm.has('ancho de cama') && dm.has('largo de cama')){                res += ' Cama: ' + dm['ancho de cama']._tr() + 'x' + dm['largo de cama']._tr()._cm();            }        } else if (dm.has('ancho') && dm.has('fondo')) {            res = dm['ancho']._tr() + 'x' + dm['fondo']._tr()._cm();            if (dm.has('ancho de cama') && dm.has('largo de cama')){                res += ' Cama: ' + dm['ancho de cama']._tr() + 'x' + dm['largo de cama']._tr()._cm();            }        } else if (dm.has('diámetro')) {            res = 'Ø' + dm['diámetro']._tr()._cm();            if (dm.has('altura')) {                res += ', alto ' + dm['altura']._tr()._cm();            }        } else if (dm.has('diámetro de la pantalla')) {            res = 'Ø' + dm['diámetro de la pantalla']._tr()._cm();        } else if (data.size) {            res = data.size._tr()._cm();        }            delete String.prototype._cm;        delete String.prototype._tr;                data.measure = res;                return data;    };        exported.format_info = function(data) {        if (data.info && data.info.is(Array)) {            data.info = data.info.join(' ');        }        return data;    };    return exported;})();/* CASOS        TODO: pasar todos los keys a minuscula    Altura,diámetro del pie,diámetro de la pantalla,longitud del cable      Ancho,Altura                                                            Ancho,fondo máximo,Altura                                               Ancho,fondo,Altura                                                      Ancho,fondo,Altura,Pantalla plana TV máx                                Ancho,fondo,Altura,Peso máximo,Pantalla plana TV máx                    Ancho,fondo,Altura,Peso máximo/balda                                    Ancho,fondo,Altura,Tamaño de la pantalla                                Ancho,fondo,altura mínima                                               Ancho,fondo,altura mínima,altura máxima,Peso máximo                     Ancho,fondo,fondo máximo,Altura                                         Ancho,profundidad máxima,fondo máximo,Altura                            ancho,profundidad,alto,carga máxima/estante                             diámetro,Altura                                                         diámetro,Altura,longitud del cable                                      longitud,Ancho                                                          longitud,Ancho,Altura                                                   longitud,Ancho,Altura,Peso máximo                                       longitud,Ancho,densidad de la superficie                                longitud,Ancho,densidad de la superficie,Densidad (g/m2),Largo del pelo longitud,fondo,grosor                                                   AlturaAnchoDensidad (g/m2)Largo del pelo Pantalla plana TV máx                                Peso máximo                                       Peso máximo/balda                                    Tamaño de la pantalla                                altoaltura máximaaltura mínima                                               anchocarga máxima/estante                             densidad de la superficie                                diámetrodiámetro de la pantalladiámetro del piefondofondo máximogrosor                                                   longitudlongitud del cable                                      profundidadprofundidad máxima*/
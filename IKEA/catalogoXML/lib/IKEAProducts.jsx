﻿/** IKEA Products API    Author: Javier Ramos        Retrieve information about products from an external web API.    */var IKEA = (function(){    const IKEA_URL = "http://ibiza.ikea.es/esi/es/catalog/products/";    const IKEA_URL_IMG = "https://s3-eu-west-1.amazonaws.com/ikeasiwebimages/imagenes_articulosweb/";        var null_object = function(obj){        if (!obj) {            return ;        }            for (key in obj){            if (obj[key] === 'null'){                obj[key] = null;            }            else if (obj[key] && obj[key].is(Object) && !obj[key].is(Function)){                null_object(obj[key]);            }        }    };    /** _GET :: string -> [{name: ..., value: ...}] -> string                Do a HTML GET request to 'url' with 'params' being an         array of {key:value} parameters to send.        */    var _GET = function (url, params){        var http, response;        var par = '';        if (params.length > 0){            par = '?';            params.forEach(function(param){                 par += param.name + '=' + param.value + '&';            });            par = par.slice(0, -1);        }        http = require("http");        response = http.get(url + par);                if (response.status == 200){            return response.body;        }                    throw new ImportError('Error al conectar con la Base de Datos');    };    /** getProductInfoXML :: product_id -> string                Given a IKEA Product PartNumber        */    var getProductInfoXML = function(product_id){        return _GET(IKEA_URL + product_id,                    [{name:'type', value:'xml'},                    {name:'dataset', value:'prices'}]);    };    /** getProductInfoJSON :: product_id -> string                Given a list of IKEA product partNumbers return json string representing them.        */    var getProductInfoJSON = function(partNumbers, island, date){        if ( !(partNumbers instanceof Array) ) {            partNumbers  = [ partNumbers ];        }            var data = "type=json&dataset=ptagPOST" +                   "&island=" + (island || IKEA.TENERIFE) +                   "&date=" + (date || '') +                   "&products[]=" + partNumbers.join("&products[]=");                IKEA._debug(data, 2);                var http = require("http");        var response = http.post(IKEA_URL, data);                if (response.status === 200){            return response.body;        }                    throw new ImportError('Error al conectar con la Base de Datos:\n ');    };    var exported = {        DEBUG: false,        DEBUG_LEVEL: 0,        _debug: function(param, min_level, verbose) {             min_level = min_level || 0;            if (IKEA.DEBUG && IKEA.DEBUG_LEVEL >= min_level) {                 if (verbose) { param.to_console(true); }                 else { $.writeln(param) }            }         },                ORIGENES: [              { name: 'LANZAROTE',    code: "lanzarote"  },              { name: 'PUERTO RICO',  code: "puertorico" },              { name: 'MALLORCA',     code: "palma"      },              { name: 'GRAN CANARIA', code: "tenerife"   },              { name: 'TENERIFE',     code: "tenerife"   }        ],        FIELDS_ROOT: [ "ALMCOD", "AREA" , "ASSEMBLY" , "CAREINST" , "COLOR" , "CURRENCY" , "CUSTBENEFIT",                        "CUSTMATERIALS" , "DATAPRINT" , "DESIGNER" , "ENVIRONMENT" , "FACTS" , "FORMATNUMBER",                        "GOODTOKNOW" , "IMAGE" , "ISLAND" , "ITEMQUANTITY", "MEASURE" , "NAME" , "PACKAGE",                        "PARTNUMBER" , "PKGMEAS" , "PRICENORMAL" , "PRICEORIGINAL" , "PRICESALE" , "QUANTITY",                        "SIZE" , "SUBITEMQUANTITY"                     ],         // Field name constants                 // Field labels                              // Field precedence (zero max precedence)        CF_ALMCOD         : "almcod",           CL_ALMCOD         : "Cod. corto",             CP_ALMCOD          : 11,        CF_AREA           : "area",             CL_AREA           : "Área",                   CP_AREA            : -1,        CF_ASSEMBLY       : "assembly",         CL_ASSEMBLY       : "Montaje",                CP_ASSEMBLY        : -1,        CF_CAREINST       : "careinst",         CL_CAREINST       : "Cuidados",               CP_CAREINST        : 06,        CF_COLOR          : "color",            CL_COLOR          : "color",                  CP_COLOR           : 04,        CF_CURRENCY       : "currency",         CL_CURRENCY       : "Moneda",                 CP_CURRENCY        : -1,        CF_CUSTBENEFIT    : "custbenefit",      CL_CUSTBENEFIT    : "Información",            CP_CUSTBENEFIT     : 07,        CF_CUSTMATERIALS  : "custmaterials",    CL_CUSTMATERIALS  : "Materiales",             CP_CUSTMATERIALS   : 05,        CF_DATAPRINT      : "dataprint",        CL_DATAPRINT      : "dataPrint",              CP_DATAPRINT       : -1,        CF_DESIGNER       : "designer",         CL_DESIGNER       : "Diseñador",              CP_DESIGNER        : 08,        CF_ENVIRONMENT    : "environment",      CL_ENVIRONMENT    : "Medio Ambiente",         CP_ENVIRONMENT     : -1,        CF_FACTS          : "facts",            CL_FACTS          : "Descripción",            CP_FACTS           : 01,        CF_FORMATNUMBER   : "formatnumber",     CL_FORMATNUMBER   : "Código",                 CP_FORMATNUMBER    : 09,        CF_GOODTOKNOW     : "goodtoknow",       CL_GOODTOKNOW     : "Conviene saber",         CP_GOODTOKNOW      : 10,        CF_IMAGE          : "image",            CL_IMAGE          : "Imagen",                 CP_IMAGE           : -1,        CF_ISLAND         : "island",           CL_ISLAND         : "Origen",                 CP_ISLAND          : -1,        CF_ITEMQUANTITY   : "itemquantity",     CL_ITEMQUANTITY   : "itemquantity",           CP_ITEMQUANTITY    : -1,        CF_MEASURE        : "measure",          CL_MEASURE        : "Tamaño",                 CP_MEASURE         : 03,        CF_NAME           : "name",             CL_NAME           : "Artículo",               CP_NAME            : 00,        CF_PACKAGE        : "package",          CL_PACKAGE        : "Empaquetado",            CP_PACKAGE         : -1,        CF_PARTNUMBER     : "partnumber",       CL_PARTNUMBER     : "Código",                 CP_PARTNUMBER      : -1,        CF_PKGMEAS        : "pkgmeas",          CL_PKGMEAS        : "pkgmeas",                CP_PKGMEAS         : -1,        CF_PRICENORMAL    : "pricenormal",      CL_PRICENORMAL    : "Precio",                 CP_PRICENORMAL     : 02,        CF_PRICEORIGINAL  : "priceoriginal",    CL_PRICEORIGINAL  : "Precio Compra",          CP_PRICEORIGINAL   : -1,        CF_PRICESALE      : "pricesale",        CL_PRICESALE      : "Precio Venta",           CP_PRICESALE       : -1,        CF_QUANTITY       : "quantity",         CL_QUANTITY       : "Cantidad",               CP_QUANTITY        : -1,        CF_SIZE           : "size",             CL_SIZE           : "Medidas",                CP_SIZE            : -1,        CF_SUBITEMQUANTITY: "subitemquantity",  CL_SUBITEMQUANTITY: "Número de componentes",  CP_SUBITEMQUANTITY : -1,        CF_SUBITEMS       : "subitems",         CL_SUBITEMS       : "Componentes",            CP_SUBITEMS        : -1,        // dinamically assigned later (before return) to map CF_... field names to CL_... field labels        labels: {},                RE_LARGECODE: /\d\d\d\.\d\d\d\.\d\d/mg,        RE_PRICE: /\b\uFEFF*US\$.+?(?: |$)|\b\uFEFF*RD\$.+?(?: |$)|\b\uFEFF*\$.+?(?: |$)|\€\uFEFF*\d+/gm,        /** Cachea el símbolo de monea o devuelve el            último valor cacheado */        cached_price_symbol: undefined,        /** Getter and Setter for the price_symbol */        price_symbol: function(ps) {            if (!!ps) {                this.cached_price_symbol = ps;            } else                return this.cached_price_symbol || '€';        },            SubProduct: function(product, ix) {            return new IKEA.ProductJSON(product.attributes[IKEA.CF_SUBITEMS][ix], true);        },        /** Return an Product from a json structure */        ProductJSON: function(json_data, dontEval) {            this.product = (dontEval === undefined) ? eval_safe(json_data) : json_data;            if (this.product.is(Array)){                this.product = this.product.first();            }            return {                isValid: true,                json_data: json_data,                attributes: objectKeysToLowerCase(this.product),                get: function(field, options) {                     /* Return the field value.                        options is an object that can containg the following keys:                            packingArrays:true -> if the field value is an array, join into string                            notrim -> don't trim the result string                    */                    if (!options) options = {};                                        // accepts the real field name or the CF_... tag                    var v = this.attributes[field.toLowerCase()] || this.attributes[IKEA[field]];                                        if (!v){                        return null;                    }                                    if (typeof(v) === 'array' && options.has('packingArrays')) {                        v = v.join(' ');                    }                    if (v.has('trim') && !v.has('keys') && !options.has('notrim')){                        v = v.trim();                    }                                     return v || "";                },                _cached_image: null,                getImage: function() {                    if (!this._cached_image) {                        this._cached_image = curl(this.attributes[CF_IMAGE]);                    }                    return this._cached_image;                },                            getFromSubItem: function(field, index) {                    /** return the field value for the subitem indicated by index */                    field = field.toLowerCase();                    var s_ = this.attributes[IKEA.CF_SUBITEMS][index];                    var v = s_[field] || "";                                        if (!v) { return null; }                    if (typeof(v) === 'array') { v = v.join(' '); }                                        return v;                },                                set: function(field, value) {                     this.attributes[field] = value;                     return this;                 },                                /* Return an object with the default fields and values, plus any extra field especified */                defaultFields: function(extraFields /* object */){                    var self = this;                    var res = { get: function(f_name) { return this[f_name] || this[IKEA['CF_'+f_name]]; } };                    res[IKEA.CF_NAME]        = self.get(IKEA.CF_NAME);                    res[IKEA.CF_FATCS]       = self.get(IKEA.CF_FACTS);                    res[IKEA.CF_PRICENORMAL] = self.get(IKEA.CF_PRICENORMAL) || '';                    res[IKEA.CF_CUSTBENEFIT] = self.get(IKEA.CF_CUSTBENEFIT);                    res[IKEA.CF_SIZE]        = self.get(IKEA.CF_SIZE);                    res[IKEA.CF_COLOR]       = self.get(IKEA.CF_COLOR) || '';                    res[IKEA.CF_FORMATNUMBER]= self.get(IKEA.CF_FORMATNUMBER);                    res[IKEA.CF_ALMCOD]      = self.get(IKEA.CF_ALMCOD);                                    if (!extraFields) {                        extraFields = []                    } else if (!extraFields.is(Array)) {                        extraFields = [extraFields];                    }                    extraFields.forEach(function(field) {                        res[field] = self.get(field);                    });                                    return res;                },                            format: function(args) {                    var r;                                        if (!args) { args = {}; }                    if (!args.sep) { args.sep = '|'; }                    if (!args.fields){                        r = this.defaultFields();                    }else{                        var self = this;                        r = {};                        this.attributes.keys().forEach(function(k){                            if (args.fields.contains(k)){                                r[k] = self.attributes[k];                            }                        });                    }                                        return r.values().compact().join(args.sep).trim();                },                            fields: function( field_names /* array */){                    if (!field_names){                        return this.defaultFields();                    }                                        var res = { get: function(f_name) { return this[f_name] || this[IKEA['CF_'+f_name]]; } };                                        var self = this;                    if (field_names.constructor.name === 'Object') {                        field_names = field_names.keys();                    }                    field_names.forEach(function(field){                        res[IKEA[field]] = self.get(IKEA[field]);                    });                                    return res;                }            };        },        /** Return an Product from a the partNumber, getting the json data from the web API */        Product: function(partNumber, island, date){            var pinfo, pn, product;            pn = IKEA.partNumber(partNumber);            pinfo = getProductInfoJSON([pn], island, date);                        if (!pinfo || pinfo === "[]") {                throw ErrorValidacion('No se han encontrado datos para la referencia ' + partNumber);            }                    var res = new IKEA.ProductJSON(pinfo);            res.source = island;            return res;        },            /* Return an array of Products from an array of partNubmers */        Products: function(partNumbers, island, date){            var pinfo, pn, product, ps;            ps = partNumbers.map(IKEA.partNumber);                        pinfo = getProductInfoJSON(ps, island, date);                        if (!pinfo || pinfo === "[]" || pinfo === 'null') {                throw ErrorValidacion('No se han encontrado datos para la referencia ' + partNumbers);            }                    IKEA._debug(pinfo, 1);                       var products_ = eval_safe(pinfo);            var res = {}            for (var ix=0, ex=products_.length; ix<ex; ++ix) {                if (!products_[ix].get(IKEA.CF_FORMATNUMBER)){                    throw { name: "Error de parámetro", message:"El producto obtenido no tiene un código válido",                             line: $.line-1, fileName: $.fileName,                            stack: $.stack };                }                var v = res[products_[ix].get(IKEA.CF_FORMATNUMBER)] = new IKEA.ProductJSON(products_[ix], true);            }                       return res;         },            /* Convert the argument to a number if is a valid partNumber, otherwise throw an type error */        partNumber: function(pn) {            var res = pn;            if (typeof res === 'string') {                 res = Number(res.replace(/\./g, ''));            }             if (typeof res === 'number' && !isNaN(res)) {                return res.toString();            }                        throw new TypeError('ERROR: "' + pn + '" no es un código de articulo válido');        },            /* Return the right data source for the argument */        getSource: function(source) {            for (var i=0,e=IKEA.ORIGENES.length; i<e; ++i) {                if (IKEA.ORIGENES[i]['name'] === source) {                    return IKEA.ORIGENES[i]['code'];                }            }                    throw ErrorValidacion('No se ha indicado el origen de los datos de artículo');        },    };    /* Given an insertionPoint 'ip', try to read a valid FORMATNUMBER */    exported.scanFormatNumber = function(ip) {        var fn = '';        if (ip.isValid) {            var pi = ip;             var re = /\d|\./ ;            var chl, chr, ts_l=true,ts_r=true;            var loop = true;            while (ts_l || ts_r) {                chl = pi.charactersAt('left');                chr = ip.charactersAt('right');                ts_l = re.test(chl.contents);                ts_r = re.test(chr.contents);                if (ts_l) {                    fn = chl.contents + fn;                    pi = pi.previous();                }                if (ts_r) {                    fn = fn + chr.contents;                    ip = ip.next();                }            }        }        $.writeln(fn);        return fn;    }    // Assigned dinamically to easy use of field labels    exported.labels[exported.CF_ALMCOD]          = exported.CL_ALMCOD;    exported.labels[exported.CF_AREA]            = exported.CL_AREA;    exported.labels[exported.CF_ASSEMBLY]        = exported.CL_ASSEMBLY;    exported.labels[exported.CF_CAREINST]        = exported.CL_CAREINST;    exported.labels[exported.CF_COLOR]           = exported.CL_COLOR;    exported.labels[exported.CF_CURRENCY]        = exported.CL_CURRENCY;    exported.labels[exported.CF_CUSTBENEFIT]     = exported.CL_CUSTBENEFIT;    exported.labels[exported.CF_CUSTMATERIALS]   = exported.CL_CUSTMATERIALS;    exported.labels[exported.CF_DATAPRINT]       = exported.CL_DATAPRINT;    exported.labels[exported.CF_DESIGNER]        = exported.CL_DESIGNER;    exported.labels[exported.CF_ENVIRONMENT]     = exported.CL_ENVIRONMENT;    exported.labels[exported.CF_FACTS]           = exported.CL_FACTS;    exported.labels[exported.CF_FORMATNUMBER]    = exported.CL_FORMATNUMBER;    exported.labels[exported.CF_GOODTOKNOW]      = exported.CL_GOODTOKNOW;    exported.labels[exported.CF_IMAGE]           = exported.CL_IMAGE;    exported.labels[exported.CF_ISLAND]          = exported.CL_ISLAND;    exported.labels[exported.CF_ITEMQUANTITY]    = exported.CL_ITEMQUANTITY;    exported.labels[exported.CF_MEASURE]         = exported.CL_MEASURE;    exported.labels[exported.CF_NAME]            = exported.CL_NAME;    exported.labels[exported.CF_PACKAGE]         = exported.CL_PACKAGE;    exported.labels[exported.CF_PARTNUMBER]      = exported.CL_PARTNUMBER;    exported.labels[exported.CF_PKGMEAS]         = exported.CL_PKGMEAS;    exported.labels[exported.CF_PRICENORMAL]     = exported.CL_PRICENORMAL;    exported.labels[exported.CF_PRICEORIGINAL]   = exported.CL_PRICEORIGINAL;    exported.labels[exported.CF_PRICESALE]       = exported.CL_PRICESALE;    exported.labels[exported.CF_QUANTITY]        = exported.CL_QUANTITY;    exported.labels[exported.CF_SIZE]            = exported.CL_SIZE;    exported.labels[exported.CF_SUBITEMQUANTITY] = exported.CL_SUBITEMQUANTITY;    exported.labels[exported.CF_SUBITEMS]        = exported.CL_SUBITEMS;      return exported;})();/*IKEA.DEBUG = true; IKEA.DEBUG_LEVEL = 2;$.writeln(Date());var products = IKEA.Products(['499.022.20', '302.396.89', '400.717.88', '102.105.35', '302.397.26', '002.161.75'], 'tenerife');  // , '101.884.26', '101.903.06', '101.933.57', '101.957.66', '101.975.72', '102.016.11', '102.016.73', '102.020.88', '102.038.70', '102.063.12', '102.068.40', '102.068.83', '102.076.51', '102.077.69', '102.094.95', '102.097.87', '102.105.35', '102.116.72', '102.117.85', '102.121.29', '102.133.17', '102.150.95', '102.163.30', '102.171.22', '102.180.89', '102.189.99', '102.191.78', '102.194.56', '102.214.21', '102.243.54', '102.257.87', '102.259.52', '102.271.83', '102.286.20', '102.290.21', '102.323.11', '102.335.32', '102.335.51', '102.342.49', '102.377.52', '102.379.50', '102.394.64', '102.396.52', '102.397.32', '102.400.47', '102.452.38', '102.518.56', '102.558.97', '102.578.96', '172.283.40', '190.020.56', '190.022.78', '198.437.55', '198.707.39', '198.986.58', '199.031.55', '199.031.84', '199.032.21', '199.281.51', '199.316.34', '200.114.13', '200.784.51', '200.894.35', '200.894.64', '200.919.28', '201.105.40', '201.120.11', '201.160.71', '201.182.30', '201.308.78', '201.325.23', '201.334.00', '201.334.95', '201.353.00', '201.393.22', '201.465.44', '201.493.21', '201.521.58', '201.522.81', '201.540.96', '201.545.91', '201.596.35', '201.632.65', '201.639.63', '201.695.59', '201.766.87', '201.788.65', '201.821.79', '201.856.82', '201.861.01', '201.878.60', '201.901.98', '201.932.67', '201.966.09', '202.016.82', '202.017.38', '202.033.32', '202.037.75', '202.038.84', '202.049.06', '202.051.71', '202.084.76', '202.087.11', '202.087.87', '202.108.94', '202.137.22', '202.138.83', '202.145.85', '202.236.22', '202.237.35', '202.254.09', '202.289.93', '202.290.73', '202.302.17', '202.312.88', '202.350.45', '202.394.25', '202.396.75', '202.407.11', '202.418.19', '202.425.93', '202.438.37', '202.448.51', '202.450.49', '202.457.23', '202.459.78', '202.462.23', '202.467.94', '202.473.07', '202.626.04', '231.029.00', '245.244.85', '290.013.96', '290.018.72', '290.020.94', '290.024.47', '290.025.98', '290.047.81', '298.641.39', '298.756.80', '298.968.66', '299.022.21', '299.033.86', '299.063.42', '299.300.97', '299.309.07', '300.464.74', '300.492.79', '300.697.24', '300.722.17', '300.803.16', '300.895.76', '300.954.12', '301.036.76', '301.130.29', '301.162.64', '301.256.97', '301.285.92', '301.286.05', '301.396.23', '301.509.84', '301.525.96', '301.550.19', '301.571.03', '301.586.78', '301.591.83', '301.752.63', '301.763.09', '301.777.28', '301.933.23', '301.933.61', '302.006.96', '302.049.01', '302.097.10', '302.139.53', '302.144.10', '302.165.36', '302.175.26', '302.176.54', '302.189.98', '302.192.81', '302.194.60', '302.242.87', '302.257.91', '302.272.62', '302.275.92', '302.284.69', '302.290.77', '302.312.83', '302.322.25', '302.335.88', '302.396.51', '302.396.89', '302.397.26', '302.398.87', '302.432.62', '302.435.87', '302.450.58', '302.454.64', '302.457.27', '302.464.68', '302.474.58', '302.485.04', '302.495.70', '302.504.36', '302.548.68', '390.021.21', '390.023.62', '390.025.88', '398.175.57', '398.744.92', '398.766.60', '398.856.45', '398.874.42', '399.021.93', '399.331.42', '400.337.63', '400.608.36', '400.717.88', '400.831.78', '401.017.33', '401.037.27', '401.042.70', '401.053.40', '401.078.72', '401.319.09', '401.393.21', '401.398.11', '401.471.80', '401.536.99', '401.600.20', '401.637.78', '401.714.72', '401.772.33', '401.849.45', '401.865.48', '401.869.54', '401.873.69', '401.875.62', '401.878.64', '401.906.54', '401.962.41', '401.963.02', '401.965.85', '401.985.94', '402.017.37', '402.033.93', '402.048.49', '402.053.49', '402.072.06', '402.080.22', '402.105.34', '402.112.13', '402.121.61', '402.132.74', '402.141.22', '402.165.31', '402.177.95', '402.192.85', '402.198.60', '402.217.83', '402.226.26', '402.249.65', '402.255.16', '402.260.97', '402.275.96', '402.279.02', '402.289.92', '402.299.01', '402.316.16', '402.331.49', '402.335.35', '402.397.21', '402.399.57', '402.427.66', '402.436.24', '402.456.42', '402.467.74', '402.501.67', '402.512.04', '402.514.78', '402.731.02', '443.610.10', '490.018.14', '490.020.93', '490.059.25', '498.716.76', '498.777.77', '498.860.03', '498.861.21', '498.861.40', '498.975.44', '499.022.20', '499.031.92', '499.033.85', '499.040.64', '499.172.07', '499.306.28', '499.316.18', '499.328.30', '500.382.13', '500.395.52', '501.075.03', '501.135.65', '501.314.37', '501.355.15', '501.408.28', '501.429.93', '501.441.76', '501.525.95', '501.603.88', '501.618.30', '501.632.64', '501.635.46', '501.637.92', '501.660.74', '501.671.58', '501.769.59', '501.826.20', '501.849.16', '501.856.90', '501.928.55', '501.937.32', '502.011.95', '502.025.38', '502.030.95', '502.064.28', '502.084.51', '502.096.29', '502.096.34', '502.100.34', '502.111.04', '502.115.66', '502.117.88', '502.135.65', '502.157.72', '502.176.53', '502.180.25', '502.190.01', '502.192.99', '502.198.45', '502.204.67', '502.212.97', '502.213.01', '502.223.72', '502.250.21', '502.255.06', '502.261.29', '502.269.59', '502.271.19', '502.279.73', '502.290.19', '502.294.01', '502.302.49', '502.336.72', '502.342.52', '502.359.92', '502.360.48', '502.375.66', '502.377.50', '502.415.25', '502.418.13', '502.423.13', '502.427.37', '502.477.54', '502.477.92', '502.501.57', '502.512.32', '502.523.59', '502.548.05', '502.548.67', '502.631.50', '502.701.36', '590.021.15', '590.021.96', '590.062.55', '598.499.77', '598.745.04', '598.894.97', '598.929.37', '599.000.89', '599.022.48', '599.022.53', '599.026.58', '599.291.82', '599.315.90', '599.331.79', '600.456.56', '600.619.67', '600.667.24', '601.011.57', '601.031.99', '601.038.54', '601.294.58', '601.294.63', '601.321.92', '601.325.21', '601.352.99', '601.441.66', '601.487.01', '601.505.53', '601.648.28', '601.714.33', '601.747.66', '601.777.60', '601.786.13', '601.788.87', '601.794.34', '601.820.59', '601.878.58', '601.900.97', '601.913.46', '601.923.55', '601.963.58', '602.011.52', '602.039.19', '602.073.33', '602.085.25', '602.128.91', '602.141.21', '602.180.20', '602.222.15', '602.226.30', '602.229.32', '602.259.59', '602.290.33', '602.300.98', '602.302.44', '602.328.32', '602.337.75', '602.375.61', '602.390.08', '602.394.09', '602.400.97', '602.403.18', '602.405.87', '602.409.45', '602.426.33', '602.457.21', '602.462.21', '602.488.28', '602.516.65', '602.517.45', '602.518.54', '602.639.65', '690.001.06', '690.022.33', '690.066.41', '698.508.85', '698.759.61', '698.887.08', '699.022.19', '699.029.45', '699.064.58', '700.227.63', '700.871.08', '700.872.88', '701.032.50', '701.089.12', '701.375.75', '701.411.53', '701.494.65', '701.527.02', '701.556.73', '701.557.53', '701.636.06', '701.760.53', '701.775.09', '701.866.03', '701.904.50', '701.932.41', '701.970.84', '701.976.49', '702.016.65', '702.067.43', '702.068.04', '702.069.03', '702.084.45', '702.092.42', '702.100.33', '702.108.01', '702.135.93', '702.138.66', '702.165.44', '702.173.36', '702.179.06', '702.196.94', '702.214.23', '702.225.21', '702.250.58', '702.256.85', '702.271.18', '702.279.86', '702.287.16', '702.290.04', '702.307.38', '702.322.52', '702.338.31', '702.342.46', '702.366.17', '702.367.59', '702.367.64', '702.395.88', '702.397.10', '702.403.32', '702.449.00', '702.450.23', '702.518.58', '702.535.41', '702.548.66', '702.558.99', '702.561.58', '717.563.10', '737.557.09', '763.201.10', '790.019.02', '790.021.38', '790.025.91', '790.039.44', '790.044.63', '790.052.69', '798.252.25', '798.403.63', '798.508.75', '798.623.31', '798.757.48', '798.843.71', '798.891.42', '798.895.66', '799.060.66', '799.085.55', '799.309.19', '799.318.29', '800.478.95', '800.681.66', '800.793.63', '801.001.90', '801.002.51', '801.029.76', '801.033.44', '801.048.62', '801.169.97', '801.194.63', '801.352.98', '801.366.79', '801.467.77', '801.520.75', '801.571.29', '801.579.02', '801.595.19', '801.604.81', '801.706.54', '801.752.51', '801.754.54', '801.762.84', '801.784.19', '801.822.37', '801.885.50', '801.937.35', '801.948.48', '801.964.80', '801.974.13', '801.986.05', '802.006.51', '802.011.46', '802.017.40', '802.033.91', '802.072.47', '802.096.04', '802.122.01', '802.135.83', '802.140.83', '802.142.57', '802.153.32', '802.176.75', '802.180.24', '802.184.58', '802.213.52', '802.214.27', '802.247.27', '802.249.30', '802.265.28', '802.297.82', '802.299.75', '802.301.96', '802.312.66', '802.322.23', '802.337.79', '802.340.19', '802.345.33', '802.346.94', '802.383.38', '802.400.96', '802.418.02', '802.501.89', '802.522.87', '802.526.64', '802.530.55', '802.701.25', '836.882.10', '862.871.10', '872.125.00', '890.018.93', '890.020.48', '890.047.78', '898.304.91', '898.602.37', '898.860.15', '898.943.03', '898.989.47', '899.022.18', '899.028.26', '899.060.75', '899.085.31', '899.101.00', '899.173.90', '899.311.07', '899.327.48', '900.667.13', '900.812.90', '900.937.59', '900.992.90', '901.032.54', '901.067.85', '901.094.92', '901.113.91', '901.244.02', '901.259.82', '901.281.79', '901.319.16', '901.491.29', '901.509.95', '901.572.99', '901.600.27', '901.619.46', '901.684.67', '901.853.20', '901.863.91', '901.933.63', '901.957.72', '901.968.04', '902.011.98', '902.015.13', '902.016.50', '902.051.77', '902.052.19', '902.062.52', '902.070.96', '902.073.36', '902.084.49', '902.104.90', '902.142.33', '902.148.55', '902.161.33', '902.175.66', '902.189.24', '902.190.18', '902.217.85', '902.222.14', '902.252.98', '902.254.44', '902.257.74', '902.257.93', '902.299.27', '902.329.77', '902.377.53', '902.396.53', '902.396.72', '902.396.91', '902.400.29', '902.414.63', '902.433.15', '902.436.31', '902.471.82', '902.472.95', '902.473.04', '902.482.85', '902.484.45', '902.484.93', '902.516.59', '902.604.61', '990.019.96', '998.424.36', '998.487.06', '998.845.39', '998.874.44', '998.897.54', '998.940.86', '998.985.36', '999.127.64', '999.276.09', '999.318.71', '999.325.97'], 'tenerife');$.writeln(Date());$.writeln(products.length);*/
﻿function curl(url, params){    // in MacOS X use AppleScript    if ($.os.slice(0,3) === 'Mac') {        var CURL = '/usr/bin/curl';        var script = 'do shell script "' + CURL + url + params + '"';                        return app.doScript(script, ScriptLanguage.APPLESCRIPT_LANGUAGE);    } else {        $.writeln('curl no disponible para su plataforma: ' + $.os);    }}
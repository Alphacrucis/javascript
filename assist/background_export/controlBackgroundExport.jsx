/***********************************************************************************************************
        Enable/Disable Background Export
        Version : 1.0
        Type : StartUp Script
        InDesign : CS5/CS5.5
        Author : Marijan Tompa (tomaxxi) | Subotica [Serbia] | modified by Javier Ramos
        Source : Matthew Laun (Adobe) | Bob Levine (@idguy)
        Info : http://forums.adobe.com/message/3689090#3689090
        Date : 19/05/2011
        Contact : indisnip (at) gmail (dot) com
        Twitter: @tomaxxi
        Web : http://indisnip.wordpress.com / http://inditip.wordpress.com
***********************************************************************************************************/

#targetengine "medianis"

var appName = "Background Export";
var myVer = "1.0";
var myVerDate = "[19/05/2011]";

if(parseInt(app.version) < 7){
    alert("This version of InDesign is not supported! Script supports InDesign CS5 (7.0) or newer!", appName + " " + myVer + " | Info");
    exit();
}else{
    var fileRef = File(Folder.startup + "/DisableAsyncExports.txt");
    var actionNameD = localize({   en: "Disable", fr: "Désactiver", de: "Deaktivieren", es: "Desactivar", pt: "Desativar", sv: "Inaktivera",
                                            da: "Deaktiver", nl: "Uitschakelen", it: "Disabilita", fi: "Poista", cs: "Zakázat", pl: "Wyłącz",
                                            hu: "Letiltása", ru: "Отключить", tr: "Devre dışı", ro: "Dezactivaţi", uk: "Відключити"}) + " " + appName;
    var actionNameE = localize({   en: "Enable", fr: "Activer", de: "Aktivieren", es: "Habilitar", pt: "Habilitar", sv: "Aktivera",
                                            da: "Aktiver", nl: "Activeer", it: "Attiva", fi: "Avulla", cs: "Umožňují", pl: "Włącz",
                                            hu: "Engedélyezése", ru: "Включить", tr: "Etkinleştirmek", ro: "Permite", uk: "Включити"}) + " " + appName;
    backgroundExportInstall();
}

function backgroundExportInstall(){
    backgroundExportcontroller = {};
    
    var actionName = actionNameD;
    var action = app.scriptMenuActions.item(actionName);
    
    if(action == null) {
        var actionName = actionNameE;
        var action = app.scriptMenuActions.item(actionName);
        if(action == null) {
            var action = app.scriptMenuActions.add(actionName);
        }
    }

    action.checked = false;
    action.enabled = true;
    action.addEventListener("beforeDisplay", backgroundExportenableDisable);
    action.addEventListener("onInvoke", backgroundExporttoggle);
    backgroundExportcontroller.action = action;
    
    var fileMenu = app.menus.item("$ID/Main").submenus.item("\$ID/&File");
    var refItem = fileMenu.menuItems.item("$ID/&Export");    
    
    fileMenu.menuItems.add(action, LocationOptions.after, refItem);
}

function backgroundExportenableDisable(){
    if(fileRef.exists){
        backgroundExportcontroller.action.title = actionNameE;
    } else {
        backgroundExportcontroller.action.title = actionNameD;
    }
}

function backgroundExporttoggle() {
    var script = 'do shell script "$1 $2"';
    script = script.replace("$1", "sudo /Users/admin/bin/indesign_pdf.sh");
    script = script.replace("$2", "");
    return app.doScript(script, ScriptLanguage.APPLESCRIPT_LANGUAGE);
}

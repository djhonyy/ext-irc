<?php
//prevents caching
header("Expires: Sat, 01 Jan 2000 00:00:00 GMT");
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Content-type: text/html; charset=ISO-8859-1");
error_reporting(1);
?>

<!-- Do NOT put any DOCTYPE here unless you want problems in IEs. -->
<html>

    <!-- Each valid html page must have a head; let's create one. -->
    <head>
        <!-- The following line defines content type and utf-8 as character set. -->
        <!-- If you want your application to work flawlessly with various local -->
        <!-- characters, just make ALL strings, on the page, json and database utf-8. -->
        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-15">

        <link REL="SHORTCUT ICON" HREF="favicon.ico">

  <!--<script type='text/javascript' src='http://getfirebug.com/releases/lite/1.2/firebug-lite-compressed.js'></script>-->

        <!-- Set a title for the page (id is not necessary). -->
        <title id="page-title">Ext-js IRC Like</title>

        <!-- Close the head -->
    </head>

    <!-- You can leave the body empty in many cases, or you write your content in it. -->
    <body>

        <!-- Ext relies on its default css so include it here. -->
        <!-- This must come BEFORE javascript includes! -->
        <link rel="stylesheet" type="text/css" href="ext/resources/css/ext-all.css">
        <!-- <link rel="stylesheet" type="text/css" href="ext/resources/css/xtheme-gray-extend.css" /> -->

        <!-- First of javascript includes must be an adapter... -->
        <script type="text/javascript" src="ext/adapter/ext/ext-base.js"></script>

        <!-- ...then you need the Ext itself, either debug or production version. -->
        <script type="text/javascript" src="ext/ext-all.js"></script>
        <script type="text/javascript" src="ext/src/locale/ext-lang-pt.js"></script>

        <script type="text/javascript" src="js/Ext.util.js"></script>
        <script type="text/javascript" src="js/ERP.chat.js"></script>
        <script type="text/javascript" src="js/Ext.Error.js"></script>


        <!-- You can have onReady function here or in your application file. -->
        <!-- If you have it in your application file delete the whole -->
        <!-- following script tag as we must have only one onReady. -->
        <script type="text/javascript">

            Ext.form.HtmlEditor.prototype.defaultValue = '';

            Ext.onReady(function(){

                Ext.QuickTips.init();
                Ext.QuickTips.getQuickTip().interceptTitles = true;
                Ext.QuickTips.enable();

                var viewport = new Ext.Viewport({
                    layout:'border',
                    items:[
                        {
                            region: 'center',
                            xtype:'ERPChat'
                        }
                    ]
                });
                viewport.doLayout();
            });

        </script>

        <div id="chat" style="width:100%;height:100%" ></div>

    </body>

    <!-- Close html tag at last -->
</html>
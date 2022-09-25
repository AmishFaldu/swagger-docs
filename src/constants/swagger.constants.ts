export const favIconsString = `
  <link rel="icon" type="image/png" href="{{baseUrl}}favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="{{baseUrl}}favicon-16x16.png" sizes="16x16" />
`;

export const htmlString = `
<!-- HTML for static distribution bundle build -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{{customTitle}}</title>
  <link rel="stylesheet" type="text/css" href="{{baseUrl}}swagger-ui.css" >
  {{favIconsString}}
  <style>
    html
    {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *,
    *:before,
    *:after
    {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>
<body>
<div id="swagger-ui"></div>
<script src="{{baseUrl}}swagger-ui-bundle.js"> </script>
<script src="{{baseUrl}}swagger-ui-standalone-preset.js"> </script>
<script src="{{baseUrl}}swagger-initializer.js"> </script>
{{customJs}}
{{customJsString}}
{{customCss}}
<style>
    {{customCssStyle}}
</style>
</body>
</html>
`;

export const jsString = `
    window.onload = function() {
    //<editor-fold desc="Changeable Configuration Block">
    
    // the following lines will be replaced by docker/configurator,
    // when it runs in a docker-container
    window.ui = SwaggerUIBundle({
        spec: {{spec}},
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
        ],
        plugins: [
            SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        displayRequestDuration: {{displayRequestDuration}},
        filter: {{filter}},
        tryItOutEnabled: {{tryItOutEnabled}},      
    });
    
    //</editor-fold>
    };
`;

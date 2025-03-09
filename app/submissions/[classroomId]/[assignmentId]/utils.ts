export const createHtmlCode = (sourceCode: string): string => {
  const componentCode = removeImportsAndExports(sourceCode);

  const htmlCode = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Front End Programming / React</title>
      </head>
      <body>
        <!-- We will put our React component inside this div. -->
        <div id="root"></div>

        <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
        <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
        <script src="https://unpkg.com/babel-standalone@6.26.0/babel.min.js"></script>

        <script type="text/babel">
          ${componentCode}

          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(<App />);
        </script>
      </body>
    </html>`;

    return htmlCode;
};

function removeImportsAndExports(sourceCode: string): string {
  const importExportRegex = /^import\s+.*?($|;)|^(import|export)\s+.*from\s+['"].*['"];?|^export\s+default\s+\w+;?|^export\s+{[^}]*};?/gm;
  let cleanedCode = sourceCode.replace(importExportRegex, '');
  cleanedCode = cleanedCode.replace('<>', '<div>');
  cleanedCode = cleanedCode.replace('</>', '</div>');

  return cleanedCode.trim();
}

import ts from 'typescript';

export function transpileTsxToJsx(sourceCode: string): string {
  const result = ts.transpileModule(sourceCode, {
    compilerOptions: {
      jsx: ts.JsxEmit.Preserve,
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
    },
    fileName: 'component.tsx', // Default filename for error reporting
  });

  return result.outputText;
}



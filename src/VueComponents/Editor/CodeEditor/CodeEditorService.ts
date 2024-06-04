//@ts-ignore
import { injectable, inject } from "inversify";
import { Ref } from "vue";
import { CodeCompletionProvider } from "./CodeCompletionProvider";
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import { IViewConfiguration } from "alphautils";
self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker()
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker()
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker()
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker()
    }
    return new editorWorker()
  }
}


@injectable()
export class CodeEditorService {

    private editor: monaco.editor.IStandaloneCodeEditor;
    private disposables: Array<monaco.IDisposable> = [];
    private completionProvider: CodeCompletionProvider;

    constructor(
      @inject('CodeCompletionProvider') completionProvider: CodeCompletionProvider
    ){
        this.completionProvider = completionProvider
       
    }
    public OpenCSSEditor(host: Ref<HTMLElement>,contextid:number, value?: string, updatecallback?: void){

        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
          noSemanticValidation: true,
          noSyntaxValidation: true
        });
        const model = monaco.editor.createModel(value, 'css');
        const editor = monaco.editor.create(host.value, {
            theme: 'vs-dark'
        }); 
        
        editor.setModel(model);

        this.editor = editor;

        return editor;
    }

    public OpenJSONEditor(host: Ref<HTMLElement>, contextid: number, value?: string, updatecallback?: void){
        
          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true
          });
          const model = monaco.editor.createModel(value, 'json');
          const editor = monaco.editor.create(host.value, {
              theme: 'vs-dark'
          }); 
          
          editor.setModel(model);
          const disposeChangeContext = editor.onDidChangeModelContent((e) => {
            if(typeof updatecallback == 'function'){
               //updatecallback(e.eol)
            }
        })

        this.disposables.push(disposeChangeContext);
          this.editor = editor;
  
          return editor;
      }

    public OpenEditorForExpression(host: Ref<HTMLElement>, contextid: number, value?: string, updatecallback?: void, requestingComponent?: IViewConfiguration){
     
        monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true
        });
       const provider = () => this.completionProvider
        
        const disposable = monaco.languages.registerCompletionItemProvider('typescript',
        {
            triggerCharacters: ['.'],
            provideCompletionItems: function (model, position)
            {
                return provider().GetViewContextCompletions(model, position, contextid, requestingComponent)
            }
        })
        
        const model = monaco.editor.createModel(value, 'typescript');
        const editor = monaco.editor.create(host.value, {
            theme: 'vs-dark'
        }); 
        
        editor.setModel(model);
        const disposeChangeContext = editor.onDidChangeModelContent(() => {
            if(typeof updatecallback == 'function'){
                //console.log(123, e)
            }
        })

        this.disposables.push(disposeChangeContext);
        this.disposables.push(disposable);
        this.editor = editor;

        return editor;
    }
    public dispose(){
      this.disposables.forEach(x => x.dispose());
      this.editor.dispose();
    }
}
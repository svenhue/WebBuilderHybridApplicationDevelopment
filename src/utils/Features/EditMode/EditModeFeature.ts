import { IDataAdapter, IViewConfiguration } from "alphautils";
import { ViewPositioningHelper } from "../../Helpers/ViewPositioningHelp";
import {  ref, Ref } from "vue";
import { inject, interfaces, injectable } from 'inversify';
import { RunTimeVueApplicationViewModel } from "src/ViewModels/RuntimeVueApplicationViewModel";
import { Editor } from '@tiptap/core'
import Quill from 'quill';

@injectable()
export class EditModeFeature{

    private dataAdapterConstructor: interfaces.Newable<IDataAdapter>

    private dataAdapter: IDataAdapter;

    constructor(
        @inject("DataAdapterConstructor") dataAdapterConstructor: interfaces.Newable<IDataAdapter>
    ){
        this.dataAdapterConstructor = dataAdapterConstructor;
    }

    public enable(viewModel: RunTimeVueApplicationViewModel){

        const root = document.getElementById("development-container");

        root.addEventListener("click", Listener);

        let targetTextNode: HTMLElement | null = null;

        let lastEditedElement: HTMLElement | null = null;

        function Listener(event: MouseEvent ){

            if(event?.target?.classList.contains("editor-button") || event?.target?.id == "1234phß0nb283cr45zt234" ){
                return
            }


            const target = ViewPositioningHelper.FindNextViewElement(event) as HTMLElement
            let selection: Selection | null = null;
            let editorElement: HTMLDivElement | null = null;

            
            
            targetTextNode = findTextNode(target);
            //todo

            if(lastEditedElement != null && lastEditedElement != targetTextNode){
                lastEditedElement.contentEditable = "false";
            }

            if(targetTextNode == null){
                return;
            }

            targetTextNode.contentEditable = "true"; 
            getAllChildNodes(targetTextNode).forEach(node => {
                    node.contentEditable = "true";   
            })

            targetTextNode.focus();
            targetTextNode.classList.add("IAMEDITED")
            lastEditedElement = targetTextNode;

            targetTextNode.addEventListener('mouseup', ShowEditorBar)
            
            getAllChildNodes(targetTextNode).forEach(node => {
                    node.addEventListener('mouseup', ShowEditorBar) 
            })

            document.addEventListener('click', HandleDisableElementEditing)

            function HandleDisableElementEditing(event: MouseEvent){
                const allChilds = getAllChildNodes(targetTextNode);
                if(event.target != targetTextNode && event.target.classList.contains("editor-button") == false && allChilds.includes(event.target as HTMLElement) == false){    
                    targetTextNode.contentEditable = "false";
                    targetTextNode.removeEventListener('mouseup', ShowEditorBar)
                    getAllChildNodes(targetTextNode).forEach(node => {
                            node.contentEditable = "false";
                            node.removeEventListener('mouseup', ShowEditorBar)
                    })

                    const el = document.querySelectorAll("[id^='1234phß0nb283cr45zt234']")

                    el?.forEach(e => {return e.remove()})
                    document.removeEventListener('click', HandleDisableElementEditing)

                    targetTextNode.removeEventListener('mouseup', ShowEditorBar)
                }
            }
            if(target == null || target == undefined){
                return 
            }
            
            function ShowEditorBar(event: MouseEvent){
                const initText = JSON.parse(JSON.stringify(targetTextNode.textContent));
                const propkey = getPropKey(parseInt(target.dataset['element'].replace('element_', '') as string));
                //viewModel.PartialUpdateView(parseInt(target.dataset['element'].replace('element_', '') as string), {keyValuePairs:[{key: propkey, value: ""}]});
                const el = document.querySelectorAll("[id^='1234phß0nb283cr45zt234']")
                el?.forEach(e => e.remove())

                editorElement = editorView(targetTextNode).mount(event);
                selection = document.getSelection()
                 
                
            }
          


            function editorView(target: HTMLElement){

                const mount = (event: MouseEvent) => {
                    
                    const exists = document.getElementById("1234phß0nb283cr45zt234")
            
                    if(exists != null){
                        return;
                    }
            
                    const root = document.createElement('div');
                    root.id = "1234phß0nb283cr45zt234"
                    root.style.zIndex = "999999"
                    root.style.position = "absolute";
            
                    root.style.top = event.y - 50 + "px";
                    root.style.left = event.x - 50 + "px";
                    
                    root.style.height = "40px";
                    root.style.backgroundColor = "black";
                    //root.style.opacity = "0.8";
                    root.style.width = "200px"
                    const container = document.createElement('div');
                    
            
                    const boldButton = document.createElement('button');
                    boldButton.style.width = "40px";
                       root.style.zIndex = "999999"
                    boldButton.style.height = "40px";
                    boldButton.style.backgroundColor = "red";
                    boldButton.classList.add("editor-button")
                    boldButton.style.color= "green"
                    boldButton.innerHTML = "B";
                    boldButton.addEventListener('click', () => {
                        markRangeBold(selection)
                        updateNode();
                    })
                    container.appendChild(boldButton);
                    
                    const italicButton = document.createElement('button');
                    italicButton.style.width = "40px";
                    italicButton.style.height = "40px";
                    italicButton.style.backgroundColor = "red";
                    italicButton.classList.add("editor-button")
                    italicButton.style.color= "green"
                    italicButton.innerHTML = "I";
                    italicButton.addEventListener('click', () => {
                        markRangeItalic(selection)
                        updateNode();
                    })
                    container.appendChild(italicButton);


                    const clearButton = document.createElement('button');
                    clearButton.style.width = "40px";
                    clearButton.style.height = "40px";
                    clearButton.style.backgroundColor = "red";
                    clearButton.classList.add("editor-button")
                    clearButton.style.color= "green"
                    clearButton.innerHTML = "C";
                    clearButton.addEventListener('click', () => {
                        console.log(5555)
                        clearFormatting(selection)
                        updateNode();
                    })

                    container.appendChild(clearButton);

                    root.appendChild(container);
            
                    document.body.appendChild(root);
                    
                    return root;

                    function updateNode(){
                        const nodeId = parseInt(target.dataset['element'].replace('element_', '') as string);
                        console.log("updatenode", nodeId, targetTextNode.innerHTML)
                        viewModel.PartialUpdateView(parseInt(target.dataset['element'].replace('element_', '') as string), {keyValuePairs:[{key: getPropKey(nodeId), value: targetTextNode.innerHTML}]});
                    }
                }
            
                const unmount = () => {
                    // Remove the root element
                    const el = document.getElementById("1234phß0nb283cr45zt234")
            
                    el.remove()
            
                }
            
                return {
                    mount,
                    unmount
                }
            }
            
            function markRangeBold(selection: Selection){
                const range = selection.getRangeAt(0)
            
                const boldWrapper = document.createElement('strong');
                range.surroundContents(boldWrapper);
                selection.removeAllRanges();
            }

            function markRangeSuperScript(selection: Selection){
                const range = selection.getRangeAt(0)
            
                const superWrapper = document.createElement('sup');
                range.surroundContents(superWrapper);
                selection.removeAllRanges();
            }

            function markRangeSubScript(selection: Selection){
                const range = selection.getRangeAt(0)
            
                const subWrapper = document.createElement('sub');
                range.surroundContents(subWrapper);
                selection.removeAllRanges();    
            }

            function markRangeCode(selection: Selection){
                const range = selection.getRangeAt(0)
                console.log(123, selection.anchorNode)
                const codeWrapper = document.createElement('code');
                range.surroundContents(codeWrapper);
                selection.removeAllRanges();
            }

            function clearFormatting(selection: Selection){
                removeFormatting(selection);
            }
            function removeFormatting(selection) {
                const range = selection.getRangeAt(0);
            
                // Clone the contents of the range to preserve the original structure
                const fragment = range.cloneContents();
            
                // Recursively remove specific tags in the cloned fragment
                const tagsToRemove = ['strong', 'em', 'code'];
                function removeTags(node) {
                    // If the node is an element and matches any tag in `tagsToRemove`
                    if (tagsToRemove.includes(node.tagName)) {
                        // Replace the node with its child nodes (unwrap it)
                        while (node.firstChild) {
                            node.parentNode.insertBefore(node.firstChild, node);
                        }
                        node.remove();
                    } else {
                        // If the node has children, recursively process them
                        node.childNodes.forEach(child => removeTags(child));
                    }
                }
            
                // Apply the removal to each node in the cloned content
                Array.from(fragment.childNodes).forEach(removeTags);
            
                // Replace the original range content with the cleaned fragment
                range.deleteContents();
                range.insertNode(fragment);
            
                // Clear the selection
                selection.removeAllRanges();
            }

            function markRangeItalic(selection: Selection){
                const range = selection.getRangeAt(0)
            
                const italicWrapper = document.createElement('em');
                range.surroundContents(italicWrapper);
                selection.removeAllRanges();
            }
    
            function findTextNode(root: HTMLElement): HTMLElement{
                let potentialElement = null;
                if(root.dataset['textnode'] != undefined){
                        
                    return root
                }
                else if(root.parentElement?.dataset['textnode'] != undefined){
                    return root.parentElement
                }else{

                    potentialElement = root?.closest('[textnode]');
                    if(potentialElement != undefined){
                        return potentialElement;
                    }
                    potentialElement = root?.querySelector('[textnode]');
                    if(potentialElement != undefined){
                        return potentialElement;
                    }

                    
                }
                return undefined;
            }

            function setTextValuetoNodeProp(text: string, nodeId: number){
                const node = viewModel.GetViews().find(n => n.id == nodeId);
                let key = getPropKey(nodeId);
                viewModel.PartialUpdateView(nodeId, {keyValuePairs:[{key: key, value: text}]}, text);
            }

            function getPropKey(nodeId: number){
                const node = viewModel.GetViews().find(n => n.id == nodeId);
                let key = "content.text"
                if(node == undefined){
                    return;
                }
                if(typeof node.content == "string"){
                    key = "content";
                }
                else if(node.content?.label != undefined){
                    key = "content.label";
                }else if (node.content?.text != undefined){
                    key = "content.text";
                }
                return key;
            }
            
        }
    }

    public disable(){

        const root = document.getElementById("development-container");

        root.removeEventListener("dblclick", this.Listener);


    }


    
}


function createEditor(targetId: string): Quill {
    const quill = new Quill('#' + targetId, {
        theme: 'snow',
        modules: {
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              ['image', 'code-block'],
            ],
          },
      });
    
      return quill;
   
}

function getAllChildNodes(node) {
    let nodes = [];

    function traverse(currentNode) {
        nodes.push(currentNode); // Add the current node to the list
        currentNode.childNodes.forEach(child => traverse(child)); // Recurse on each child node
    }

    traverse(node);
    return nodes;
}

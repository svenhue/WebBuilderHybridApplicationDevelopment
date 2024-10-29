import { Ref } from "vue";
import { injectable, inject } from "inversify";
import { IDataAdapter, IViewConfiguration, useApplicationStore, waitForElm } from "alphautils";
import { EditorModes } from "./Enums/EditorModes";
import  EditModeFeature from "../../../utils/Features/EditMode/EditModeFeature";
import { interfaces } from "inversify";
import { RunTimeVueApplicationViewModel } from "src/ViewModels/RuntimeVueApplicationViewModel";

@injectable()
class ApplicationDevelopmentSettingsService{


    public store = useApplicationStore()

    private editorModeFeature: EditModeFeature;

    constructor(
        @inject("EditModeFeature") EditModeFeature: EditModeFeature
    ){
        
        this.store.devSettings.showDevBorders = true;
        this.store.devSettings.useViewTemplates = true;
        this.store.devSettings.developmentMode = 'disableHinderingEvents';
        this.store.devSettings.editorMode = EditorModes.design;

        this.editorModeFeature = EditModeFeature;

    }

    public ChangeEditorMode(mode: EditorModes, viewModel: RunTimeVueApplicationViewModel){
        this.store.devSettings.editorMode = mode;
        if(this.store.devSettings.editorMode == EditorModes.edit){
            this.editorModeFeature.enable(viewModel);
        }else{
            this.editorModeFeature.disable();
        }
    }

    public OnNewElement(view: IViewConfiguration){        
        waitForElm('[data-element="element_' + view.id + '"]').then((el) => {
            this.SetElementDevBorder(el,  this.store.devSettings.showDevBorders);
        })
    }

    public SetElementDevBorder(element: HTMLElement, showThem: boolean = true){
        if(showThem == false){
            element.style.border = element.style.border.replace('0.5px dashed black', '');
        }else{
            element.style.border =  element.style.border + '0.5px dashed black'
        }
    }
    public ChangeDevelopmentMode(mode: string){
        this.store.devSettings.developmentMode = mode;
    }

    public ChangeTemplateSetting(){
        this.store.devSettings.useViewTemplate != this.store.devSettings.useViewTemplates
    }
    public ChangeDevBorderSetting(showThem: boolean = true){
       
        this.store.devSettings.showDevBorders = showThem;
        const elements = document.querySelectorAll('[data-element]');
        elements.forEach((element) => {           
            this.SetElementDevBorder(element as HTMLElement, showThem);
        })
    }
}

export { ApplicationDevelopmentSettingsService }
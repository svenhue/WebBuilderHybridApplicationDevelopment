import { Ref } from "vue";
import { injectable } from "inversify";
import { IViewConfiguration, useApplicationStore, waitForElm } from "alphautils";

@injectable()
class ApplicationDevelopmentSettingsService{

    public showDevBorders: Ref<boolean> 
    public useViewTemplates: Ref<boolean>
    public developmentMode: Ref<string>
    public store = useApplicationStore()

    constructor(){
        
        this.store.devSettings.showDevBorders = true;
        this.store.devSettings.useViewTemplates = true;
        this.store.devSettings.developmentMode = 'disableHinderingEvents';
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
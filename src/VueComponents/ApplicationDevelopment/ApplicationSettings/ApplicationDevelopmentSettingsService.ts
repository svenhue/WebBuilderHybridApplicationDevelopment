import { Ref, ref } from "vue";
import { injectable } from "inversify";
import { IViewConfiguration, waitForElm } from "alphautils";

@injectable()
export class ApplicationDevelopmentSettingsService{

    public showDevBorders: Ref<boolean> 
    public useViewTemplates: Ref<boolean>

    constructor(){
        this.showDevBorders = ref(true);
        this.useViewTemplates = ref(false);
    }


    public OnNewElement(view: IViewConfiguration){        
        waitForElm('[data-element="element_' + view.id + '"]').then((el) => {
            this.SetElementDevBorder(el, this.showDevBorders.value);
        })
    }

    public SetElementDevBorder(element: HTMLElement, showThem: boolean = true){
        if(showThem == false){
            element.style.border = element.style.border.replace('0.5px dashed black', '');
        }else{
            element.style.border =  element.style.border + '0.5px dashed black'
        }
    }


    public ChangeDevBorderSetting(showThem: boolean = true){
        console.log(this.showDevBorders.value, showThem)
        this.showDevBorders.value = showThem;
        const elements = document.querySelectorAll('[data-element]');
        elements.forEach((element) => {           
            this.SetElementDevBorder(element as HTMLElement, showThem);
        })
    }
}
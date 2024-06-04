import { BaseViewModel } from "alphautils";
import { Ref, ref } from "vue";
import { ILocale } from "./ILocale";
import { ILanguageFileString } from "./ILanguageFileString";

//todo replace the interfaces with the from utils
export class InternationalizationViewModel{
    

    langFilesString: Ref<Array<ILanguageFileString>>;

    constructor(
        contextid: number, //must be app level context
        langFilesString?: Array<ILanguageFileString>){

        this.langFilesString = ref(langFilesString ?? []);
        
    }

    public GetLocales(): Array<ILocale>{
        return this.langFilesString.value?.map(l => {
            return {
                code: l.code,
                file: l.file,
                name: l.name
            }
        });
    }

    public GetFileStringByCode(code: string): ILanguageFileString{
        return this.langFilesString.value.find(l => l.code == code);
    }

    public SetFileStringByCode(code: string, fileString: string){
        const langFileString = this.langFilesString.value.find(l => l.code == code);
        console.log(code, fileString, langFileString);
        langFileString.fileString = fileString;
        
    }

    public AddLanguageFileString(langFileString: ILanguageFileString){
        this.langFilesString.value.push(langFileString);
    }
}
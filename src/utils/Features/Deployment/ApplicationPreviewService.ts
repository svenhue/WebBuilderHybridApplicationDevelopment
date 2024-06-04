
import { WebContainerService } from "./WebContainerService";


export class ApplicationPreviewService extends WebContainerService{


    constructor(){
        super();
    }

    public async startPreview(){
        //todo nuxt errors
        await this.boot();
        
        await this.Run()

        
    }
}
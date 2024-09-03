import { Dir } from "./IDirsAndFiles";
import { WebContainerService } from "./WebContainerService";
import FileSaver from 'file-saver';
import JSZip, { file } from 'jszip';

export class ApplicationBuildService extends WebContainerService{

    private readonly _buildOutputDirectory: string = './.output';
    
    public async Build(prerender: boolean = true){
        
       
        let result = null;
        await this.boot();
        
       
        await this.env.RunCommand(this.api.containerInstance, 'npm', ['run', 'generatePages'], true)

        //spa/ mpa or static pages/ ssr?
        const command = ['run']

        if(prerender == true){
            command.push('generate')
        }else{
            command.push('build')
        }

        await this.env.RunCommand(this.api.containerInstance, 'npm', command, true, "You can preview", async () => { // you can deploy XX for generate
            
            await this.DoPostBuildRoutine()

            result = await this.GetBuildDirectory()
            
            const zip = await this.CreateZip(result)
            const t = this;
            
            const r = await zip.generateAsync({ type: 'blob', compression: "STORE" }).then(function (content) {
                FileSaver.saveAs(content, 'download.zip');
            });

        }
        );

        
    }

    private async CreateZip(dirx: Dir){
       
        const zip = new JSZip();

        for(const dir of dirx.subDirs){
            createContent(dir)
        }
        
        for(const file of dirx.files){
            //fix this in place
            zip.file(dirx.name + "/"+ file.name, file.value, {compression:"STORE"})
        }
        

        function createContent(dir: Dir){
            for(const file of dir?.files){
                let dirPath = dir.name + '/' + file.name

                if(dirPath.startsWith("/")){
                    dirPath = dirPath.substring(1);
                }

                zip.file(dirPath, file.value, {compression: "STORE"})
            
            }

            for(const subDir of dir.subDirs){
                createContent(subDir)
            }  
        }
        return zip;
    }

        

    private async GetBuildDirectory(): Promise<Dir>{
        
        const result = await copyDirOrFile(this._buildOutputDirectory, this)
        async function copyDirOrFile(dirPath, self: ApplicationBuildService){

            const dirFn = await self.api.containerInstance.fs.readdir(dirPath)

            const rootDir: Dir = {name: dirPath, files: [], subDirs: []}

                for(const dirOrFile of dirFn){  
                    let isDir = true
                    let file;
                    
                    try{
                        file = await self.api.containerInstance.fs.readdir(dirPath + '/' + dirOrFile, { encoding: 'utf-8'})
                        
                    }catch(e){
                        isDir = false
                    }
                    if(!isDir){
                        file = self.api.containerInstance.fs.readFile(dirPath + '/' + dirOrFile, "utf-8")
                        
                        rootDir.files.push({value:file, name: dirOrFile})

                    }else{
                        
                        const newDir = await copyDirOrFile(dirPath + '/' + dirOrFile, self)
                        rootDir.subDirs.push(newDir)
                    }
                }
                return rootDir;
        }

        //transform ./.output to /output

        function fixOutputPath(dir: Dir){
            dir.name = dir.name.substring(3)

            for(const d of dir?.subDirs){
                fixOutputPath(d)
            }
        }

        fixOutputPath(result);

        return result;
        
    }
    //this routine is a workaroung for two know bugs
    private async DoPostBuildRoutine(){

        // edit the package.json of source-map-js
        // todo how to transform the strings correctly?
        try{
            let newFileString;
            let oldFileString = await this.api.containerInstance.fs.readFile(this._buildOutputDirectory + "/server/node_modules/source-map-js/package.json", "utf-8");

            newFileString = oldFileString.replace(',\n    "Nicolas Lalevée <nicolas.lalevee@hibnet.org>"', ',\n    "Nicolas Laleveee <nicolas.lalevee@hibnet.org>"')
            newFileString = newFileString.replace('\n    "Eddy Bruël <ejpbruel@mozilla.com>",', '\n    "Eddy Bruel <ejpbruel@mozilla.com>",')
            
            await this.api.containerInstance.fs.writeFile(this._buildOutputDirectory + "/server/node_modules/source-map-js/package.json", newFileString)
            
        }catch(err){
        }

        // delete all content-length headers for chunks in public/_nuxt because they are partially wrong
        //todo workaround?
        try{
            const runtimePath = this._buildOutputDirectory + "/server/chunks/runtime.mjs"
            const dir: string[] = await this.api.containerInstance.fs.readdir(this._buildOutputDirectory + '/public/_nuxt', { encoding: 'utf-8'})

            let oldFileString: string = await this.api.containerInstance.fs.readFile(runtimePath, "utf-8");
           
            for(const fileName of dir.filter(x => x.endsWith(".js") || x.endsWith(".css"))){  
           
           
                const indexStart = oldFileString.indexOf("/_nuxt/" + fileName)

                const sizeIndex = oldFileString.indexOf("size", indexStart);

                const indexComma = oldFileString.indexOf(",", sizeIndex);

                const stringToReplace = oldFileString.substring(sizeIndex, indexComma +1 )

                oldFileString.replace(stringToReplace, "")
                await this.api.containerInstance.fs.writeFile(runtimePath, oldFileString);

            }

        }catch(err){
        }
    }

}                      
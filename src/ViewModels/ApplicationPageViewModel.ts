//@ts-ignore
//@ts-nocheck
import { BusinessObject, DataAdapter, IPageConfiguration, IViewConfiguration, KeyValuePair, SimpleNameValueCollection } from "alphautils";
import { Ref, ref } from "vue";
import { interfaces } from "inversify";
import { ViewConfigurationService } from "../utils/Services/ViewConfigurationService";
import { set } from "lodash-es";
import { PageConfigurationHelper } from "../utils/Services/Development/PageConfigurationHelper";

//@injectable()
export class ApplicationPageViewModel{

    public views: Ref<Array<IViewConfiguration>> 
    public role: Ref<string> 
    public contextid: number

    public page: Ref<IPageConfiguration>
    private dataAdapter: DataAdapter
    private boType = new BusinessObject({
        name: 'Page',
        propertys: []
    })
    private viewservice: ViewConfigurationService
    private viewDataAdapter: DataAdapter
    

    constructor(
        page: IPageConfiguration,
        dataAdapterConstructor: interfaces.Newable<DataAdapter>,
        viewService: ViewConfigurationService,
        container){
        
        this.viewservice = viewService
        this.dataAdapter = new dataAdapterConstructor({
            boType: this.boType,
            persistLocalStorage: true,
            contextId: 0 // the root context has always the id = 0
        }, 0, container)
        
        const npage = this.dataAdapter.Create(page) as unknown as IPageConfiguration 
        this.page = ref(npage)
        this.contextid = npage.contextid
        
        this.role = ref(page.role)
        this.views = ref([])
        this.viewDataAdapter = new dataAdapterConstructor({
            boType: new BusinessObject({
                name: 'ViewConfiguration',
                propertys: []
            }),
            persistLocalStorage: true,
            contextId: this.contextid
        },this.contextid, container)
        for(const view of page.views){
            const initView = this.viewservice.Create(view.type, view, view.parentId, false, undefined, false, page.views)
            for(const v of initView){
                const newV = this.viewDataAdapter.Create(v, this.contextid) as unknown as IPageConfiguration
                this.views.value.push(newV)
            }
        }

    }
    public AddView(view: IViewConfiguration){
        const newView = this.viewDataAdapter.Create(view, this.contextid)
        console.log(newView)
        this.views.value.push(newView) 
        return newView;
    }
    public UpdateView(id: number, view: IViewConfiguration, oldValue?: IViewConfiguration){
        const newv = this.viewDataAdapter.Update(id, view, this.contextid, oldValue)
        const i = this.views.value.findIndex(v => v.id == id)
        if(i == undefined){
            throw new Error('No view with id ' + id + ' found')
        }
        this.views.value[i] = newv
        return newv;
    }
    public PartialUpdateView(id, values: SimpleNameValueCollection, oldValue?: IViewConfiguration){
        const view = this.views.value.find(v => v.id == id)
        for(const keyValue of values.keyValuePairs){
            set(view, keyValue.key, keyValue.value)
        }
        this.viewDataAdapter.UpdatePartial(id, values, this.contextid, undefined, oldValue)
    }
    public DeleteView(id: number){
        
        const i = this.views.value.findIndex(v => v.id == id)
        if(i == undefined){
            throw new Error('No view with id ' + id + ' found')
        }
        this.viewDataAdapter.UpdatePartial(this.views.value[i].id, new SimpleNameValueCollection([{key: 'properties.isActive', value: false}]))
        setTimeout(() => {
            this.viewDataAdapter.Delete(this.views.value[i], this.contextid)
            this.views.value.splice(i, 1)
        }, 3000)
        
    }
    public DeletePage(){
        this.dataAdapter.Delete(this.page.value, this.contextid)

        for(const view of this.views.value){
            this.viewDataAdapter.UpdatePartial(view.id, new SimpleNameValueCollection([{key: 'properties.isActive', value: false}]))
        }
    }
    public UpdatePage(values: Array<KeyValuePair>){
        for(const pair of values){
            set(this.page.value, pair.key, pair.value)
        }
        this.dataAdapter.UpdatePartial(this.page.value.id, new SimpleNameValueCollection(values), this.contextid)
    }
    public PreparePageConfig(){
        
        this.page.value.views = [];

        for(const view of this.views.value){
            this.page.value.views.push(view)
        }

        PageConfigurationHelper.validatePage(this.page.value)
    }
}
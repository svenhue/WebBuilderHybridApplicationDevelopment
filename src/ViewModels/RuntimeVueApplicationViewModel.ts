//@ts-ignore
//@ts-nocheck
import {   ref, Ref, computed, provide, inject} from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { ApplicationDeploymentModes, IApplicationConfiguration, useWebNodeStore, IDataAdapter, 
    ApplicationConfiguration, waitForElm,  useModellingStore, IViewElement, IViewConfiguration, IApplication, Screen, ApplicationFactory, VueApplication, SimpleNameValueCollection, IPageConfiguration, KeyValuePair } from 'alphautils';

//import { ApplicationServices } from '../Services/ApplicationServices';
import { ViewConfigurationService } from '../Services/ViewConfigurationService';
import { FocussedViewContextService } from '../Services/Designer/FocussedViewContextService';
import { ApplicationService } from '../Services/Development/ApplicationService';
import { BaseServiceProvider } from 'alphautils';
import { StyleManagerViewModel } from './StyleManagerViewModel';
import BackgroundFacadeComponent from '../VueComponents/ApplicationDevelopment/BackgroundFacadeComponent.vue';

import { getCurrentInstance, Ref } from 'vue';
import { useRouter } from 'vue-router';
import { DefaultRuntimeApplicationStartup } from '../utils/Application/Startups/DefaultRuntimeApplicationStartup';
import { ApplicationPageViewModel } from './ApplicationPageViewModel';
import { interfaces } from 'inversify';
import { ViewChangedAgendsProvider } from '../utils/Agents/DesignerAgents/ViewChangedAgendsProvider';
import { StyleService } from '../utils/Services/Designer/StyleService';
import { PageService } from '../utils/Services/Development/PageService';
import { getActivePinia } from 'pinia';
import { InternationalizationViewModel } from '../utils/Features/Internationalization/InternationalizationViewModel';
import { getCurrentInstance } from 'vue';
import { ApplicationDevelopmentSettingsService } from '../VueComponents/ApplicationDevelopment/ApplicationSettings/ApplicationDevelopmentSettingsService';
import {VueI18n } from 'vue-i18n';

export class RunTimeVueApplicationViewModel{
    
    FocussedViewService: FocussedViewContextService
    private service: ApplicationService;
    private serviceProvider: BaseServiceProvider;
    public viewService: ViewConfigurationService
    private viewChangedAgendProvider: ViewChangedAgendsProvider
    styleManager: StyleManagerViewModel
    private facadeRef: typeof BackgroundFacadeComponent
    private factory: ApplicationFactory
    public currentPage: Ref<number>;
    private pages: Array<ApplicationPageViewModel> = [];
    private pagesContextRef: Ref<Array<number>> = ref([]);
    styleService: StyleService
    private dataAdapterConstructor: interfaces.Newable<IDataAdapter>
    public settingsService: ApplicationDevelopmentSettingsService

    public languageViewModel: InternationalizationViewModel
    customCss: Ref<string> = ref('');

    focusIsFixed = false;
    currentRoute: RouteRecordRaw
    applicationConfiguration: Ref<IApplicationConfiguration>;
    app: IApplication
    
    focussedViews: Ref<Array<number>> = ref([]);
    hoveredView: Ref<IViewConfiguration | undefined> = ref(undefined);
    disableHover: Ref<boolean> = ref(false);

    viewDataAdapter: IDataAdapter

    constructor(
        solutionname: string,
        facadeRef: typeof BackgroundFacadeComponent,
        i18n: VueI18n
        ){
        this.FocussedViewService = this.UseService<FocussedViewContextService>('FocussedViewContextService');
        this.facadeRef = facadeRef;
        this.service = BaseServiceProvider.Service<ApplicationService>('ApplicationService') as ApplicationService;
        this.viewService = this.UseService<ViewConfigurationService>('ViewConfigurationService');
        this.viewChangedAgendProvider = this.UseService<ViewChangedAgendsProvider>('ViewChangedAgendsProvider');

        const config = this.service.GetApplicationConfigByName(solutionname);
        //this.currentRoute = currentRoute;
      
        this.applicationConfiguration = ref(config);
       
        this.currentPage = ref();        
        this.pagesContextRef = ref([])
        this.sessioncontextid = this.applicationConfiguration.value.contextid;
        

        this.InitializeApplicationContext(this.applicationConfiguration.value)
        this.serviceProvider = new BaseServiceProvider(config.contextid)

        this.WatchForScreenChanges();

        this.styleManager = new StyleManagerViewModel();
        this.styleService = this.UseService<StyleService>('StyleService');
        this.settingsService = BaseServiceProvider.ServiceWithContext<ApplicationDevelopmentSettingsService>('ApplicationDevelopmentSettingsService', 0) as ApplicationDevelopmentSettingsService;

        this.dataAdapterConstructor = this.UseService<interfaces.Newable<IDataAdapter>>('DataAdapterConstructor');
        
        provide('styleManager_' + this.applicationConfiguration.value.contextid, this.styleManager)
        provide('applicationViewModel', this)
        provide('devMode', this.settingsService.store.devSettings.developmentMode)
        this.InitInternationalization(i18n);

    }
    public InitInternationalization(i18n){
        const vM = new InternationalizationViewModel(i18n, this.applicationConfiguration.value);
        this.languageViewModel = vM;
        if(this.applicationConfiguration.value.internationalization != undefined){
            if(this.applicationConfiguration.value.internationalization.locales != undefined){
                for(const locale of this.applicationConfiguration.value.internationalization.locales){
                    vM.AddLanguageFileString(locale);
                }
            }
        }

        this.app.rootApp.provide('languageVM_' + this.applicationConfiguration.value.contextid, vM);
  
    }

    public NavigateToPage(name: string){
        const page = this.pages.find(p => p.page.value.name == name);
        if(page == undefined){
            throw Error('Page not found')
        }
        if(this.currentPage.value == page.contextid){
            return;
        }
        this.viewChangedAgendProvider.setContext(page.contextid);

        this.currentPage.value = page.contextid;
    }
    private AddViewToPage(view: IViewConfiguration){
        const page = this.pages.find(p => p.contextid == this.currentPage.value);
        return page.AddView(view);
    }
    AddRawViewElement(view: IViewConfiguration){
        view.contextid = this.currentPage.value;
        view.publicidentifier = this.createPublicIdentifier(view);
        const newNode = this.AddViewToPage(view);
        this.AddNodeToParentChildren(newNode);
        return newNode;
    }
    public GetChildren(id: number){
        const view = this.GetViews().find(c => c.id == id);
        const children = view?.children?.find(c => c.type == 'childrenCollection');
        if(children == undefined){
            return [];
        }
        return this.GetViews().filter(c => children.value.includes(c.id));
    }
    public createElement(type: string, values?){

        const result =  this.viewService.Create(type, values, undefined, this.settingsService.store.devSettings.useViewTemplates, this.applicationConfiguration.value.name, false, this.GetViews());
        return result;
    }
    addViewElement(type: string,  parentid: number, node: IViewConfiguration, useFactory: boolean = true){

        if(useFactory){
            node = this.viewService.Create(type, node, parentid, this.settingsService.store.devSettings.useViewTemplates, this.applicationConfiguration.value.name, undefined, this.GetViews());
        }
        if(Array.isArray(node)){
            for(const n in node){
                this.AddRawViewElement(n);
            }
            const topNode = node.reduce((prev, curr) => prev.parentId < curr.parentId ? prev : curr);
            setTimeout(() =>this.focusView(topNode.id, true),100 )
        }else{
            if(parentid == undefined){
                return undefined
            }
            this.AddRawViewElement(node);
            this.AddNodeToParentChildren(node);
            this.focusView(node.id, true);
        }
    }   
    addViewElementbyDrop(e: Event, type: string, values?: IViewConfiguration){

        const potentialElement = this.viewService.Create(type, values, undefined, this.settingsService.store.devSettings.useViewTemplates.value, this.applicationConfiguration.value.name, undefined, this.GetViews());
        
        if(!Array.isArray(potentialElement)){
            this.positioningHelper.CreateShadowViewAndStartPositioning(e, [potentialElement], this);
        }else{
            this.positioningHelper.CreateShadowViewAndStartPositioning(e, potentialElement, this);
        }
    }

    tryFocus(e: MouseEvent, fixed = false){
       
        let potentialElement;
        if(fixed == true){
            if(e.target?.id == 'fucussed-helper'){
            }
            if(e.target.dataset.element != undefined){
                
                return this.focusView(parseInt(e.target.dataset.element.replace('element_', '')), true);
            }
            else if(e.target.parentElement?.dataset.element != undefined){
                return this.focusView(parseInt(e.target.parentElement.dataset.element.replace('element_', '')), true);
            }else{

                potentialElement = e.target?.querySelector('[data-element]');
                if(potentialElement != undefined){
                    return this.focusView(parseInt(potentialElement.dataset.element.replace('element_', '')), true);
                }

                potentialElement = e.target?.closest('[data-element]');
                if(potentialElement != undefined){
                    return this.focusView(parseInt(potentialElement.dataset.element.replace('element_', '')), true);
                }
            }
        }else{
            this.hoverView(e);
        }
    } 
    public hoverViewSafe(id: number){
        const el = document.querySelector('[data-element="element_' + id + '"]');
        if(el == undefined){
            return;
        }
        el.classList.add('focussed-element');

        const oldHoverdElement = document.getElementsByClassName('focussed-element');
                for(let i = 0; i < oldHoverdElement.length; i++){
                    if( parseInt(oldHoverdElement[i].getAttribute('data-element')?.replace('element_', '')) 
                    != this.focussedViews.value[0]){
                        oldHoverdElement[i].classList.remove('focussed-element');
                    }
                }
                const view = this.GetViews().find(c => c.id == id);
                
                
                this.hoveredView.value = view;
                this.FocussedViewService.hoveredView.value = view;

    }
    public hoverView(e: MouseEvent){
        const hover = this.disableHover
        if(hover.value != true){

            let potentialElement = this.FindNearestView(e);
            if(potentialElement != undefined){
                if(!potentialElement?.classList?.contains('development-root-component') && potentialElement != undefined && potentialElement.dataset.element != undefined){
                    const oldHoverdElement = document.getElementsByClassName('focussed-element');
                    for(let i = 0; i < oldHoverdElement.length; i++){
                        if( parseInt(oldHoverdElement[i].getAttribute('data-element')?.replace('element_', '')) 
                        != this.focussedViews.value[0]){
                            oldHoverdElement[i].classList.remove('focussed-element');
                        }
                    }
                    const el = this.GetViews().find(c => c.id == parseInt(potentialElement.dataset.element.replace('element_', '')));
                    potentialElement = potentialElement.classList.add('focussed-element');

                    
                    this.hoveredView.value = el;
                    this.FocussedViewService.hoveredView.value = el;
                }   
            }
        }
    }
    public GetViews(){
        const page = this.pages.find(p => p.contextid == this.currentPage.value);
        if(page == undefined){
            return [];
        }
        
        return page?.views.value;
    }
    public UpdateFocusedElement(values){
        if(values == undefined){
            return;
        }

        const view = this.GetFocussedElement().value;
        if(view == undefined){
            return;
        }
        const page = this.pages.find(p => p.contextid == this.currentPage.value);
        page.PartialUpdateView(view.id, {keyValuePairs:values});
    }
    public UpdateView(id: number, view: IViewConfiguration, oldValue: IViewConfiguration = undefined){
        const page = this.pages.find(p => p.contextid == this.currentPage.value);
        page.UpdateView(id, view, oldValue);
    }
    public PartialUpdateView(id, values: SimpleNameValueCollection, oldValues: IViewConfiguration){
        const page = this.pages.find(p => p.contextid == this.currentPage.value);
        page.PartialUpdateView(id, values, oldValues);
    }
    /* #region private Hilfsmethoden */
    private PrepareConfiguration(){
        

        this.applicationConfiguration.value.pages = [];
    
        for(const pageVM of this.pages){
            pageVM.PreparePageConfig();
            this.applicationConfiguration.value.pages.push(pageVM.page.value)    
        }

        this.languageViewModel.PrepareConfig(this.applicationConfiguration.value)
    }
    public GetConfiguration(){
        this.PrepareConfiguration();
        return this.applicationConfiguration.value;
    }
    public GetFocussedElement(){
        return computed(() => {
            return this.GetViews().find(c => c?.id == this.focussedViews.value[0])
        })
    }
    public GetRootView(contextid: number): IViewConfiguration{
        if(contextid == undefined){
            contextid = this.currentPage.value
        }
        return computed(() => {
            const page = this.pages.find(p => p.contextid == contextid);
            return page.views.value.find(v => v?.isRoot == true);
        }).value
    }


    private WatchForScreenChanges(){
        const screen = this.serviceProvider.GetService<Screen>('Screen');
        
        
        const callback = (width: number, height: number) => this.HandleScreenChanges(width, height);
        screen.Subscribe(callback)
    }
    private HandleScreenChanges(width: string, height: string){
        if(this.facadeRef.value == undefined){
            throw new Error('Facade is undefined')
        }

        this.facadeRef.value.ChangeFacadeStyle({width: width, height: height});
    }
    private InitializePages(pages: Array<IPageConfiguration>){
        for(const page of pages){
            const pageViewModel = new ApplicationPageViewModel(page, this.UseService<interfaces.Newable<IDataAdapter>>('DataAdapterConstructor'), this.viewService, this.app.container);
            this.pagesContextRef.value.push(pageViewModel.contextid);
            this.pages.push(pageViewModel);
        }
    }

    private InitializeApplicationContext(config: IApplicationConfiguration){
        const app = this.CreateShadowApplication(config);
        this.app = app
        if(this.applicationConfiguration.value.deploymentMode == ApplicationDeploymentModes.spaclient){
            this.InitializeSpaClient(this.applicationConfiguration.value)
        }else{
            this.InitializePages(config.pages)
        }
        
        const landingPage = this.GetPageEntitys().value.find(p => p.role == 'Landingpage');
        if(landingPage == undefined){
            throw new Error('No landing page found')
        }
        this.customCss.value = this.applicationConfiguration.value.stylesheets?.css ?? ''
        this.NavigateToPage(landingPage.name);

    }
    public GetPageEntitys(){
        return computed(() => {
            return this.pagesContextRef.value.map(p => {return this.pages.find(c => c.contextid == p)?.page.value})
        })
    }
    public GetPages(){
        return computed(() => {
            return this.pagesContextRef.value;
        })
    }
    public GetPageViews(pagecontext: number){
        return computed(() => {
            const page = this.pages.find(p => p.contextid == pagecontext);
            return page?.views.value;
        })
    }
    private InitializeSpaClient(config: IApplicationConfiguration){
        this.InitializePages(config.pages)
    }
    public RemoveNodeFromParentChildren(node: IViewConfiguration){
        const parent = this.GetViews().find(c => c?.id == node.parentId);
        if(parent == undefined){
            return;
        }
        const collection = parent.children?.find(c => c.type == 'childrenCollection');
        if(collection == undefined){
            return;
        }
        const i = collection.value.indexOf(node.id);
        if(i == -1){
            return;
        }
        collection.value.splice(collection.value.indexOf(node.id), 1);
        this.UpdateView(parent.id, parent);
    }

    public DeactivateView(id: number){
        const view = this.GetViews().find(c => c.id == id);
        if(view == undefined){
            return;
        }
        if(view.properties == undefined){
            view.properties = {};
        }
        view.properties.isActive = false;
        this.UpdateView(id, view);
    }
    public ActivateView(id: number){
        const view = this.GetViews().find(c => c.id == id);
        if(view == undefined){
            return;
        }
        view.isActive = true;
        this.UpdateView(id, view);
    }
    public AddNodeToParentChildren(newNode: IViewConfiguration | Array<IViewConfiguration>){
        
        if(!Array.isArray(newNode)){
            newNode = [newNode];
        }
        for(const node of newNode){
            // the new node is a root node
            if(this.GetViews().find(c => c?.id == node?.parentId) != undefined){
                
                const parent = this.GetViews().find(c => c.id == node.parentId);
                let collection = parent?.children?.find(c => c.type == 'childrenCollection');
                if(collection == undefined){
                    collection = {
                        type: 'childrenCollection',
                        value: []
                    }
                }else{
                    JSON.parse(JSON.stringify(collection));
                }
                if(collection.value.includes(node.id)){
                    return;
                }
               
                collection.value.push(node.id);
               
                //this.UpdateView(newNode.id, node);
                this.PartialUpdateView(parent?.id, new SimpleNameValueCollection([{key: 'children', value: [collection]}]), JSON.parse(JSON.stringify(parent)));

            }
        }

        
    }
    public FindNearestView(e: MouseEvent){
        const target = document.elementFromPoint(e.clientX, e.clientY)
        if(target == undefined || target == null){
            return undefined;
        }
        const elem = target.closest('[data-element]');
        return elem;
    }
    
    public focusView(id?: number, refocus = false){
            if(id == undefined && refocus == true){
                this.focussedViews.value  = [];
            }
            if(this.focussedViews.value.length == 1 && this.focussedViews.value[0] == id){
                return;
            }

            if(this.focussedViews.value.length > 0 && refocus == true){
                for(const id of this.focussedViews.value){
                    const el = document.querySelector('[data-element="element_' + id + '"]');
                    el?.classList.remove('focussed-element');
                }
                this.focussedViews.value = [id];
            }else{
                this.focussedViews.value.push(id);
            }
            waitForElm('[data-element="element_' + id + '"]').then((elm) => {
                if(!elm.classList.contains('focussed-element')){
                    elm.classList.add('focussed-element');
                }
            })  

            if(this.FocussedViewService.contextid != this.currentPage.value){
                const deleteHandler  = (id: number) => this.DeleteElement(id);
                const updateHandler = (id: number, view: IViewConfiguration) => this.updateElement(id, view);
                this.FocussedViewService.SetDeleteHandler(this.applicationConfiguration.value.contextid, deleteHandler);
                this.FocussedViewService.SetUpdateHandler(this.applicationConfiguration.value.contextid, updateHandler);
                this.FocussedViewService.SetFocussedView(this.GetViews().find(c => c.id == id));
                this.FocussedViewService.SetGetter(() => this.GetViews());
            }else{
                this.FocussedViewService.SetFocussedView(this.GetViews().find(c => c.id == id));
            }
           
    }
    private CreateShadowApplication(config: IApplicationConfiguration): IApplication{
        this.factory = BaseServiceProvider.Service<ApplicationFactory>('ApplicationFactory') as ApplicationFactory;

        const vueApp = getCurrentInstance().appContext.app;
        const router = useRouter();
        
        const startup = new DefaultRuntimeApplicationStartup();
        const pinia = getActivePinia()
        const app =  new VueApplication(config, undefined, vueApp, router, undefined, pinia)
                        .setup()
                        .useStartup(startup)
                        .build()
        return app;
    }
    public DeleteElement(id: number){
        const page = this.pages.find(p => p.contextid == this.currentPage.value);
        const node = this.GetViews().find(c => c.id == id); 
        console.log("delete", node)
        this.RemoveNodeFromParentChildren(node)
        page.DeleteView(id);
        
    }
      
    private createPublicIdentifier(view: IViewElement): string{
        //todo remove this logic?? duplicate with in viewconfigurationservice
        return 'element_' + view.id;
    }
    public DeletePage(name: string){
        const page = this.pages.find(p => p.page.value.name == name);
        if(page == undefined){
            return;
        }
        this.pagesContextRef.value.splice(this.pagesContextRef.value.indexOf(page.contextid), 1);
        page.DeletePage();
        const i = this.pages.indexOf(page);
        this.pages.splice(i, 1);
        this.currentPage.value = -1;
    }
    public UpdatePage(id: number, values: Array<KeyValuePair>){
        const page = this.pages.find(p => p.page.value.id == id);
        page.UpdatePage(values);
    }
    public AddPage(config?: IPageConfiguration){
        const page = PageService.CreatePageConfig(config);
        const vM =new ApplicationPageViewModel(page, this.dataAdapterConstructor, this.viewService, this.app.container);
        this.pages.push(vM);
        this.pagesContextRef.value.push(vM.contextid);
        
    }
    private UseService<T>(name: string): T{
        if(this.applicationConfiguration == undefined){
            return BaseServiceProvider.Service<T>(name)
        }
        return BaseServiceProvider.ServiceWithAppContext<T>(name, this.applicationConfiguration.value.contextid)?.service;
    }
    /* #endregion */
    
}
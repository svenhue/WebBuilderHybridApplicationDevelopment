//@ts-nocheck
//@ts-ignore

import { IDataAdapter, IViewConfiguration, SimpleNameValueCollection, waitForElm } from 'alphautils';
import { injectable } from 'inversify';
import { FocussedViewContextService } from '../Services/Designer/FocussedViewContextService';
import { RunTimeVueApplicationViewModel } from '../../ViewModels/RuntimeVueApplicationViewModel';
import { set } from 'lodash-es';
@injectable()
export class ViewPositioningHelper{
    private viewFocusService: FocussedViewContextService;
    

    constructor(
        dataAdapter: IDataAdapter,
        viewFocusService: FocussedViewContextService,

        )
    {
     
        this.viewFocusService = viewFocusService;
        this.viewFocusService.SubscribeContextChanged((old, newc) => this.HandleContextChange(old, newc))
    }
    public ChangeViewPosition(e:MouseEvent, view: IViewConfiguration, viewModel: RunTimeVueApplicationViewModel){
        //viewModel.DeactivateView(view.id);
        const shadow = this.CreateShadowView(e, [view], viewModel);
        this.BindShadowViewToMouse(shadow, [view], viewModel, true);
    }


    // drag a new view into the tree
    public CreateShadowViewAndStartPositioning(rootEvent: MouseEvent, targetview: Array<IViewConfiguration>, viewModel: RunTimeVueApplicationViewModel){

        const shadow = this.CreateShadowView(rootEvent, targetview, viewModel);
        this.BindShadowViewToMouse(shadow, targetview, viewModel);
        
        
    }
    private CreateShadowView(e: MouseEvent, targetview: Array<IViewConfiguration>, viewModel: RunTimeVueApplicationViewModel): IViewConfiguration{
        
        
        let parentNode = null;
        
        
        
        const hostView = this.GetHostView(targetview);

        if(hostView.parentId == undefined){
            parentNode = viewModel.GetRootView();
        }else{
            parentNode = viewModel.GetViews().find(c => c.id == hostView.parentId)
        }
        function HasNumbers(str: string): boolean{
            return /\d/.test(str);
        }

        const width = hostView.style?.width  != undefined  && HasNumbers(hostView.style?.width) ? hostView.style?.width : '50px';
        const height = hostView.style?.height != undefined && HasNumbers(hostView.style?.height) ? hostView.style?.height : '50px';

        let shadowView = {
            name: 'shadowView',
            tag: 'tag:div',
            parentId: parentNode.id,
            properties: {
                isActive: false
            },
            style:{
                top: e.offsetY + 'px',
                left: e.offsetY + 'px',
                position: 'absolute',
                width: width,
                height: height,
                border: '1px solid blue',
                zIndex: '1000',
            }
        } as IViewConfiguration

        shadowView = viewModel.AddRawViewElement(shadowView);
        
        return shadowView; 
    }
    private HoverViewAndPositionAndGetPosition(e: MouseEvent, viewModel: RunTimeVueApplicationViewModel){
        
        const find = (e) => this.FindNextViewElement(e)  

        let potentialElement:HTMLElement = this.FindNextViewElement(e);
        
        if(potentialElement == undefined){
            return;
        }

        let el: IViewConfiguration = null;
        let parentPosition = undefined;
        let position = undefined;
        let otherNextToPosition = undefined;
        let preventHoverDefault = false;
        let nextToElement: HTMLElement = undefined
        let positionMarker: string
        if(potentialElement != undefined){
            if(!potentialElement?.classList?.contains('development-root-component') && potentialElement != undefined && potentialElement.dataset.element != undefined){
                const oldHoverdElement = document.getElementsByClassName('focussed-element');
                for(let i = 0; i < oldHoverdElement.length; i++){
                    if( parseInt(oldHoverdElement[i].getAttribute('data-element')?.replace('element_', '')) 
                    != viewModel.focussedViews.value[0]){
                        oldHoverdElement[i].classList.remove('focussed-element', 'showTargetPositionLeftTop', 'showTargetPositionRightBottom');
                    }
                }
               
                SetPosition(e);
                if(!preventHoverDefault){
                    SetHovered();
                }
            }   
        }

        function SetHovered(){
                el = viewModel.GetViews().find(c => c.id == parseInt(potentialElement.dataset.element.replace('element_', '')));
                potentialElement.classList.add('focussed-element');
                
                viewModel.hoveredView.value = el;
                viewModel.FocussedViewService.hoveredView.value = el;
                ShowPosition();
        }
        function ShowPosition(){
            const oldElementslt = document.getElementsByClassName('showTargetPositionLeftTop');
            const oldElementsrb = document.getElementsByClassName('showTargetPositionRightBottom');

            for(let i = 0; i < oldElementslt.length; i++){
                oldElementslt[i].classList.remove('showTargetPositionLeftTop');
            }
            for(let i = 0; i < oldElementsrb.length; i++){
                oldElementsrb[i].classList.remove('showTargetPositionRightBottom');
            }
            switch(positionMarker){
                
                case 'left':
                    nextToElement.classList.add('showTargetPositionLeftTop')
                    break;
                case 'right':
                    nextToElement.classList.add('showTargetPositionRightBottom')
                    break;
                case 'top':
                    nextToElement.classList.add('showTargetPositionLeftTop')
                    break;
                case 'bottom':
                    nextToElement.classList.add('showTargetPositionRightBottom')
                    break;
            }
            
        }



        function SetPosition(e: MouseEvent){
            const rect = potentialElement.getBoundingClientRect();

            const x = e.clientX - rect.left; //x position within the element.
            const y = e.clientY - rect.top;  //y position within the element.

           const width = rect.width;
            const height = rect.height;

            otherNextToPosition = undefined;
            
            preventHoverDefault = true;
            nextToElement = potentialElement;

            const nextToView = viewModel.GetViews().find(c => c?.id == parseInt(nextToElement.dataset.element.replace('element_', '')));
            let otherChildren
            if(nextToView != undefined){
                otherChildren = viewModel.GetChildren(nextToView.parentId)
            }
            if(nextToView?.position != undefined){
                parentPosition = nextToView.position;
            }
            if(parentPosition == undefined){
                parentPosition = 1;
            }
            if(x > (width*0.15) && x < (width*0.85) && y > (height*0.15) && y < (height*0.85)){
                
                potentialElement = find(e);
                el = viewModel.GetViews().find(c => c.id == parseInt(potentialElement.dataset.element.replace('element_', '')));
                return;
            }
            else if(x < (width/2) && y > (height*0.15) && y < (height*0.85)){
                positionMarker = 'left';

                otherChildren?.filter(c => c.position < parentPosition).forEach(c => {
                    if(otherNextToPosition == undefined){
                        otherNextToPosition = c.position;
                    }else if(c.position > otherNextToPosition){
                        otherNextToPosition = c.position;
                    }
                })
                if(otherNextToPosition == undefined){
                    otherNextToPosition = parentPosition/2;
                }
                position = parentPosition - (Math.abs(parentPosition - otherNextToPosition) / 2);
            }else if(x > (width/2) && y > (height*0.15) && y < (height*0.85)){
                positionMarker = 'right';
                otherChildren?.filter(c => c.position > parentPosition).forEach(c => {
                    if(otherNextToPosition == undefined){
                        otherNextToPosition = c.position;
                    }else if(c.position < otherNextToPosition){
                        otherNextToPosition = c.position;
                    }
                })
                if(otherNextToPosition == undefined){
                    otherNextToPosition = parentPosition+1;
                }
                position = parentPosition + (Math.abs(parentPosition - otherNextToPosition) / 2)
            }else if(y < (height*0.15)){
                otherChildren?.filter(c => c.position < parentPosition).forEach(c => {
                    if(otherNextToPosition == undefined){
                        otherNextToPosition = c.position;
                    }else if(c.position > otherNextToPosition){
                        otherNextToPosition = c.position;
                    }
                })
                if(otherNextToPosition == undefined){
                    otherNextToPosition = parentPosition/2;
                }
                positionMarker = 'top';
                position = parentPosition - (Math.abs(parentPosition - otherNextToPosition) / 2)
            }else if(y > (height*0.85)){
                positionMarker = 'bottom';

                otherChildren?.filter(c => c.position > parentPosition).forEach(c => {
                    if(otherNextToPosition == undefined){
                        otherNextToPosition = c.position;
                    }else if(c.position < otherNextToPosition){
                        otherNextToPosition = c.position;
                    }
                })
                if(otherNextToPosition == undefined){
                    otherNextToPosition = parentPosition+1;
                }
                position = parentPosition + (Math.abs(parentPosition - otherNextToPosition) / 2)

            }
            potentialElement = potentialElement?.parentElement?.closest('[data-element]');
            if(potentialElement != undefined){
                if(!potentialElement?.classList?.contains('development-root-component') && potentialElement != undefined && potentialElement.dataset.element != undefined){
                    const oldHoverdElement = document.getElementsByClassName('focussed-element');
                    for(let i = 0; i < oldHoverdElement.length; i++){
                        if(!viewModel.focussedViews.value.includes(parseInt(oldHoverdElement[i].getAttribute('data-element')?.replace('element_', '')))){
                            oldHoverdElement[i].classList.remove('focussed-element', 'showTargetPositionLeftTop', 'showTargetPositionRightBottom');
                        }
                    }
                    SetHovered();
                }   
            }

        }
        if(position == undefined || Number.isNaN(position)){
            position = 1;
        }
        return {position: position, parent: el};
    }
    private BindShadowViewToMouse(shadowView: IViewConfiguration, targetView: Array<IViewConfiguration>, viewModel: RunTimeVueApplicationViewModel, targetExisted = false){

        viewModel.disableHover.value = true;
        const TryPlacing  = (e: MouseEvent, c,x, m) => this.TryPlaceShadowInNodeTree(e, c,x,m, viewModel);
        const Replace = (c, b, x) => this.ReplaceShadowViewWithRealView(c,b, viewModel, x);
        const HoverPosition = (e: MouseEvent) => this.HoverViewAndPositionAndGetPosition(e, viewModel);

        let oldparentId = shadowView.parentId;

        function setElementToMouse(e: MouseEvent){
            oldparentId = shadowView.parentId;
            const { position, parent} = HoverPosition(e);
            // if you want to show the shadow view in the editor, make the updates also in the viewmodel
            shadowView.position = position;

            if(parent != undefined){
                
                shadowView.parentId = parent?.id;
                if(oldparentId != parent.id){
                    viewModel.RemoveNodeFromParentChildren(shadowView)
                }
                if(parent?.id != undefined){
                    TryPlacing(e, shadowView, position, parent)      
                }
            }
        }


        function bindElementToMouse(){
            document.addEventListener('mousemove', setElementToMouse)
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', setElementToMouse)
                
                if(shadowView.parentId != undefined){
                    if(targetExisted == false){
                        Replace(shadowView, targetView, false)
                    }else{
                        Replace(shadowView, targetView, true)
                    }
                }
                viewModel.disableHover.value = false;
            }, { once: true})
        }

        bindElementToMouse();

    }
    private TryPlaceShadowInNodeTree(e: MouseEvent, shadowView: IViewConfiguration, position: number, parent, viewModel: RunTimeVueApplicationViewModel){
        
        if(shadowView.parentId != undefined){
            viewModel.RemoveNodeFromParentChildren(shadowView)   
        }
        const updates = new SimpleNameValueCollection([
            {
                key: 'parentId',
                value: parent.id
            },
            {
                key: 'style.top',
                value: ''
            },
            {
                key: 'style.left',
                value: ''
            },
            {
                key: 'position',
                value: position
            }
        ])
        viewModel.PartialUpdateView(shadowView.id, updates, shadowView)
        viewModel.AddNodeToParentChildren(shadowView)
    }
    private ReplaceShadowViewWithRealView(shadowView: IViewConfiguration, realView: Array<IViewConfiguration>, viewModel: RunTimeVueApplicationViewModel, viewExisted = false){
        
        let targetViewUpdates = null;
        if(viewExisted == true){
            targetViewUpdates = new SimpleNameValueCollection([
                {
                    key: 'properties.isActive',
                    value: true
                },{
                    key: 'parentId',
                    value: shadowView.parentId
                },
                {
                    key: 'style.top',
                    value: ''
                },
                {
                    key: 'style.left',
                    value: ''
                },
                {
                    key: 'position',
                    value: shadowView.position
                }
            ])
        }else{
            targetViewUpdates = new SimpleNameValueCollection([
                {
                    key: 'parentId',
                    value: shadowView.parentId
                },
                {
                    key: 'style.top',
                    value: ''
                },
                {
                    key: 'style.left',
                    value: ''
                },
                {
                    key: 'position',
                    value: shadowView.position
                }
            ])
        }
        
        const hostView = this.GetHostView(realView);
        
        if(viewExisted == false){
            for(const keyValuePair of targetViewUpdates.keyValuePairs){
                set(hostView, keyValuePair.key, keyValuePair.value)
            }
            for(const view of realView){
                viewModel.AddRawViewElement(view)
            }
        }else{
            if(hostView.parentId != undefined){
                viewModel.RemoveNodeFromParentChildren(hostView)
                for(const keyValuePair of targetViewUpdates.keyValuePairs){
                    set(hostView, keyValuePair.key, keyValuePair.value)
                }
                viewModel.AddNodeToParentChildren(hostView)
                viewModel.PartialUpdateView(hostView.id, targetViewUpdates, hostView)
            }
        }
        viewModel.RemoveNodeFromParentChildren(shadowView)
        viewModel.DeleteElement(shadowView.id)
    }
    private FindNextViewElement(e: MouseEvent){
        
        let potentialElement = null;
        if(e.target.dataset.element != undefined){
                
            return e.target
        }
        else if(e.target.parentElement?.dataset.element != undefined){
            return e.target.parentElement
        }else{

            potentialElement = e.target?.closest('[data-element]');
            if(potentialElement != undefined){
                return potentialElement;
            }
            potentialElement = e.target?.querySelector('[data-element]');
            if(potentialElement != undefined){
                return potentialElement;
            }

            
        }
        return undefined;
    }

    private FindElementPosition(e: MouseEvent, parentView: IViewConfiguration){
        console.log(e, parentView)
    }

    private HandleContextChange(old: number, newc: number){
        this.AddEventListener(newc);
        this.RemoveEventListener(old);
    }

    private AddEventListener(contextid: number){
        waitForElm('#developmentcomponent_'+contextid).then((el) => {
            el.addEventListener('click', this.PositionEventListener);
            el.addEventListener('mouseover', this.PositionEventListener);
        })
    }
    private RemoveEventListener(contextid: number){
        waitForElm('#developmentcomponent_'+contextid).then((el) => {
            el.removeEventListener('click', this.PositionEventListener);
            el.removeEventListener('mouseover', this.PositionEventListener);
        })
    }
    private PositionEventListener(){

    }

    private GetHostView(views: Array<IViewConfiguration>){
        let lowest = Number.POSITIVE_INFINITY;
        let highest = Number.NEGATIVE_INFINITY;
        let tmp;
        for (let i=views.length-1; i>=0; i--) {
            tmp = views[i].id;
            if (tmp < lowest) lowest = tmp;
            if (tmp > highest) highest = tmp;
        }
        return views.find(v => v.id == lowest)
    }
}
import m from 'mithril';
import Modal from '../../containers/modal/modal';
import CarModalIndicator from './modalindicator';

export const IndicatorCar = {
    vm(p){

    },
    controller(p){
        this.vm = IndicatorCar.vm(p);
        this.openindicatorCar = () => {
            return Modal.vm.open(CarModalIndicator,{refresh:p.refresh, hasOrder:p.hasOrder, sendOrder:p.sendOrder, amounproducts:p.amounproducts, order:p.order});
        };
    },
    view(c,p){
        return <span class="indicator" ><a onclick={c.openindicatorCar.bind(c)}><span class="pt-tag"> <span class="pt-icon-standard pt-icon-shopping-cart custom-icon"></span><span class="sepcolor">_</span><span class="sepcolor">_</span>{p.amounproducts()}</span> </a></span>;
    }
};


export default IndicatorCar;

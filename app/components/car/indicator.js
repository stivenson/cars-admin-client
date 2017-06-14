import m from 'mithril';

export const IndicatorCar = {
    vm(p){

    },
    controller(p){
        this.vm = IndicatorCar.vm(p);
    },
    view(c,p){
        return <span class="indicator" ><span class="pt-tag pt-intent-primary"> <span class="pt-icon-standard pt-icon-shopping-cart custom-icon"></span><span class="sepcolor">_</span><span class="sepcolor">_</span>{p.amounproducts()}</span> </span>;
    }
}


export default IndicatorCar;

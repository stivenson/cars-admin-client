import m from 'mithril';
import API from '../../components/api';
import {Spinner} from '../../components/ui';
import {MProduct} from './models';

export const CarList = {
    vm(p){
        return {
            products: m.prop('empty'),
            working: m.prop(false),
            fetchProducts: () => {
                return MProduct.list();
            }
        }
    },
    controller(p){
        this.vm = CarList.vm(p);
        this.vm.working(true);
        this.vm.fetchProducts().then(this.vm.products).then(()=>this.vm.working(false)).then(()=>m.redraw());
    },
    view(c,p){
        return <div class="car-list">LISTA</div>;
    }
}


export default CarList;

import m from 'mithril';
import API from '../../components/api';
import {Spinner, Button} from '../../components/ui';
import {MProduct} from './models';
import Modal from '../../containers/modal/modal';
import CarModalproduct from './modalproduct';

export const CarList = {
    vm(p){
        return {
            products: m.prop('empty'),
            working: m.prop(false),
            car: m.prop([]),
            fetchProducts: () => {
                return MProduct.listAvailable();
            },
            openProduct(product,refcar){
                return Modal.vm.open(CarModalproduct, {car:refcar, product: product, className: 'mmodal-small'});
            }
        }
    },
    controller(p){
        this.vm = CarList.vm(p);
        this.vm.working(true);
        this.vm.fetchProducts().then(this.vm.products).then(()=>this.vm.working(false)).then(()=>m.redraw());
    
        this.openProductWithCar = (product) => {
            this.vm.openProduct(product,this.vm.car.bind(this.vm));
        }

    },
    view(c,p){

        let list = <div class="custom-spinner text-center"><Spinner Large /></div>;


        if(c.vm.products() != 'empty'){
            list = (
                <div class="car-list">
                    <div class="row">
                        {c.vm.products().map((product) => {
                            return (
                                <div class="col-sm-3 col-md-3 col-xs-12">
                                    <a onclick={c.openProductWithCar.bind(c,product)} class="thumbnail thumbnail-click">
                                        <div class="cont-image-product">
                                            <img class="image-product" alt={"image product "+product.id()} src={product.srcImage()} />
                                        </div>
                                        <div class="caption text-center">
                                            <h4 class="title-product">{product.name()}</h4>
                                            <p class="price-product">{product.value()}</p>
                                        </div>
                                    </a>
                                </div> 
                            )
                        })}                                  
                    </div>
                </div>
            )
        }


        return list;
    }
}


export default CarList;

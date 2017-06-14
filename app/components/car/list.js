import m from 'mithril';
import API from '../../components/api';
import {Spinner, Button} from '../../components/ui';
import {MProduct} from './models';
import Modal from '../../containers/modal/modal';
import CarModalproduct from './modalproduct';
import IndicatorCar from './indicator';
import CoverageCar from './coverage';
import LoginCar from './login';

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

        this.amounproducts = () => {
                console.log(this.vm.products());
                if(this.vm.products() != 'length')
                    return this.vm.products().length;   
                else
                    return 0;
        }

    },
    view(c,p){

        let indicator = <div class="align-indicator-car"><IndicatorCar amounproducts={c.amounproducts.bind(c)} /></div>;

        let coverage = <div class="align-coverage-car"><CoverageCar /></div>;

        let login = <div class="align-login-car"><LoginCar /></div>;

        let list = <div class="custom-spinner text-center"><Spinner Large /></div>;
 
        let infocar = (
            <div class="row infocar">
                <div class="col-sm-8 col-md-8 col-xs-12" ></div>
                <div class="col-sm-4 col-md-4 col-xs-12" >
                    <div class="row"><div class="col-md-5 col-xs-5">{coverage}</div><div class="col-md-3 col-xs-3">{indicator}</div><div class="col-md-4 col-xs-4">{login}</div></div>
                </div>
            </div>
        );

        if(c.vm.products() != 'empty'){
            list = (
                <div class="car-list">
                    {infocar}
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

import m from 'mithril';
import API from '../../components/api';
import {Spinner, Button, Alert} from '../../components/ui';
import {MProduct, Order, Itemorder} from './models';
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
            order: m.prop(new Order()),
            hasOrder: m.prop(false),
            fetchProducts: () => {
                return MProduct.listAvailable();
            },
            openProduct(product,refOrder){
                return Modal.vm.open(CarModalproduct, {order:refOrder,
                    product: product, 
                    className: 'mmodal-small'
                });
            }
        };
    },
    controller(p){
        this.vm = CarList.vm(p);
        this.vm.working(true);
        this.vm.fetchProducts().then(this.vm.products)
            .then(()=>this.vm.working(false)).then(()=>m.redraw());
    
        this.openProductWithCar = (product) => {
            this.vm.openProduct(product,this.vm.order.bind(this.vm));
        };

        let options = {
            serialize: (value) => value,
            url: API.requestUrl(endpoint)
        };

        this.amounproducts = () => {
                
                if(this.vm.products() != 'empty')
                    return this.vm.order().items_orders().length;   
                else
                    return 0;
        };

        this.sendOrder = () => {
            const currentformData = new FormData();
            const order = this.vm.order();
            currentformData.append('created_at', order.created_at());
            currentformData.append('items_orders', order.jsonItemsOrders());
            currentformData.append('delivery_type', order.form.delivery_type());
            currentformData.append('status', order.status());
            currentformData.append('users_id', order.users_id());  
            Order.save(currentformData, options)
            .then(res => {
                this.vm.working(false);
                if(res == false){
                    Modal.vm.open(Alert, {label: 'No se pudo guardar la orden, porfavor vuelta a intentarlo'});
                } else {  
                    p.order(new Order());
                    this.vm.hasOrder(false);
                    Modal.vm.open(Alert, {label: 'Orden guardada con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                }
            }).catch(erSave => {
                this.vm.working(false);
                console.log("Error: "+erSave);
                Modal.vm.open(Alert, {label: 'No se pudo guardar la orden, por favor verifique datos faltantes, y/o reales'});
            });
        };
    },
    view(c,p){

        let indicator = <div class="align-indicator-car"><IndicatorCar openloginCar={c.openloginCar.bind(c)} hasOrder={c.vm.hasOrder.bind(c.vm)} sendOrder={c.sendOrder.bind(c)} order={c.vm.order.bind(c.vm)} amounproducts={c.amounproducts.bind(c)} /></div>;

        let coverage = <div class="align-coverage-car"><CoverageCar /></div>;

        let login = <div class="align-login-car"><LoginCar hasOrder={c.vm.hasOrder.bind(c.vm)} sendOrder={c.sendOrder.bind(c)} /></div>;

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
                            );
                        })}                                  
                    </div>
                </div>
            );
        }

        return list;
    }
};


export default CarList;

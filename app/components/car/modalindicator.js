import m from 'mithril';
import API from '../api';
//import Auth from '../../containers/auth/auth';
import {Button, Alert} from '../ui';
import { ModalHeader } from '../modal/header';
import Modal from '../../containers/modal/modal';
import Utils from '../utils';
import { Order } from './models';

const CarModalIndicator = {};

CarModalIndicator.vm = function (p) {
    return {
        working: m.prop(false),        
        saving: m.prop(false)
    };
};

CarModalIndicator.controller = function (p) {
    this.vm = CarModalIndicator.vm(p);

    let endpoint = 'orders';    
    let options = {
        serialize: (value) => value,
        url: API.requestUrl(endpoint)
    };

    this.save = () => {
        const currentformData = new FormData();
        const order = p.order();
        currentformData.append('created_at', order.created_at());
        currentformData.append('items_orders', order.jsonItemsOrders());
        currentformData.append('delivery_type', order.form.delivery_type());
        currentformData.append('status', order.status());
        currentformData.append('users_id', order.users_id());    
        this.vm.working(true);
        Order.save(currentformData,options)
            .then(res => {
                this.vm.working(false);
                if(res == false){
                    Modal.vm.open(Alert, {label: 'No se pudo guardar la orden'});
                }else{  
                    p.order(new Order());
                    Modal.vm.open(Alert, {label: 'Orden guardada con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                }
            }).catch(erSave => {
                this.vm.working(false);
                console.log("Error: "+erSave);
                Modal.vm.open(Alert, {label: 'No se pudo guardar la orden, por favor verifique datos faltantes, y/o reales'});
            });
    };

    this.removeOfCar = (id) => {
        let arr = this.vm.order().items_orders();
        let filterArr = arr.filter(c => c.id() != id);
        this.vm.order().items_orders(filterArr);
    };

    this.total = () => {
        let res = 0;
        for(let io of this.vm.order().items_orders()){
            res += (parseFloat(io.numberValue()) * parseInt(io.amount()));
        }
        return Utils.formatMoney(res);
    };
};

CarModalIndicator.view = function (c,p) {

    let contentCar;

    if(p.order().items_orders().length < 1){
        contentCar = (
            <div class="pt-card pt-elevation-3">
                <p align="center">
                    No se han seleccionado productos
                </p>
            </div>
        );
    } else {
        contentCar = (
            <div class="pt-card pt-elevation-3">
                <table class="pt-table pt-bordered pt-interactive">
                    <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                        <th>Precio (COP)</th>
                        <th>Acciones</th>
                    </tr>
                    {p.order().items_orders().map((proSelected) => {
                        return (
                            <tr>
                                <td>{proSelected.name()}</td>
                                <td>{proSelected.amount()}</td>
                                <td>{proSelected.value()}</td>
                                <td><a onclick={c.removeOfCar.bind(c,proSelected.id())}><span class="pt-icon-standard pt-icon-cross"></span> quitar</a></td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td colspan="3" class="align-total">Total</td>
                        <td><b>{c.total()}</b></td>
                    </tr>

                </table>
            </div>
        );
    }

    return (
        <div class="mmodal-body indicator-modal">
            <ModalHeader>
                <div class="text-center title-indicator">Lista de compra ({p.amounproducts()})</div>
            </ModalHeader>
            <div class="thumbnail thumbnail-click">
                <div class="caption text-center">
                    <div>
                        {contentCar}
                        <br/>
                        <Button onclick={c.save.bind(c)}><span class="pt-icon-standard pt-icon-shopping-cart"></span> Pagar </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CarModalIndicator;
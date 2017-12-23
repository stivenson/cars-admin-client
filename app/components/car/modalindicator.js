import m from 'mithril';
import API from '../api';
//import Auth from '../../containers/auth/auth';
import {Button, Alert} from '../ui';
import { ModalHeader } from '../modal/header';
import Modal from '../../containers/modal/modal';
import Utils from '../utils';
import CarModalLogin from './modallogin';
import {Sesion, Order} from './models';

const CarModalIndicator = {};

CarModalIndicator.vm = function (p) {
    return {
        working: m.prop(false),        
        saving: m.prop(false)
    };
};

CarModalIndicator.controller = function (p) {
    this.vm = CarModalIndicator.vm(p);

    this.openloginCar = () => {
        return Modal.vm.open(CarModalLogin, {
            refresh: p.refresh,
            specialMessage: 'Porfavor, en el formulario de abajo, inicie sesión o regístrese (si aún no lo ha hecho) para enviar la orden',
            className: 'mmodal-small',
            hasOrder:p.hasOrder, 
            sendOrder:p.sendOrder
        });
    };

    this.save = () => {  
        this.vm.working(true);        
        if(localStorage.getItem('token') === false || localStorage.getItem('token') === 'false'){
            p.hasOrder(true);
            this.openloginCar();
        }else{
            p.sendOrder();            
        }
    };

    this.cancel = () => {
        p.order(new Order());
        p.hasOrder(false);
        Modal.vm.close();
        Modal.vm.open(Alert, {label: 'Orden Cancelada con éxito', icon: 'pt-icon-endorsed', mood: 'success'});
    };

    this.removeOfCar = (id) => {
        let arr = p.order().items_orders();
        let filterArr = arr.filter(c => c.products_id() != id);
        p.order().items_orders(filterArr);
    };

    this.total = () => {
        let res = 0;
        for(let io of p.order().items_orders()){
            res += (parseFloat(io.numberValue()) * parseInt(io.amount()));
        }
        return Utils.formatMoney(res);
    };

    this.changeDeliveryType = (value) => {
        p.order().form.delivery_type(value);
    };

    this.changeDeliveryType(1); 

};

CarModalIndicator.view = function (c,p) {

    let contentCar;

    if(p.order().items_orders().length < 1){
        contentCar = (
            <div class="pt-card pt-elevation-1">
                <p align="center">
                    No se han seleccionado productos
                </p>
            </div>
        );
    } else {
        contentCar = (
            <div class="pt-card pt-elevation-1">
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
                                <td><a onclick={c.removeOfCar.bind(c,proSelected.products_id())}><span class="pt-icon-standard pt-icon-cross"></span> quitar</a></td>
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

    const formGet = (
        <div class="row">
            <div class="col-md-12">
                <label class="pt-label">
                    ¿Forma de entrega?
                </label>

                <label class="pt-control pt-radio pt-inline">
                    <input checked={true} type="radio" value="1" name="delivery_type"
                        onclick={m.withAttr('value', c.changeDeliveryType)} />
                    <span class="pt-control-indicator"></span>
                    Domicilio
                </label>

                <label class="pt-control pt-radio pt-inline">
                    <input type="radio" value="2" name="delivery_type"
                        onchange={m.withAttr('value', c.changeDeliveryType)} />
                    <span class="pt-control-indicator"></span>
                    Pasar por local
                </label>
            </div>
        </div>
    );

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
                        {formGet}
                        <br/>
                        <div class="pt-button-group"> 
                        <Button onclick={c.save.bind(c)}><span class="pt-icon-standard pt-icon-shopping-cart"></span> Hacer pedido </Button>
                        <Button type="button" intent="default" onclick={c.cancel.bind(c)}>
                            <span class="pt-icon-standard pt-icon-ban-circle"></span> Cancelar pedido
                        </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CarModalIndicator;
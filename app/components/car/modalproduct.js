import m from 'mithril';
import API from '../api';
import Utils from '../utils';
//import Auth from '../../containers/auth/auth';

import {
    InputAutoComplete,
    TextArea,
    Button,
    Spinner
} from '../ui';

import { ModalHeader } from '../modal/header';
import Modal from '../../containers/modal/modal';
import { MProduct } from './models';


const CarModalproduct = {};

CarModalproduct.vm = function (p) {
    return {
        saving: m.prop(false),
        amount: m.prop(1),
        observations: m.prop(''),
        refreshProduct: (id) => {
            return MProduct.get(id);
        },
        addToCar: (product) => {
            p.car().push(product);
            console.log(p.car());
        },
        submit(event) {
            if (event) { event.preventDefault(); }
            if (this.saving()) {
                return;
            }
        }
    }
}

CarModalproduct.controller = function (p) {
    this.vm = CarModalproduct.vm(p);
    this.vm.refreshProduct(p.product.id()).then(p.product).then(()=>m.redraw());
    this.addToCar = (product) => {
        product.amount = this.vm.amount();
        product.observations = this.vm.observations();
        this.vm.addToCar(product);
        Modal.vm.terminate();
        m.redraw(true);
    }; 
}

CarModalproduct.view = function (c,p) {
    return (
        <div class="mmodal-body product-modal">
            <ModalHeader>
                <div class="text-center title-product">{p.product.name()}</div>
            </ModalHeader>

            <div class="thumbnail thumbnail-click">
                <div class="cont-image-product">
                    <img class="image-product" alt={"image product "+p.product.id()} src={p.product.srcImage()} />
                </div>
                <div class="caption text-center">
                    <h4 class="price-product">{p.product.value()}</h4>
                    <p align="justify">{p.product.description()}</p>
                    <div>
                        Pedir <input type="number" value={c.vm.amount()} oninput={m.withAttr('value', c.vm.amount)} class="pt-input amount-input"/>
                        <br/>
                        <textarea
                        style="min-height:70px;" 
                        rows="3"
                        placeholder="Agregar observación sobre el pedido (opcional)" 
                        onchange={m.withAttr('value', c.vm.observations)}>{c.vm.observations()}</textarea>
                        <br/>
                        <Button onclick={c.addToCar.bind(c,p.product)}><span class="pt-icon-standard pt-icon-shopping-cart"></span> Agregar </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default CarModalproduct;
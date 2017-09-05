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
import {Product, Itemorder} from './models';


const AdminModalproduct = {};

AdminModalproduct.vm = function (p) {
    return {
        saving: m.prop(false),
        amount: m.prop(1),
        observations: m.prop(''),
        refreshProduct: (id) => {
            return Product.get(id);
        },
        addToCar: (product) => {
            p.order().items_orders().push(product);
        },
        submit(event) {
            if (event) { event.preventDefault(); }
            if (this.saving()) {
                return;
            }
        }
    };
};

AdminModalproduct.controller = function (p) {
    this.vm = AdminModalproduct.vm(p);
    this.vm.refreshProduct(p.product.id()).then(p.product).then(()=>m.redraw());
    this.addToCar = (product) => {
        let params = {}; 
        params.amount = this.vm.amount();
        params.observations = this.vm.observations();
        params.products_id = p.product.id();
        params.orders_id = p.order().id();
        this.vm.addToCar(new Itemorder(params));
        Modal.vm.terminate();
        m.redraw(true);
    };

};

AdminModalproduct.view = function (c,p) {
    return (
        <div class="mmodal-body product-modal">
            <ModalHeader notlockable="true" >
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
                        Pedir <input type="number" min="1" value={c.vm.amount()} oninput={m.withAttr('value', c.vm.amount)} class="pt-input amount-input"/>
                        <br/>
                        <textarea
                        style="min-height:70px; color: #000000;" 
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


export default AdminModalproduct;

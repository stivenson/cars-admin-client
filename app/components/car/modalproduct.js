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
import { ModalTabs } from '../modal/tabs';
import Modal from '../../containers/modal/modal';
import { MProduct } from './models';


const CarModalproduct = {};

CarModalproduct.vm = function (p) {
    return {
        saving: m.prop(false),
        refreshProduct: (id) => {
            return MProduct.get(id);
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
    this.vm.refreshProduct(p.product.id());
}

CarModalproduct.view = function (c) {
    return <span>Modal</span>;
}


export default CarModalproduct;
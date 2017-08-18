import m from 'mithril';
import API from '../api';
//import Auth from '../../containers/auth/auth';

import {Button} from '../ui';

import { ModalHeader } from '../modal/header';
import Modal from '../../containers/modal/modal';
import Utils from '../utils';

const CarModalIndicator = {};

CarModalIndicator.vm = function (p) {
    return {
        saving: m.prop(false)
    }
}

CarModalIndicator.controller = function (p) {
    this.vm = CarModalIndicator.vm(p);
    this.pay = () => {
        alert('En construcción');
    }; 

    this.removeOfCar = () => {
        alert('En construcción');
    }

    this.total = () => {
        let res = 0;
        for(let oa of p.car()){
            res += (parseFloat(oa.numberValue()) * parseInt(oa.amount()))
        }
        return Utils.formatMoney(res);
    }
}

CarModalIndicator.view = function (c,p) {

    let contentCar;

    if(p.car().length < 1){
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
                {p.car().map((proSelected) => {
                    return (
                        <tr>
                            <td>{proSelected.name()}</td>
                            <td>{proSelected.amount()}</td>
                            <td>{proSelected.value()}</td>
                            <td><a onclick={c.removeOfCar.bind(c)}><span class="pt-icon-standard pt-icon-cross"></span> quitar</a></td>
                        </tr> 
                    )
                })}

                    <tr>
                        <td colspan="3" class="align-total">Total</td>
                        <td><b>{c.total()}</b></td>
                    </tr>

                </table>
            </div>
        )
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
                        <Button onclick={c.pay.bind(c)}><span class="pt-icon-standard pt-icon-shopping-cart"></span> Pagar </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default CarModalIndicator;
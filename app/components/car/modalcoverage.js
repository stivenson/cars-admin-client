import m from 'mithril';
import API from '../api';
import Utils from '../utils';

import { ModalHeader } from '../modal/header';
import Modal from '../../containers/modal/modal';

const CarModalCoverage = {};

CarModalCoverage.vm = function (p) {
    return {

    };
};

CarModalCoverage.controller = function (p) {
    this.vm = CarModalCoverage.vm(p);
};

CarModalCoverage.view = function (c,p) {
    return (
        <div class="mmodal-body coverage-modal">
            <ModalHeader>
                <div class="text-center title-coverage">Covertura Solo Cúcuta</div>
            </ModalHeader>
            <div class="thumbnail">
                <div class="caption text-center">
                    <img class="image-coverage" src="./images/image-coverage.png" />
                </div>
            </div>
        </div>
    );
};


export default CarModalCoverage;
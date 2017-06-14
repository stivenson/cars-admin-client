import m from 'mithril';
import API from '../api';
import Utils from '../utils';

import {
    InputAutoComplete,
    Button,
    Spinner
} from '../ui';

import { ModalHeader } from '../modal/header';
import Modal from '../../containers/modal/modal';
import {Alert} from '../ui';


const CarModalLogin = {};

CarModalLogin.vm = function (p) {
    return {
        saving: m.prop(false),
        email: m.prop(''),
        password: m.prop('')
    }
}

CarModalLogin.controller = function (p) {
    
    this.vm = CarModalLogin.vm(p);

    this.construction = () => {
        Modal.vm.open(Alert, {label: 'En construcción'});
    }

    this.login = () => {

        this.vm.saving(true);
        let credentials = {};
        credentials.email = this.vm.email();
        credentials.password = this.vm.password();
        

        // Modal.vm.terminate();
        this.vm.saving(false);
        this.construction();
        // m.redraw(true);

    };

    this.submit = (e) => {

        if (e) { e.preventDefault(); }
        if (this.vm.saving()) {
            return;
        }
        this.login();
    }

}

CarModalLogin.view = function (c,p) {
    return (
        <div class="mmodal-body login-modal">
            <ModalHeader>
                <div class="text-center title-login">Iniciar Sesión</div>
            </ModalHeader>
            <div class="thumbnail thumbnail-click">
                <div class="caption text-center">
                    <form onsubmit={c.submit.bind(c)}>

                        <label class="pt-label">
                            Correo electrónico
                            <input
                                type="email"
                                class="pt-input pt-fill"
                                name="email"
                                oninput={m.withAttr('value', c.vm.email)}
                                value={c.vm.email()}
                                placeholder=""
                                required
                            />
                        </label>

                        <label class="pt-label">
                            Contraseña
                            <input
                                type="password"
                                class="pt-input pt-fill"
                                name="password"
                                oninput={m.withAttr('value', c.vm.password)}
                                value={c.vm.password()}
                                placeholder=""
                                required
                            />
                        </label>

                        <br/>
                        <Button type="submit">
                            <span class="pt-icon-standard pt-icon-log-in"></span> Entrar 
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}


export default CarModalLogin;
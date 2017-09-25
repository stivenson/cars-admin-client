import m from 'mithril';
import API from '../api';
import Utils from '../utils';
import { Client, Sesion } from './models';

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
        password: m.prop(''),
        register: m.prop(false),
        isMsgEmail: m.prop(false),
        client: m.prop(new Client())
    };
};

CarModalLogin.controller = function (p) {
    
    this.vm = CarModalLogin.vm(p);
    this.vm.isMsgEmail(false);
    this.construction = () => {
        Modal.vm.open(Alert, {label: 'En construcción'});
    };

    this.login = () => {

        this.vm.saving(true);
        let credentials = {};
        credentials.email = this.vm.email();
        credentials.password = this.vm.password();
        credentials.isclient = true;
        Modal.vm.terminate();

        Sesion.login(credentials).then(r => {
            Modal.vm.open(Alert, {label: 'Inicio de sesión exitoso', icon: 'pt-icon-endorsed', mood: 'success'}); 
            Sesion.fillLocalStorage(r);
            if(p.hasOrder())
                p.sendOrder();
            p.refresh();
        }).catch(r => {
            this.vm.saving(false);
            if(r === 'invalid_credentials') {
                Modal.vm.open(Alert, { label: 'Credenciales incorrectas. Porfavor verifique y vuelva a intentarlo' });
            } else if(r === 'not_role') {
                Modal.vm.open(Alert, { label: 'Un administrador no puede iniciar sesión como un cliente' });                        
            } else {
                Modal.vm.open(Alert, { label: 'Ha ocurrido un error, por favor, vuelta a intentarlo (verifique su internet)' });                        
            }
        });

    };

    this.submit = (e) => {

        if (e) { e.preventDefault(); }
        if (this.vm.saving()) {
            return;
        }
        this.login();
    };
    
    this.submitRegister = (e) => {
        if (e) 
            e.preventDefault();
        if (this.vm.saving())
            return;

        const formClient = this.vm.client().form;

        const objformClient = {
            id: formClient.id(),
            name: formClient.name(),
            cc: formClient.cc(),
            roles_id: formClient.roles_id(),
            telephone: formClient.telephone(),
            cell_phone: formClient.cell_phone(),
            neighborhood: formClient.neighborhood(),
            address: formClient.address(),
            email: formClient.email(),
            password: formClient.password()
        };
        this.vm.saving(true);
        this.vm.isMsgEmail(false);
        Client.save(objformClient).then( r => {
            if(r == 'email_invalid') {  
                this.vm.saving(false); 
                this.vm.isMsgEmail(true);
                m.redraw();
            }else{
                Modal.vm.open(Alert, {label: 'Registro exitoso, ahora porfavor, inicie sesión', icon: 'pt-icon-endorsed', mood: 'success'});  
                this.vm.saving(false); 
                this.vm.register(false); 
                m.redraw();  
            }

        }).catch( r => {
            Modal.vm.open(Alert, {label: 'Huvo un error mientras se realizaba el registro, porfavor vuelva a intentarlo'});
            this.vm.saving(false);                     
        });
    };


    this.openFormRegister = () => {
        this.vm.register(!this.vm.register());
    };

};

CarModalLogin.view = function (c,p) {

    let registerForm;

    let msgEmail = '';

    if(c.vm.isMsgEmail())
        msgEmail = <span class="pt-tag pt-intent-danger">El correo especificado ya existe en el sistema, por favor indique otro</span>;

    if(c.vm.register()){
        registerForm = (
            <div class="thumbnail register-form">
                <div class="caption text-center">
                    <form onsubmit={c.submitRegister.bind(c)}>

                        <label class="pt-label">
                            Nombre completo
                            <input
                                type="text"
                                class="pt-input pt-fill"
                                name="name"
                                oninput={m.withAttr('value', c.vm.client().form.name)}
                                value={c.vm.client().form.name()}
                                placeholder=""
                                required
                                
                            />
                        </label>

                        <label class="pt-label">
                            Número identificación
                            <input
                                type="text"
                                class="pt-input pt-fill"
                                name="cc"
                                oninput={m.withAttr('value', c.vm.client().form.cc)}
                                value={c.vm.client().form.cc()}
                                placeholder="Solo números"
                                required
                                
                            />
                        </label>

                        <label class="pt-label">
                            Celular 
                            <input
                                type="text"
                                class="pt-input pt-fill"
                                name="cell_phone"
                                oninput={m.withAttr('value', c.vm.client().form.cell_phone)}
                                value={c.vm.client().form.cell_phone()}
                                placeholder="Solo números"
                                required
                            />
                        </label>


                        <label class="pt-label">
                            Teléfono fijo <i>(Opcional)</i> 
                            <input
                                type="text"
                                class="pt-input pt-fill"
                                name="telephone"
                                oninput={m.withAttr('value', c.vm.client().form.telephone)}
                                value={c.vm.client().form.telephone()}
                                placeholder="Opcional"
                            />
                        </label>

                        <label class="pt-label">
                            Nombre Barrio
                            <input
                                type="text"
                                class="pt-input pt-fill"
                                name="neighborhood"
                                oninput={m.withAttr('value', c.vm.client().form.neighborhood)}
                                value={c.vm.client().form.neighborhood()}
                                placeholder=""
                                required
                            />
                        </label>

                        <label class="pt-label">
                            Dirección Domicilio
                            <input
                                type="text"
                                class="pt-input pt-fill"
                                name="address"
                                oninput={m.withAttr('value', c.vm.client().form.address)}
                                value={c.vm.client().form.address()}
                                placeholder=""
                                required
                            />
                        </label>


                        <label class="pt-label">
                            {msgEmail}
                            Email
                            <input
                                type="email"
                                class="pt-input pt-fill"
                                name="email"
                                oninput={m.withAttr('value', c.vm.client().form.email)}
                                value={c.vm.client().form.email()}
                                placeholder=""
                                required
                            />
                        </label>

                        <label class="pt-label" >
                            Password
                            <input
                                type="password"
                                class="pt-input pt-fill"
                                name="password"
                                oninput={m.withAttr('value', c.vm.client().form.password)}
                                value={c.vm.client().form.password()}
                                placeholder="******"
                                required={c.vm.client().form.id() == false}
                            />
                        </label>

                        <div class="text-center"> 
                            <Button loading={c.vm.saving()} type="submit">
                                <span class="pt-icon-standard pt-icon-user"></span> Enviar registro 
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        );        
    }

    let optionalMessage = '';

    if('specialMessage' in p)
        optionalMessage = <div><div class="pt-card pt-elevation-3 optional-message">{p.specialMessage}</div><br/><br/></div>;
        

    return (
        <div class="mmodal-body login-modal">
            <ModalHeader>
                <div class="text-center title-login">Iniciar Sesión Con Facebook</div>
            </ModalHeader>
        </div>
    );
};

export default CarModalLogin;

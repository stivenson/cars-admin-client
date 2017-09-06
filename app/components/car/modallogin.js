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
        client: m.prop(new Client())
    };
};

CarModalLogin.controller = function (p) {
    
    this.vm = CarModalLogin.vm(p);

    this.construction = () => {
        Modal.vm.open(Alert, {label: 'En construcción'});
    };

    this.login = () => {

        this.vm.saving(true);
        let credentials = {};
        credentials.email = this.vm.email();
        credentials.password = this.vm.password();
        
        Modal.vm.terminate();

        Sesion.login(credentials).then(r => {
            Modal.vm.open(Alert, {label: 'Inicio de sesión exitoso'}); 
            Sesion.fillLocalStorage(r);
            this.vm.saving(false);
            if(p.hasOrder())
                p.sendOrder();
            m.redraw();
        }).then(r => {
            Modal.vm.open(Alert, {label: 'Datos incorrectos, porfavor verifique sus credenciales y vuelva a intentarlo'}); 
            this.vm.saving(false);            
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
        this.vm.register(false);

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
        Client.save(objformClient).then( r => {
            Modal.vm.open(Alert, {label: 'Registro exitoso, ahora porfavor, inicie sesión'});  
            this.vm.saving(false); 
            this.vm.register(false); 
            m.redraw();         
        }).then( r => {
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
                            <Button type="submit">
                                <span class="pt-icon-standard pt-icon-user"></span> Enviar registro 
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        );        
    }


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

                        <div class="pt-button-group"> 

                            <Button type="submit">
                                <span class="pt-icon-standard pt-icon-log-in"></span> Entrar 
                            </Button>

                            <Button type="button" intent="default" onclick={c.openFormRegister.bind(c)}>
                                <span class="pt-icon-standard pt-icon-user "></span> Registrarse
                            </Button>

                        </div>

                    </form>

                    {registerForm}
                
                </div>
            </div>
        </div>
    );
};

export default CarModalLogin;

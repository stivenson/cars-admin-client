import m from 'mithril';
import { Client, Sesion } from './models';
import API from '../api';
import Modal from '../../containers/modal/modal';
import {Button, Alert} from '../../components/ui';

export const AdminLogin = {
    vm(p){
    	return {
            working: m.prop(false),
            email: m.prop(''),
            password: m.prop('')
        }; 
    },
    controller(p){

        this.vm = AdminLogin.vm(p);

        this.submit = (event) => {

            if (event) { event.preventDefault(); }

            if (this.vm.working()) return;

            this.vm.working(true);

            Sesion.login({email:this.vm.email(), password:this.vm.password()})
            .then(r => {
                this.vm.working(false);
                Sesion.fillLocalStorage(r);
                localStorage.setItem('admin',true);
                m.route('/admin');

            }).catch(r => {
                localStorage.setItem('admin',false);
                this.vm.working(false);
                if(r === 'invalid_credentials') {
                    Modal.vm.open(Alert, { label: 'Credenciales incorrectas. Porfavor verifique y vuelva a intentarlo' });
                } else if(r === 'not_role') {
                    Modal.vm.open(Alert, { label: 'Su usuario es el de un cliente. No tiene permiso para ingresar acá' });                        
                } else {
                    Modal.vm.open(Alert, { label: 'Ha ocurrido un error, por favor, vuelta a intentarlo (verifique su internet)' });                        
                }
            });
        };

    },
    view(c,p){

        if(Sesion.haveSession()){
            m.route('/admin');
        }

        let content = (
            <div class="admin-login">
                <div class="panel panel-default">
                    <div class="panel-body">
                        <form onsubmit={c.submit.bind(c)} >

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

                            <div class="text-center">
                                <Button type="submit" loading={c.vm.working()} >
                                    Guardar
                                </Button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        );

        return content;

    }
};


export default AdminLogin;

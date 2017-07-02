import m from 'mithril';
import { Client } from './models';
import API from '../api';
import Modal from '../../containers/modal/modal';
import {Button, Alert} from '../../components/ui';

export const AdminLogin = {
    vm(p){
    	return {
            working: m.prop(false),
            email: m.prop(''),
            password: m.prop('')
        } 
    },
    controller(p){

        this.vm = AdminLogin.vm(p);

        this.submit = (event) => {

            if (event) { event.preventDefault(); }

            if (this.vm.working()) return;

            this.vm.working(true);

            Client.login({email:this.vm.email(), password:this.vm.password()})
                .then(r => {
                    this.vm.working(false);
                    if(r === true)
                        m.route('/admin');
                    else
                        Modal.vm.open(Alert, { label: 'Credenciales incorrectas. Porfavor verifique y vuelva a intentarlo' });
                });
        }


    },
    view(c,p){

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
                                    placeholder="Solo números"
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
                                    placeholder="Solo números"
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
        )

        return content;

    }
}


export default AdminLogin;

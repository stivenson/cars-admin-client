import m from 'mithril';
import Modal from '../../containers/modal/modal';
import CarModalLogin from './modallogin';
import { Sesion } from './models';
import {Spinner} from '../../components/ui';


export const LoginCar = {
    controller(p) {
        this.hasSesion = m.prop('waiting'); 
        this.openloginCar = () => {
            p.hasOrder(false);
            return Modal.vm.open(CarModalLogin, {className: 'mmodal-small', hasOrder:p.hasOrder, sendOrder:p.sendOrder});
        };
        this.logout = () => {
            Sesion.logout();
        };

        this.check = () => {
            Sesion.check().then(r => {
                this.hasSesion(r.token === 'active');
                m.redraw();
            });
        };

        this.check();
 
    },
    view(c,p){

       
        const spinner = <Spinner small></Spinner>;
        let btnSesion = spinner;

        if(c.hasSesion()){
            btnSesion = <a onclick={c.logout.bind(c)}><span class="pt-tag pt-intent-danger"> <span class="pt-icon-standard pt-icon-delete custom-icon"> </span><span class="sepcolor">_</span>Cerrar<span class="sepcolor">_</span>Sesión</span> </a>;
        }
        if(!c.hasSesion()){
            btnSesion = <a onclick={c.openloginCar.bind(c)}><span class="pt-tag pt-intent-warning"> <span class="pt-icon-standard pt-icon-log-in custom-icon"> </span><span class="sepcolor">_</span>Iniciar<span class="sepcolor">_</span>Sesión</span> </a>;
        }

        return <span class="Login" >{btnSesion}</span>;
    
    }
};


export default LoginCar;

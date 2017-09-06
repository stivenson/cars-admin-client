import m from 'mithril';
import Modal from '../../containers/modal/modal';
import CarModalLogin from './modallogin';

export const LoginCar = {
    vm(p){

    },
    controller(p){
        this.vm = LoginCar.vm(p);
        this.openloginCar = () => {
            p.hasOrder(false);
            return Modal.vm.open(CarModalLogin, {className: 'mmodal-small',hasOrder:p.hasOrder, sendOrder:p.sendOrder});
        };
    },
    view(c,p){
        return <span class="Login" ><a onclick={c.openloginCar.bind(c)}><span class="pt-tag pt-intent-warning"> <span class="pt-icon-standard pt-icon-log-in custom-icon"> </span><span class="sepcolor">_</span>Iniciar<span class="sepcolor">_</span>Sesión</span> </a></span>;
    }
};


export default LoginCar;

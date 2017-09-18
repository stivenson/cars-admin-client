import m from 'mithril';
import Modal from '../../containers/modal/modal';
import CarModalLogin from './modallogin';
import { Sesion } from './models';
import {Spinner, Confirm} from '../../components/ui';


export const LoginCar = {
    controller(p) {
        this.process = m.prop(false);
        this.checkSesionFacebook = () => {
            setTimeout(function() {
                FB.getLoginStatus(function(response) {
                    if('status' in response && response.status === 'connected'){
                        Sesion.fillLocalStorage(response);
                        Sesion.getClientInfo();
                    }else{
                        Sesion.fillLocalStorage(false);
                        m.redraw();
                    }
                });
            }, 500);
        };

        this.openloginCar = () => {
            FB.login((response) => {
                console.log('process session finalized');
                if (response.authResponse) {
                    console.log('session started');
                }
                this.checkSesionFacebook(); 
            });
        };

        this.logout = () => {
            this.process(true);
            FB.logout((response) => {
                this.process(false);
                Sesion.logout();
            });
        }; 

        this.confirmLogout = () => {
            Modal.vm.open(Confirm, {className: 'mmodal-small', mood: 'success', icon: 'ok-circle',label: '¿Confirmas que deseas la cerrar sesión con facebook?', actionLabel: 'Eliminar cliente'})
            .then(() => {
                this.logout();
            });
        };

        this.checkSesionFacebook();         

    },
    view(c,p){

        const spinner = <Spinner small></Spinner>;
        let contInfoSesion = spinner;

        if(Sesion.haveSesionClient() && !c.process()){
            contInfoSesion = <a onclick={c.confirmLogout.bind(c)} ><span class="msg-sesion" ><i class="fa fa-facebook-square" aria-hidden="true"></i> Sesión iniciada como<br/> {Sesion.getNameUser()}</span></a>;
        }
        if(!Sesion.haveSesionClient() && !c.process()){
            contInfoSesion = (
                <a onclick={c.openloginCar.bind(c)}>
                    <span class="pt-tag pt-intent-primary"> 
                        <i class="fa fa-facebook-square" aria-hidden="true"></i>
                        <span class="sepcolor">_</span>
                        Iniciar<span class="sepcolor">_</span>
                        Sesión<span class="sepcolor">_</span>
                        con<span class="sepcolor">_</span>
                        Facebook
                    </span> 
                </a>
            );
        }

        return <span class="Login" >{contInfoSesion}</span>;

    }
};


export default LoginCar;

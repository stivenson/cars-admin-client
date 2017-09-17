import m from 'mithril';
import Modal from '../../containers/modal/modal';
import CarModalLogin from './modallogin';
import { Sesion } from './models';
import {Spinner} from '../../components/ui';


export const LoginCar = {
    controller(p) {

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
            Sesion.logout();
        }; 

        this.checkSesionFacebook();         

    },
    view(c,p){

        const spinner = <Spinner small></Spinner>;
        let contInfoSesion = spinner;

        if(Sesion.haveSesionClient()){
            contInfoSesion = <span class="msg-sesion" >Sesión iniciada como<br/> {Sesion.getNameUser()}</span>;
        }
        if(!Sesion.haveSesionClient()){
            contInfoSesion = <a onclick={c.openloginCar.bind(c)}><span class="pt-tag pt-intent-primary"> <span class="fa fa-facebook-official" aria-hidden="true"></span><span class="sepcolor">_</span>Iniciar<span class="sepcolor">_</span>Sesión<span class="sepcolor">_</span>con<span class="sepcolor">_</span>Facebook</span> </a>;
        }

        return <span class="Login" >{contInfoSesion}</span>;

    }
};


export default LoginCar;

import m from 'mithril';
import Modal from '../../containers/modal/modal';
import CarModalLogin from './modallogin';
import { Sesion } from './models';
import {Spinner} from '../../components/ui';


export const LoginCar = {
    controller(p) {

        this.openloginCar = () => {
            FB.login();
        };

        this.checkSesionFacebook = () => {
            setTimeout(function() {
                FB.getLoginStatus(function(response) {
                    console.log(response);
                    if('status' in response && response.status === 'connected'){
                        Sesion.isClient(true);
                    }else{
                        Sesion.isClient(false); 
                    }
                    m.redraw();
                });
            }, 1500);
        };

        this.checkSesionFacebook();

        this.logout = () => {
            Sesion.logout();
        }; 

        p.checkSesion();
    },
    view(c,p){

        const spinner = <Spinner small></Spinner>;
        let btnSesion = spinner;

        if(Sesion.haveSesionClient()){
            btnSesion = {};
        }
        if(!Sesion.haveSesionClient()){
            btnSesion = <a onclick={c.openloginCar.bind(c)}><span class="pt-tag pt-intent-primary"> <span class="fa fa-facebook-official" aria-hidden="true"></span><span class="sepcolor">_</span>Iniciar<span class="sepcolor">_</span>Sesión<span class="sepcolor">_</span>con<span class="sepcolor">_</span>Facebook</span> </a>;
        }

        return <span class="Login" >{btnSesion}</span>;
    

    
    }
};


export default LoginCar;

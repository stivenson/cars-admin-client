import m from 'mithril';

export const LoginCar = {
    vm(p){

    },
    controller(p){
        this.vm = LoginCar.vm(p);
    },
    view(c,p){
        return <span class="Login" ><a><span class="pt-tag pt-intent-warning"> <span class="pt-icon-standard pt-icon-log-in custom-icon"> </span><span class="sepcolor">_</span>Iniciar<span class="sepcolor">_</span>Sesión</span> </a></span>;
    }
}


export default LoginCar;

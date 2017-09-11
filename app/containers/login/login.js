import m from 'mithril';
import AdminLogin from '../../components/login/login'


export const Login = {
    controller(p){
        localStorage.setItem('admin',false);
    },
    view(c,p){
        return <div class="cont-login"><AdminLogin /></div>;
    }
};

export default Login;
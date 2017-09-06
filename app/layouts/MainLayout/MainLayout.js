import m from 'mithril';
import Modal from '../../containers/modal/modal';
const MainLayout = {
	controller(){
		this.logout = () => {
			localStorage.setItem('user',false);
			localStorage.setItem('data_user', false);
			localStorage.setItem('token', false);
			m.route('/');
		};

		this.existUser = () => {
			return localStorage.getItem('user') != 'false';
		}
	},
    view(_ctrl, _attrs, children) {
        return ( 
        	<div>
	        	<div id="mithril-modal"><Modal /></div>
	            <div class="MainLayout">
	            	<div class={"text-center "+(_ctrl.existUser() ? '' : 'hidden')}><a onclick={_ctrl.logout.bind(_ctrl)}><span class="pt-icon-standard pt-icon-cross"></span> Cerrar Sesión</a></div>
	                {children}
	            </div>
            </div>
        );
    }
};

export default MainLayout;
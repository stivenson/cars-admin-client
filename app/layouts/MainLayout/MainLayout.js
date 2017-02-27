import m from 'mithril';

const MainLayout = {
	controller(){
		this.logout = () => {
			localStorage.setItem('user',false);
			m.route('/');
		}

		this.existUser = () => {
			return localStorage.getItem('user') != 'false';
		}
	},
    view(_ctrl, _attrs, children) {
        return (
            <div class="MainLayout">
            	<div class="text-center"><legend>ColombiaSoat</legend></div>
            	<div class={"text-center "+(_ctrl.existUser() ? '' : 'hidden')}><a onclick={_ctrl.logout.bind(_ctrl)}><span class="pt-icon-standard pt-icon-cross"></span> Cerrar Sesión</a></div>
                {children}
            </div>
        );
    }
};

export default MainLayout;
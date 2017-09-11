import m from 'mithril';
import Modal from '../../containers/modal/modal';
const MainLayout = {
	controller(){
	},
    view(_ctrl, _attrs, children) {
        return ( 
        	<div>
	        	<div id="mithril-modal"><Modal /></div>
	            <div class="MainLayout">
	                {children}
	            </div>
            </div>
        );
    }
};

export default MainLayout;
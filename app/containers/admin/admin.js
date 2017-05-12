import m from 'mithril';
import Products from '../../components/admin/products';
import Clients from '../../components/admin/clients';
import Modal from '../modal/modal';
import {Alert} from '../../components/ui';

export const Admin = {
    controller(p){
    	this.tab = m.prop(1);
    	this.construction = () => {
    		Modal.vm.open(Alert, {label: 'En construcción'});
    	}
    },
    view(c,p){
    	
        return (

			<div class="panel panel-default admin">
			  	<div class="panel-body">
		        	<div>
						<div class="pt-tabs">
						    <ul class="pt-tab-list pt-large" role="tablist"> 
						        <li class="pt-tab " role="tab" aria-selected={(c.tab() == 1)} ><a class="tab-link"  onclick={c.tab.bind(c,1)}> Clientes</a></li>
						        <li class="pt-tab " role="tab" aria-selected={(c.tab() == 2)} ><a class="tab-link" onclick={c.tab.bind(c,2)}> Productos</a></li>
						        <li class="pt-tab " role="tab" aria-selected={(c.tab() == 3)} ><a class="tab-link" onclick={c.construction.bind(c)}> Pedidos</a></li>
						    </ul>
						    <div class="pt-tab-panel" role="tabpanel" aria-hidden={!(c.tab() == 1)}><Clients /></div>
						    <div class="pt-tab-panel" role="tabpanel" aria-hidden={!(c.tab() == 2)}><Products /></div>
						    <div class="pt-tab-panel" role="tabpanel" aria-hidden="true"></div>
						</div>
		        	</div>
			  	</div>
			</div>

        )
    }
}

export default Admin;
 
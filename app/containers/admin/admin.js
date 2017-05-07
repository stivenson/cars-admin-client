import m from 'mithril';
import Products from '../../components/admin/products'


export const Admin = {
    controller(p){
    },
    view(c,p){
        return (

			<div class="panel panel-default admin-panel">
			  	<div class="panel-body admin-panel">
		        	<div class="admin">
						<div class="pt-tabs">
						    <ul class="pt-tab-list pt-large" role="tablist">
						        <li class="pt-tab " role="tab" aria-selected="true">Productos</li>
						        <li class="pt-tab " role="tab">Pedidos</li>
						        <li class="pt-tab " role="tab">Clientes</li>
						    </ul>
						    <div class="pt-tab-panel" role="tabpanel"><Products /></div>
						    <div class="pt-tab-panel" role="tabpanel" aria-hidden="true">In construction </div>
						    <div class="pt-tab-panel" role="tabpanel" aria-hidden="true">In construction </div>
						</div>
		        	</div>
			  	</div>
			</div>

        )
    }
}

export default Admin;
 
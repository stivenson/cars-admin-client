import m from 'mithril';
import Products from '../../components/admin/products';
import Clients from '../../components/admin/clients';
import Orders from '../../components/admin/orders';
import {Sesion} from '../../components/admin/models';
import Modal from '../modal/modal';
import {Alert} from '../../components/ui';

export const Admin = {
    controller(p){
        this.tab = m.prop(1);
        
        this.construction = () => {
            Modal.vm.open(Alert, {label: 'En construcción'});
        }

        this.logout = () => {
            Sesion.logout();
            m.route('/login');
        }
    },
    view(c,p){

        console.log(localStorage.getItem('sesion'));

        if(localStorage.getItem('sesion') === 'false'){
            m.route('/login');
        }
        
        return (

            <div class="panel panel-default admin">
                <div class="panel-body">
                    <div class="logout">
                        <a onclick={c.logout.bind(c)}><span class="pt-icon-standard pt-icon-delete" ></span> Cerrar Sesión</a>
                    </div>
                    <div>
                        <div class="pt-tabs">
                            <ul class="pt-tab-list pt-large" role="tablist"> 
                                <li class="pt-tab" role="tab" aria-selected={(c.tab() == 1)} ><a class="tab-link"  onclick={c.tab.bind(c,1)}> Clientes</a></li>
                                <li class="pt-tab" role="tab" aria-selected={(c.tab() == 2)} ><a class="tab-link" onclick={c.tab.bind(c,2)}> Productos</a></li>
                                <li class="pt-tab" role="tab" aria-selected={(c.tab() == 3)} ><a class="tab-link" onclick={c.tab.bind(c,3)}> Pedidos</a></li>
                            </ul>
                            <div class="pt-tab-panel" role="tabpanel" aria-hidden={!(c.tab() == 1)} ><Clients /></div>
                            <div class="pt-tab-panel" role="tabpanel" aria-hidden={!(c.tab() == 2)} ><Products /></div>
                            <div class="pt-tab-panel" role="tabpanel" aria-hidden={!(c.tab() == 3)} ><Orders /></div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default Admin;
 
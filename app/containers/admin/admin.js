import m from 'mithril';
import Products from '../../components/admin/products';
import Clients from '../../components/admin/clients';
import Orders from '../../components/admin/orders';
import {Sesion} from '../../components/admin/models';
import Modal from '../modal/modal';
import {Alert} from '../../components/ui';

export const Admin = {
    controller(p){
        this.tab = m.prop(3);
        this.interval = m.prop('');
        
        this.construction = () => {
            Modal.vm.open(Alert, {label: 'En construcción'});
        };

        this.message = () => {
            Modal.vm.open(Alert, {label: 'Realizando ultimas correcciones'});
        };

        this.logout = () => {
            try {
                clearInterval(this.interval());
            } catch (error) {}
            Sesion.logout();
        };

        if(Sesion.notHaveSession()){
            m.route('/login');
            window.location.reload();
        }

        this.getOrdersTag = () => {
            return <Orders interval={this.interval.bind(this)}/>;
        };

        this.getOrdersSection = () => {
            try {
                clearInterval(this.interval());
            } catch (error) {}
            this.tab(3);
        };

        // this.getOrdersSection();

    },
    view(c,p){
        
        let orders = '';

        if(c.tab() === 3)
            orders = c.getOrdersTag();

        return (

            <div class="panel panel-default admin">
                <div class="panel-body">
                    <div class="logout">
                        <a onclick={c.logout.bind(c)}><span class="pt-icon-standard pt-icon-delete" ></span> Cerrar Sesión</a>
                    </div>
                    <div>
                        <div class="pt-tabs">
                            <ul class="pt-tab-list pt-large" role="tablist"> 
                                <li class="pt-tab" role="tab" aria-selected={(c.tab() == 3)} ><a class="tab-link" onclick={c.getOrdersSection.bind(c)}> Pedidos</a></li>
                                <li class="pt-tab" role="tab" aria-selected={(c.tab() == 1)} ><a class="tab-link"  onclick={c.tab.bind(c,1)}> Clientes</a></li>
                                <li class="pt-tab" role="tab" aria-selected={(c.tab() == 2)} ><a class="tab-link" onclick={c.tab.bind(c,2)}> Productos</a></li>
                            </ul>
                            <div class="pt-tab-panel" role="tabpanel" aria-hidden={!(c.tab() == 1)} ><Clients /></div>
                            <div class="pt-tab-panel" role="tabpanel" aria-hidden={!(c.tab() == 2)} ><Products /></div>
                            <div class="pt-tab-panel" role="tabpanel" aria-hidden={!(c.tab() == 3)} >{orders}</div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
};

export default Admin;
 
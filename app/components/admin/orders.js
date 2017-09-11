import m from 'mithril';
import {Order, Client, Product, Itemorder, Sesion, STATUTES, DELIVERY_TYPES} from './models';
import API from '../api';
import Modal from '../../containers/modal/modal';
import {Spinner, Button, Alert, Confirm} from '../../components/ui';
import Utils from '../utils';
import AdminModalproduct from './modalproduct';

export const Orders = {
    vm(p){
    	return {
            working: m.prop(false),
            orders: m.prop('empty'),
            clients: m.prop('empty'),
            products: m.prop('empty'),
            delivery_types: m.prop(DELIVERY_TYPES), 
            statutes: m.prop(STATUTES),
            readonly: m.prop(false),
            order: m.prop(new Order()),
            loadingMoreOrders: m.prop(false),
            waitForm: m.prop(false),
            arr_check_status: []
        }; 
    },
    controller(p){
        this.vm = Orders.vm(p);
        this.limitSizeImagen = 8388606;
        this.skip = 0;
        const MILISECONDS_FOR_REFRESH = 60000;  

        let currentformData = new FormData(); 

        let getOrders = (noSelect, index, take = 15, skip = null) => {
            index = index || null;
            this.vm.working(true);
            if(skip != null)
                this.skip = skip;
            Order.list(this.skip, take)
                .then(r => {
                    this.vm.loadingMoreOrders(false);
                    if(this.skip > 0)
                        this.vm.orders(this.vm.orders().concat(r));
                    else
                        this.vm.orders(r);

                    this.skip += r.length;
                })
                .then(()=>this.vm.working(false))
                .then(() => {
                    if(index != null)
                        this.edit(index);
                })
                .then(()=>{
                    if(noSelect == true) 
                        this.add();
                })
                .then(()=>m.redraw())
                .catch(() => {
                    if(!Sesion.haveSesionAdmin()){
                        Modal.vm.open(Alert, { label: 'La sesión se encuentra cerrada, porfavor, vuelva a iniciarla' });
                        m.route('/login');
                    }
                });
        };

        getOrders(true,null);


        this.getMoreOrders = () => {
            this.vm.loadingMoreOrders(true);
            getOrders(true,null);
        };

        let getClients = () => {
            this.vm.working(true);
            Client.list(true)
                .then(this.vm.clients)
                .then(() => this.vm.working(false))
                .then(() => m.redraw());
        };

        this.nameUser = (clients_id) => {
            if(clients_id != false){    
                let arr = this.vm.clients().filter(c => c.id() == clients_id);
                if(arr.length < 1)
                    return ' -- ';
                return arr[0].name()+' - '+arr[0].cc(); 
            }else{
                return '--';    
            }
            
        }; 

        getClients();

        let getProducts = () => {
            this.vm.working(true);
            Product.list(true)
                .then(this.vm.products)
                .then(() => {
                    let arrProducts = this.vm.products();
                    for(let indexp in arrProducts){
                        arrProducts[indexp].selected(this.vm.order().isChecked(arrProducts[indexp].id()));
                    }
                })
                .then(() => this.vm.working(false))
                .then(() => m.redraw());
        };

        getProducts();

        this.add = () => {
            currentformData = new FormData();
            this.vm.waitForm(true);
            this.vm.order(new Order());
            this.vm.readonly(false);
            this.vm.order().items_orders([]);
            this.refreshStatus();
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },350);
        };

        this.edit = (index) => {
            currentformData = new FormData();
            this.vm.waitForm(true);
            let arrOrders = this.vm.orders();
            let arrEditOrder = arrOrders.filter(eo => eo.id() == index);
            let editOrder = arrEditOrder[0];
            this.vm.order(editOrder);
            this.vm.readonly(false);
            this.vm.order().getItems(this.refreshStatus.bind(this));
            this.refreshStatus();
            setTimeout(() => {              
                this.vm.waitForm(false);
                m.redraw();
            },350);
        };

        this.detail = (index) => {
            this.vm.waitForm(true);
            
            let arrOrders = this.vm.orders();
            let arrDetailOrder = arrOrders.filter(o => o.id() == index);
            let detailOrder = arrDetailOrder[0];
            this.vm.order(detailOrder);

            this.vm.readonly(true);
            this.vm.order().getItems(this.refreshStatus.bind(this));
            this.refreshStatus();
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },350);
        };

        try {
            clearInterval(p.interval());
        } catch (error) {}

        setTimeout(() => {
            p.interval(setInterval(() => getOrders(false, null, this.vm.orders().length, 0), MILISECONDS_FOR_REFRESH));
        },10000);
        
        this.changeState = (index,status) => {
            currentformData = new FormData();
            this.vm.waitForm(true);

            let arrOrders = this.vm.orders();
            let arrChangeOrder = arrOrders.filter(co => co.id() == index);
            let changeOrder = arrChangeOrder[0];
            this.vm.order(changeOrder);
            
            this.vm.readonly(false);
            this.vm.order().form.status(status.id);
            this.refreshStatus();
            setTimeout(() => {    
                this.vm.order().getItemsPromise().then((r) => {
                    if(r != false){
                        this.vm.order().items_orders(r);
                        this.vm.order().form.items_orders(r);
                        this.refreshStatus(); // refresh checkboxs
                        this.save(null,index);  
                        this.vm.waitForm(false);
                        m.redraw();
                    }
                }).catch(e => console.log(`Error gettings items of order ${this.vm.order().id}`));                               
            },350);
        };


        this.openProduct = (product) => {
            return Modal.vm.open(AdminModalproduct, {order: this.vm.order.bind(this.vm),product: product, className: 'mmodal-small'});
        };

        this.detailProduct = (products_id) => {
            let currentProducts = this.vm.products().filter(p => p.id() == products_id);
            this.openProduct(currentProducts[0]).then( r => this.refreshStatus() );
        };

        this.statusProduct = (products_id) => {
            let selected = this.vm.order().items_orders().filter(o => o.products_id() == products_id);

            if(selected.length > 0){
                this.vm.order().items_orders(this.vm.order().items_orders().filter(o => o.products_id() != products_id));
            }else{
                // open modal
                let currentProducts = this.vm.products().filter(p => p.id() == products_id);
                this.openProduct(currentProducts[0]).then( r => this.refreshStatus() );
            }
            this.refreshStatus();
        };

        this.refreshStatus = () => {
            this.vm.arr_check_status.length = 0;
            this.vm.arr_check_status = null;
            this.vm.arr_check_status = [];

            for(let io of this.vm.order().items_orders()){
                this.vm.arr_check_status.push(io.products_id());
            }
            m.redraw();
        };

        this.arrCheckStatus = (id) => {
            return this.vm.arr_check_status.some(i => i == id);
        };


        this.save = (event, indexChangeStatus = false) => {
            if (event) { event.preventDefault(); }
            if (this.vm.working()) return;
            if (this.vm.order().jsonItemsOrders() == '[]') {
                Modal.vm.open(Alert, {label: 'Debe seleccionar al menos un producto'});
                return;
            }

            let endpoint = 'orders';
            let options = {
                serialize: (value) => value,
                url: API.requestUrl(endpoint)
            };

            currentformData.append('created_at', this.vm.order().form.created_at());
            currentformData.append('items_orders', this.vm.order().jsonItemsOrders());
            currentformData.append('delivery_type', this.vm.order().form.delivery_type());
            currentformData.append('status', this.vm.order().form.status());
            currentformData.append('users_id', this.vm.order().form.users_id());

            if(this.vm.order().form.id() != false){

                currentformData.append('id', this.vm.order().form.id());
                this.vm.working(true);
                Order.save(currentformData,options)
                .then(res => {
                    this.vm.working(false);
                    if(res == false){
                        Modal.vm.open(Alert, {label: 'No se pudo actualizar la orden'});
                    }else{  
                        let auxIndex = this.vm.order().id();

                        if(indexChangeStatus !== false){
                            auxIndex = indexChangeStatus;
                        }

                        getOrders(false,auxIndex, this.vm.orders().length, 0);
                        Modal.vm.open(Alert, {label: 'Orden actualizada con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                    }   
                }).catch(erSave => {
                    this.vm.working(false);
                    Modal.vm.open(Alert, {label: 'No se pudo actualizar la orden, por favor verifique datos faltantes, y/o reales'});
                });

            }else{

                // validation for make
                this.vm.working(true);
                Order.save(currentformData,options)
                .then(res => {
                    this.vm.working(false);
                    if(res == false){
                        Modal.vm.open(Alert, {label: 'No se pudo guardar la orden'});
                    }else{  
                        this.vm.order(new Order());
                        currentformData = new FormData();
                        getOrders(true, null, this.vm.orders().length, 0);
                        Modal.vm.open(Alert, {label: 'Orden guardada con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                    }
                }).catch(erSave => {
                    this.vm.working(false);
                    Modal.vm.open(Alert, {label: 'No se pudo guardar la orden, por favor verifique datos faltantes, y/o reales'});
                });

            }

        };

        this.total = () => {
            let res = 0;
            for(let io of this.vm.order().items_orders()){
                let prArr = this.vm.products().filter( p => p.id() == io.products_id() );
                let pr = prArr[0];
                res += (parseFloat(pr.numberValue()) * parseInt(io.amount()));
            }
            return Utils.formatMoney(res);
        };
    },
    view(c,p){

        let spinner = <div class="custom-spinner text-center"><Spinner Large /></div>;
        let smallSpinner = <div class="text-center"><Spinner small /></div>;

        let list = spinner;
        let form = spinner;
        let selectUsers = smallSpinner;

        let btnAdd = <button onclick={c.add.bind(c)} type="button" class="pt-button custom-add-btn" ><span style="color: red;" class="pt-icon-standard pt-icon-add"></span> Agregar Orden</button>;

        if(c.vm.clients() != 'empty'){
            selectUsers = ( 
                <label class="pt-label">
                    Cliente
                    <div class="pt-select">
                        <select disabled={c.vm.readonly()} name="users_id" onchange={m.withAttr('value', (v) => c.vm.order().form.users_id(v))} required>
                            <option value="">Seleccione...</option>
                            {c.vm.clients().map((s) => {  
                                if(c.vm.order().form.users_id() == s.id()){
                                    return <option value={s.id()} selected>{s.name()} - {s.cc()}</option>;
                                }else{
                                    return <option value={s.id()} >{s.name()} - {s.cc()}</option>;
                                }                                
                            })}
                        </select>
                    </div>
                </label>
            )
        }

        let panelProducts = (
            <div class="panel-body text-center">
                <i class="fa fa-cog fa-spin fa-3x fa-fw"></i>
            </div>
        );

        if(c.vm.products() != 'empty' && c.vm.readonly()){
            panelProducts = (
                <ol>
                    {c.vm.order().items_orders().map((io) => {   
                        let arrP = c.vm.products().filter(pr => pr.id() == io.products_id());
                        let p = arrP[0];
                        return (
                            <li>
                                 <h5><b>{p.name()}</b> - <span class="custom-label-value">{p.value()}</span></h5>
                                 
                                 {io.amount()} unidades.
                                 <p class={io.observations() !== '' ? '':'hidden'}><b>Observations:</b> {io.observations()}</p>
                                 <hr/>
                            </li>
                        );
                    })}    
                </ol>
            );
        }

        if(c.vm.products() != 'empty' && !c.vm.readonly()){
            panelProducts = (
                <ul>
                    {c.vm.products().map((p,index) => {   
                        return (
                            <li>
                                <label class="pt-control pt-switch">
                                    {(() => {
                                        if(c.arrCheckStatus(p.id())) {
                                            return <input disabled={c.vm.readonly()} checked name="products" type="checkbox" onchange={c.statusProduct.bind(c, p.id())} />;
                                        } else {
                                            return <input disabled={c.vm.readonly()} name="products" type="checkbox" onchange={c.statusProduct.bind(c, p.id())} />;
                                        }
                                    })()}
                                    <span class="pt-control-indicator"></span>
                                    {p.name()} - {p.value()}
                                </label>
                            </li>
                        );
                    })}    
                </ul>
            );
        }

        if(c.vm.waitForm() == false){
            form = (
            <div class="panel panel-default">
                <div class="panel-body">
                    <form onsubmit={c.save.bind(c)} >
                        <div class={c.vm.order().form.id() != false ? '':'hidden'}>
                            <h4>Orden Nº {c.vm.order().form.id()}</h4>
                            <hr/>
                        </div>
                        <div class={c.vm.order().form.id() == false ? '':'hidden'}>
                            <h4>Nueva Orden</h4>
                            <hr/>
                        </div>
                        {selectUsers}
                        <div class="panel panel-default">
                            <div class="scroll-vertical">
                                {panelProducts}
                            </div>
                        </div>
                        <div class="panel panel-default" >
                            <div class="total-admin-car">
                                Total: <b>{c.total()}</b>
                            </div>
                        </div>
                        <label class="pt-label">
                            Entrega
                            <div class="pt-select">
                                <select disabled={c.vm.readonly()} name="delivery_type" onchange={m.withAttr('value', (v) => {if(v != null) c.vm.order().form.delivery_type(v)})} required >
                                    {c.vm.delivery_types().map((s) => {
                                        return (
                                            <option value={s.id} selected={c.vm.order().form.delivery_type() == s.id}>{s.name}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </label>
                        <label class="pt-label">
                            Estado
                            <div class="pt-select">
                                <select disabled={c.vm.readonly()} name="status" onchange={m.withAttr('value', (v) => {if(v != null) c.vm.order().form.status(v)})} required >
                                    {c.vm.statutes().map((s) => {
                                        return (
                                            <option value={s.id} selected={c.vm.order().form.status() == s.id}>{s.name}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </label>
                        <div class={"text-center "+(c.vm.readonly() ? 'hidden':'')}>
                            <Button type="submit" loading={c.vm.working()} >
                                Guardar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            );
        }


        let btnGetMoreOrders;

        btnGetMoreOrders = <Button loading={c.vm.loadingMoreOrders()} onclick={c.getMoreOrders.bind(c)} type="button" class="pt-button pt-minimal custom-btn-add-more-orders"><span class="pt-icon-standard pt-icon-add-to-artifact"></span> Ver ordenes anteriores</Button>;

        if(c.vm.orders() != 'empty' && c.vm.clients() != 'empty'){
            list = (
            	<div class="table-responsive custom-table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <td colspan="6"><i class="pt-tag pt-intent-success">Este listado se actualiza cada 60 segundos</i></td>
                            </tr>
                            <tr>
                                <th>Nº Orden</th>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Estado</th>
                                <th>Entrega</th>
                                <th class="custom-actions-th" colspan="2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        {c.vm.orders().map((order, index) => {
                            return (
                                <tr>
                                    <td><b>{order.id()}</b></td>
                                    <td>{order.created_at()}</td>
                                    <td>{c.nameUser(order.users_id())}</td>
                                    <td><span class={"pt-tag pt-large pt-round "+order.styleStatus()}>{order.objStatus().name}</span></td>
                                    <td>
                                    {(() => {
                                        if(order.delivery_type() == 1){
                                            return <div><i class="fa fa-plane fa-2x custom-delivery-type-list-domi" aria-hidden="true"></i></div>;
                                        }else{
                                            return <div><i style="" class="fa fa-location-arrow fa-2x custom-delivery-type-list" aria-hidden="true"></i></div>;
                                        }
                                    })()}
                                    </td>
                                    <td>
                                        <div class="row">
                                            <div style="width:100px;" class="col-xs-6 col-md-6 custom-actions">
                                                <button onclick={c.detail.bind(c, order.id())} type="button" class="pt-button pt-minimal" ><i class="fa fa-eye fa-2x" aria-hidden="true"></i></button>
                                            </div>
                                            <div class="col-xs-6 col-md-6 custom-actions">
                                                <div class="dropdown">
                                                    <button class="pt-button pt-minimal dropdown-toggle" type="button" data-toggle="dropdown"> 
                                                        <i class="fa fa-cog fa-2x" aria-hidden="true"></i>  
                                                        <span class="caret"></span>
                                                    </button>
                                                    <ul class="dropdown-menu">
                                                        <li><button onclick={c.edit.bind(c, order.id())} type="button" class="pt-button pt-minimal pt-icon-edit pt-intent-primary" >Editar</button></li>
                                                        <li><button onclick={c.changeState.bind(c, order.id(), STATUTES[0])}  type="button" class="pt-button pt-minimal pt-icon-intersection pt-intent-primary" >Pendiente</button></li>
                                                        <li><button onclick={c.changeState.bind(c, order.id(), STATUTES[1])}  type="button" class="pt-button pt-minimal pt-icon-intersection pt-intent-primary" >Confirmado</button></li>
                                                        <li><button onclick={c.changeState.bind(c, order.id(), STATUTES[2])}  type="button" class="pt-button pt-minimal pt-icon-intersection pt-intent-primary" >Cancelado</button></li>
                                                        <li><button onclick={c.changeState.bind(c, order.id(), STATUTES[3])}  type="button" class="pt-button pt-minimal pt-icon-intersection pt-intent-primary" >Entregado</button></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                    {btnGetMoreOrders}
            	</div>
            );
        }


        let content = (
            <div class="admin-orders row">
                <div clas="col-md-12">{btnAdd}<br/><br/></div> 

                <div class="col-md-8">
                    {list}
                </div> 
                <div class="col-md-4">   
                    {form}
                </div> 
            </div>
        );

        return content;

    }
};


export default Orders;

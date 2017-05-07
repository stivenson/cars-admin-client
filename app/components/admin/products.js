import m from 'mithril';
import {Spinner, Button} from '../../components/ui';
import { Product } from './models';


export const Products = {
    vm(p){
    	return {
            working: m.prop(false),
            products: m.prop('empty'),
            readonly: m.prop(false),
            product: m.prop(new Product({})),
            waitForm: m.prop(false)
        } 
    },
    controller(p){
        this.vm = Products.vm(p);
        this.vm.working(true);
        Product.list().then(this.vm.products).then(()=>this.vm.working(false)).then(()=>m.redraw());
        this.add = () => {
            this.vm.waitForm(true);
            this.vm.product(new Product({}));
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },500);
        }

        this.save = (event) => {
            // get results of functions this.vm.product().form
            var data = new FormData();
            // validate Size
            if(typeof event.target.files[0] != 'undefined'){
                    
                if(event.target.files[0].size >= limitSizeImagen){
                    Modal.vm.open(AlertModal, {label: 'La imagen es muy pesada'});
                    return true;
                }      
                
                data.append('file', event.target.files[0]);
                var endpoint = 'products';
                var options = {
                    config: (xhr) => {
                        let token = window.localStorage.getItem('token') || false;
                        if (token) {
                            API.configAuth(xhr, token);
                        }
                        xhr.setRequestHeader('X-Requested-With', Config.ID);
                    },
                    serialize: (value) => value,
                    url: API.requestUrl(endpoint)
                };
            // Product.save(data,options).then()
        }
    },
    view(c,p){

        let spinner = <div class="custom-spinner text-center"><Spinner Large /></div>;

        let list = spinner;
        let form = spinner;

        let btnAdd = <button onclick={c.add.bind(c)} type="button" class="pt-button pt-minimal pt-icon-add pt-intent-primary" >Agregar Producto</button>;
        let btnDetail = <button type="button" class="pt-button pt-minimal pt-icon-search pt-intent-primary" >Detallar</button>;
        let btnEdit = <button type="button" class="pt-button pt-minimal pt-icon-edit pt-intent-primary" >Editar</button>;
        let btnDelete = <button type="button" class="pt-button pt-minimal pt-icon-delete pt-intent-primary" >Borrar</button>;


        if(c.vm.waitForm() == false){
            form = (
            <div class="panel panel-default">
            <div class="panel-body">
                <form>
                    <label class="pt-label">
                        Nombre producto
                        <input
                            type="text"
                            class="pt-input pt-fill"
                            name="name"
                            oninput={m.withAttr('value', c.vm.product().form.name)}
                            value={c.vm.product().form.name()}
                            placeholder=""
                            disabled={c.vm.readonly()}
                        />
                    </label>

                    <label class="pt-label">
                        <div class="pt-control-group">
                            <input
                                type="text"
                                class="pt-input pt-fill"
                                name="value"
                                style="width:50%"
                                oninput={m.withAttr('value', c.vm.product().form.value)}
                                value={c.vm.product().form.value()}
                                placeholder="Valor en COP"
                                disabled={c.vm.readonly()}
                                required
                            />
                            <input
                                type="text"
                                class="pt-input pt-fill"
                                name="iva"
                                style="width:50%"
                                oninput={m.withAttr('value', c.vm.product().form.iva)}
                                value={c.vm.product().form.iva()}
                                placeholder="IVA"
                                disabled={c.vm.readonly()}
                            />
                        </div>
                    </label>
                </form>
            </div>
            </div>
            );
        }

        if(c.vm.products() != 'empty'){
            list = (
            	<div class="admin-products table-responsive">
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Descripción</th>
                                <th>Valor (COP)</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {c.vm.products().map(product => {
                            return (
                                <tr>
                                    <td>{product.name()}</td>
                                    <td>{product.smalldescription()}</td>
                                    <td>{product.value()}</td>
                                    <td>
                                    {(() => {
                                        if(product.available() == 1){
                                            return <span class="pt-tag pt-intent-success">Disponible</span>;
                                        }else{
                                            return <span class="pt-tag ">No disponible</span>;
                                        }
                                    })()}
                                    </td>
                                    <td>
                                        <div class="dropdown">
                                          <button class="pt-button pt-minimal dropdown-toggle" type="button" data-toggle="dropdown"> Acciones
                                          <span class="caret"></span></button>
                                          <ul class="dropdown-menu">
                                            <li>{btnDetail}</li>
                                            <li>{btnEdit}</li>
                                            <li>{btnDelete}</li>
                                          </ul>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
            	</div>
            );
        }


        let content = (
            <div class="row">
                <div clas="col-md-12">{btnAdd}<br/></div> 

                <div class="col-md-8">

                    {list}
                </div> 
                <div class="col-md-4">   
                    {form}
                </div> 
            </div>
        )

        return content;

    }
}


export default Products;

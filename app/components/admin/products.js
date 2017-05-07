import m from 'mithril';
import { Product } from './models';
import API from '../api';
import Modal from '../../containers/modal/modal';
import {Spinner, Button, Alert} from '../../components/ui';

export const Products = {
    vm(p){
    	return {
            working: m.prop(false),
            products: m.prop('empty'),
            readonly: m.prop(false),
            product: m.prop(new Product()),
            waitForm: m.prop(false)
        } 
    },
    controller(p){
        this.vm = Products.vm(p);
        this.limitSizeImagen = 8388606;

        let getProducts = () => {
            this.vm.working(true);
            Product.list()
                .then(this.vm.products)
                .then(()=>this.vm.working(false))
                .then(()=>m.redraw());
        }

        getProducts();

        this.add = () => {
            this.vm.waitForm(true);
             
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },500);
        }

        var currentformData = new FormData();

        this.prepareImage = (event) => {

            if(typeof event.target.files[0] != 'undefined'){
                    
                // validate Size
                if(event.target.files[0].size >= this.limitSizeImagen){
                    Modal.vm.open(Alert, {label: 'La imagen es muy pesada'});
                    return true;
                }      
                
                currentformData.append('image', event.target.files[0]);

            }else{
                Modal.vm.open(Alert, {label: 'Debe especificar imagen'});
                return true;
            }

        }

        this.save = () => {

            // validation for make

            let endpoint = 'products';
            let options = {
                serialize: (value) => value,
                url: API.requestUrl(endpoint)
            };

            currentformData.append('name', this.vm.product().form.name());
            currentformData.append('description', this.vm.product().form.description());
            currentformData.append('value', this.vm.product().form.value());
            currentformData.append('iva', this.vm.product().form.iva());
            currentformData.append('available', this.vm.product().form.available());

            // Get results of functions this.vm.product().form
            Product.save(currentformData,options).then(res => {
                if(res == false){
                    Modal.vm.open(Alert, {label: 'No se pudo guardar el producto'});
                }else{  
                    Modal.vm.open(Alert, {label: 'Producto guardado con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                    this.vm.product(new Product());
                    currentformData = new FormData();
                    getProducts();
                }
            }).then(()=>m.redraw())
        }

        setTimeout(()=> Modal.vm.open(Alert, {label: 'prueba de alert'}),3000);
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
                            required
                            disabled={c.vm.readonly()}
                        />
                    </label>

                        <div class="row">
                            <div class="col-md-12">
                                <div class="form-group" >
                                    <label for="venue-description">Descripción</label>
                                    <textarea
                                        value={c.vm.product().form.description()}
                                        onchange={m.withAttr('value', c.vm.product().form.description)}
                                        class="pt-fill pt-input"
                                        name="description"
                                        rows="5"
                                        required
                                        placeholder="Descripción del producto, incluyendo, adicionales y/o otras aclaraciones."></textarea>
                                </div>
                            </div>
                        </div>

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
                                required
                                disabled={c.vm.readonly()}
                            />
                        </div>
                    </label>

                    <label class="pt-file-upload">
                      <input    
                            id="product-file-upload" 
                            type="file" 
                            required
                            onchange={c.prepareImage.bind(c)}/>
                            <span class="pt-file-upload-input">Seleccionar imagen..</span>
                            <br/>
                            <br/>
                    </label>

                    <label class="pt-control pt-checkbox pt-inline">
                        <input
                            type="checkbox"
                            checked={c.vm.product().form.available()}
                            onclick={m.withAttr('checked', c.vm.product().form.available)}
                            />
                        <span class="pt-control-indicator"></span>
                        Disponible <i>(Si no esta disponible, no aparecerá para el cliente)</i>
                    </label>

                    <div class="text-center">
                        <Button type="button" onclick={c.save.bind(c)}>
                            Guardar
                        </Button>
                    </div>
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
            <div class="admin-products row">
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

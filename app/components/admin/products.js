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
            waitForm: m.prop(false),
            statusImage: m.prop('Seleccionar imagen')
        } 
    },
    controller(p){
        this.vm = Products.vm(p);
        this.limitSizeImagen = 8388606;
        var currentformData = new FormData();

        let getProducts = () => {
            this.vm.working(true);
            Product.list()
                .then(this.vm.products)
                .then(()=>this.vm.working(false))
                .then(()=>this.edit(0))
                .then(()=>m.redraw());
        }

        getProducts();

        this.add = () => {
            currentformData = new FormData();
            this.vm.waitForm(true);
            this.vm.product(new Product());
            this.vm.readonly(false);
            this.vm.statusImage('Seleccionar imagen');
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },500);
        }

        this.edit = (index) => {
            currentformData = new FormData();
            this.vm.waitForm(true);
            let arrProducts = this.vm.products();
            this.vm.product(arrProducts[index]);
            this.vm.product().index = m.prop(index);
            this.vm.readonly(false);
            this.vm.statusImage('Seleccionar imagen');
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },500);
        }

        this.detail = (index) => {
            this.vm.waitForm(true);
            let arrProducts = this.vm.products();
            this.vm.product(arrProducts[index]);
            this.vm.readonly(true);
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },500);
        }

        this.delete = (index) => {
            let arrProducts = this.vm.products();
            Product.delete(arrProducts[index].id())
            .then(res =>{
                if(res == false){
                    Modal.vm.open(Alert, {label: 'No se pudo eliminar el producto'});
                }else{  
                    Modal.vm.open(Alert, {label: 'Producto eliminado con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                    getProducts();
                }
            })
        }


        this.prepareImage = (event) => {

            if(typeof event.target.files[0] != 'undefined'){
                    
                // validate Size
                if(event.target.files[0].size >= this.limitSizeImagen){
                    Modal.vm.open(Alert, {label: 'La imagen es muy pesada'});
                    this.vm.statusImage('Seleccionar imagen');
                    return true;
                }      
                
                currentformData.append('image', event.target.files[0]);
                this.vm.statusImage('Hay una imagen');

            }else{
                Modal.vm.open(Alert, {label: 'Debe especificar imagen'});
                this.vm.statusImage('Seleccionar imagen');
                return true;
            }

        }

        this.save = () => {

            // validation for make

            if(this.vm.product().form.id() != false){

                // validation for make - less image
                let endpoint = 'products';
                let options = {
                    serialize: (value) => value,
                    url: API.requestUrl(endpoint)
                };

                currentformData.append('id', this.vm.product().form.id());
                currentformData.append('name', this.vm.product().form.name());
                currentformData.append('description', this.vm.product().form.description());
                currentformData.append('value', this.vm.product().form.value());
                currentformData.append('iva', this.vm.product().form.iva());
                currentformData.append('available', this.vm.product().form.available());

                // Get results of functions this.vm.product().form
                Product.save(currentformData,options)
                .then(res => {
                    if(res == false){
                        Modal.vm.open(Alert, {label: 'No se pudo actualizar el producto'});
                    }else{  
                        Modal.vm.open(Alert, {label: 'Producto actualizado con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                        this.edit(this.vm.product().index());
                        getProducts();
                    }
                })

            }else{

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
                })

            }


        }


    },
    view(c,p){

        let spinner = <div class="custom-spinner text-center"><Spinner Large /></div>;

        let list = spinner;
        let form = spinner;

        let btnAdd = <button onclick={c.add.bind(c)} type="button" class="pt-button pt-minimal pt-icon-add pt-intent-primary" >Agregar Producto</button>;


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

                    <div  class={"row "+(c.vm.readonly() == true ? 'hidden':'')} >
                        <div class="col-md-12">
                            <div class="form-group" >
                                <label for="description">Descripción</label>
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

                    <div  class={"row "+(c.vm.readonly() == false ? 'hidden':'')} >
                        <div class="col-md-12">
                            <b>Descripción</b><br/>
                            <p align="justify">{c.vm.product().form.description()}</p>
                        </div>
                    </div>

                    <label class="pt-label">
                        <div class="pt-control-group">
                            <div class="pt-input-group">
                            <span>Precio (COP)</span>
                            $<input
                                type="text"
                                class="pt-input pt-fill"
                                name="value"
                                oninput={m.withAttr('value', c.vm.product().form.value)}
                                value={c.vm.product().form.value()}
                                placeholder="Valor en COP"
                                disabled={c.vm.readonly()}
                                required
                            />
                            </div>
                            <div class="pt-input-group">
                            <span>IVA</span> 
                            <input
                                type="text"
                                class="pt-input pt-fill"
                                name="iva"
                                oninput={m.withAttr('value', c.vm.product().form.iva)}
                                value={c.vm.product().form.iva()}
                                placeholder="IVA"
                                required
                                disabled={c.vm.readonly()}
                            />
                            </div>
                        </div>
                    </label>

                    <label class={"pt-file-upload "+(c.vm.readonly() == true ? 'hidden':'')} >
                      <input    
                            id="product-file-upload" 
                            type="file" 
                            required
                            disabled={c.vm.readonly()}
                            onchange={c.prepareImage.bind(c)}/>
                            <span class="pt-file-upload-input">{c.vm.statusImage()}</span>
                            <br/>
                            <br/>
                    </label>

                    <div class={"text-center "+(c.vm.product().form.haveImage() ? ' ':'hidden')} >
                        <img src={c.vm.product().form.image()}/>
                        <br/><br/>
                    </div>

                    <label class={"pt-control pt-checkbox pt-inline "+(c.vm.readonly() == true ? 'hidden':'')} >
                        <input
                            type="checkbox"
                            disabled={c.vm.readonly()}
                            checked={c.vm.product().form.available()}
                            onclick={m.withAttr('checked', c.vm.product().form.available)}
                            />
                        <span class="pt-control-indicator"></span>
                        Disponible <i>(Si no esta disponible, no aparecerá para el cliente)</i>
                    </label>

                    <label class={"pt-control pt-checkbox pt-inline "+(c.vm.readonly() == true ? '':'hidden')} >
                        <div class={"pt-tag pt-intent-success "+(c.vm.product().form.available()?'':'hidden')}>Disponible</div>
                        <div class={"pt-tag "+(c.vm.product().form.available()?'hidden':'')}>No Disponible</div>
                    </label>

                    <div class={"text-center "+(c.vm.readonly() ? 'hidden':'')}>
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
                        {c.vm.products().map((product,index) => {
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
                                            <li><button onclick={c.detail.bind(c,index)} type="button" class="pt-button pt-minimal pt-icon-search pt-intent-primary" >Detallar</button></li>
                                            <li><button onclick={c.edit.bind(c,index)} type="button" class="pt-button pt-minimal pt-icon-edit pt-intent-primary" >Editar</button></li>
                                            <li><button onclick={c.delete.bind(c,index)}  type="button" class="pt-button pt-minimal pt-icon-delete pt-intent-primary" >Borrar</button></li>
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

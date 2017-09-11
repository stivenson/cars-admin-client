import m from 'mithril';
import { Product } from './models';
import API from '../api';
import Modal from '../../containers/modal/modal';
import {Spinner, Button, Alert, Confirm} from '../../components/ui';

export const Products = {
    vm(p){
    	return {
            working: m.prop(false),
            products: m.prop('empty'),
            readonly: m.prop(false),
            product: m.prop(new Product()),
            waitForm: m.prop(false),
            statusImage: m.prop('Seleccionar imagen')
        }; 
    },
    controller(p){
        this.vm = Products.vm(p);
        this.limitSizeImagen = 8388606;
        var currentformData = new FormData();

        let getProducts = (selectFirst,index) => {
            index = index || null;
            this.vm.working(true);
            Product.list()
                .then(this.vm.products)
                .then(()=>this.vm.working(false))
                .then(()=>{
                    if(index != null){
                        if(index == 'first')
                            index = 0;
                        this.edit(index);
                }})
                .then(()=>{if(selectFirst == true) {
                    this.detail(0);
                }})
                .then(()=>m.redraw());
        }

        getProducts(true,null);

        this.add = () => {
            currentformData = new FormData();
            this.vm.waitForm(true);
            this.vm.product(new Product());
            this.vm.readonly(false);
            this.vm.statusImage('Seleccionar imagen');
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },350);
        }

        this.edit = (index) => {
            currentformData = new FormData();
            this.vm.waitForm(true);
            let arrProducts = this.vm.products();
            this.vm.product(arrProducts[index]);
            this.vm.product().index = m.prop(index+1);
            this.vm.readonly(false);
            this.vm.statusImage('Seleccionar imagen');  

            setTimeout(() => {              
                this.vm.waitForm(false);
                m.redraw();
            },350);
        }

        this.detail = (index) => {
            this.vm.waitForm(true);
            let arrProducts = this.vm.products();
            this.vm.product(arrProducts[index]);
            this.vm.readonly(true);
            setTimeout(() => {
                this.vm.waitForm(false);
                m.redraw();
            },350);
        }

        this.delete = (index) => {
            let arrProducts = this.vm.products();
            Modal.vm.open(Confirm, {className: 'mmodal-small', mood: 'success', icon: 'ok-circle',label: '¿Confirmas que deseas borrar este producto?', actionLabel: 'Eliminar producto'})
            .then(() => {
                    Product.delete(arrProducts[index].id())
                    .then(res =>{
                        if(res == false){
                            Modal.vm.open(Alert, {label: 'No se pudo eliminar el producto'});
                        }else{  
                            getProducts(true,null);
                            Modal.vm.open(Alert, {label: 'Producto eliminado con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                        }
                    })
                }
            );

        }


        this.prepareImage = (event) => {

            if(typeof event.target.files[0] != 'undefined'){
                    
                // validate Size
                if(event.target.files[0].size >= this.limitSizeImagen){
                    this.vm.statusImage('Seleccionar imagen');
                    Modal.vm.open(Alert, {label: 'La imagen es muy pesada'});
                }      
                
                currentformData.append('image', event.target.files[0]);
                this.vm.statusImage('Hay una imagen');

            }else{
                this.vm.statusImage('Seleccionar imagen');
                Modal.vm.open(Alert, {label: 'Debe especificar imagen'});
            }

        };

        this.save = (event) => {
            if (event) { event.preventDefault(); }
            if (this.vm.working()) return;

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

            if(this.vm.product().form.id() != false){

                // validation for make - less image

                currentformData.append('id', this.vm.product().form.id());
                this.vm.working(true);
                Product.save(currentformData,options)
                .then(res => {
                    this.vm.working(false);
                    if(res == false){
                        Modal.vm.open(Alert, {label: 'No se pudo actualizar el producto'});
                    }else{  
                        let auxIndex = (this.vm.product().index()-1) == 0 ? 'first': this.vm.product().index()-1;
                        getProducts(false,auxIndex);
                        Modal.vm.open(Alert, {label: 'Producto actualizado con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                    }   
                }).catch(erSave => {
                    this.vm.working(false);
                    Modal.vm.open(Alert, {label: 'No se pudo actualizar el producto, por favor verifique datos faltantes, y/o reales'});
                });

            }else{

                // validation for make
                this.vm.working(true);
                Product.save(currentformData,options)
                .then(res => {
                    this.vm.working(false);
                    if(res == false){
                        Modal.vm.open(Alert, {label: 'No se pudo guardar el producto'});
                    }else{  
                        this.vm.product(new Product());
                        currentformData = new FormData();
                        getProducts(true,null);
                        Modal.vm.open(Alert, {label: 'Producto guardado con éxito', icon: 'pt-icon-endorsed',mood: 'success'});
                    }
                }).catch(erSave => {
                    this.vm.working(false);
                    Modal.vm.open(Alert, {label: 'No se pudo guardar el producto, por favor verifique datos faltantes, y/o reales'});
                });

            }


        }


    },
    view(c,p){

        let spinner = <div class="custom-spinner text-center"><Spinner Large /></div>;

        let list = spinner;
        let form = spinner;

        let btnAdd = <button onclick={c.add.bind(c)} type="button" class="pt-button pt-minimal pt-icon-add pt-intent-primary custom-add-btn" >Agregar Producto</button>;


        if(c.vm.waitForm() == false){
            form = (
            <div class="panel panel-default">
            <div class="panel-body">
                <form onsubmit={c.save.bind(c)} >
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
                        <div class="pt-control-group pt-vertical pt-intent-primary">
                            <div class="pt-input-group">
                            <span>Precio (COP)</span>
                            <input
                                type="text"
                                class="pt-input "
                                name="value"
                                oninput={m.withAttr('value', c.vm.product().form.value)}
                                value={c.vm.product().form.value()}
                                placeholder="Valor en COP (solo números)"
                                disabled={c.vm.readonly()}
                                required
                            />
                            </div>
                            <div class="pt-input-group">
                            <span>IVA</span> 
                            <input
                                type="text"
                                class="pt-input "
                                name="iva"
                                oninput={m.withAttr('value', c.vm.product().form.iva)}
                                value={c.vm.product().form.iva()}
                                placeholder="IVA (solo números)"
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
                            required={c.vm.product().form.id() == false}
                            disabled={c.vm.readonly()}
                            onchange={c.prepareImage.bind(c)}
                            accept="image/*" />
                            <span class={"pt-file-upload-input "+(c.vm.statusImage() == 'Seleccionar imagen' ? '':'have-image')}>{c.vm.statusImage()}</span>
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
                        <div class={"pt-tag pt-intent-success "+(c.vm.product().form.available() == true?'':'hidden')}>Disponible</div>
                        <div class={"pt-tag "+(c.vm.product().form.available() == true?'hidden':'')}>No Disponible</div>
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

        if(c.vm.products() != 'empty'){
            list = (
            	<div class="table-responsive custom-table-responsive">
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
                                        if(product.available() == true){
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
        );

        return content;

    }
}


export default Products;

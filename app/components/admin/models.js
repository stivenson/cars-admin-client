import m from 'mithril';
import API from '../api';
import Utils from '../utils';

export const Product = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.name = m.prop(data.name || '');
    this.description = m.prop(data.description || '');
    this.smalldescription = m.prop(this.description().substring(0,10)+'...');
    this.value = m.prop(Utils.formatMoney(data.value) || '');
    this.available = m.prop(data.available == true ? true : false);
    this.iva = m.prop(data.iva || 0);
    let mime = data.mime || ' ';
    let urlImage = `data:image/${mime};base64,${(data.image1 || ' ')}`;
    this.image = m.prop(urlImage);
    

    this.form = {
        id: m.prop(data.id || ''),
        name: m.prop(data.name || ''),
        description: m.prop(data.description || ''),
        value: m.prop(data.value || ''),
        available: m.prop(data.available == true ? true : false),
        iva: m.prop(data.iva || ''),
        image: m.prop(urlImage),
        haveImage: m.prop(mime != ' ')
    } 

}

Product.list = function () {
    return API.get('products', {type: Product});
}

Product.save = function (data,options) {
    return API.post('products',data,options);
}

Product.delete = function (id) {
    return API.get(`temporal/delete/products/${id}`);
}



export const Client = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.name = m.prop(data.name || '');
    this.cc = m.prop(data.cc || '');
    this.roles_id = m.prop(data.roles_id || 2); // clients rol for default
    this.telephone = m.prop(data.telephone || '');
    this.cell_phone = m.prop(data.cell_phone || '');
    this.email = m.prop(data.email || '');
    this.password = m.prop(data.password || '');
    this.neighborhood = m.prop(data.neighborhood || '');
    this.address = m.prop(data.address || '');

    this.form = {
        id: m.prop(data.id || ''),
        name: m.prop(data.name || ''),
        cc: m.prop(data.cc || ''),
        roles_id: m.prop(data.roles_id || 2), // clients rol for default
        telephone: m.prop(data.telephone || ''),
        cell_phone: m.prop(data.cell_phone || ''),
        email: m.prop(data.email || ''),
        password: m.prop(data.password || ''),
        neighborhood: m.prop(data.neighborhood || ''),
        address: m.prop(data.address || '')
    }

}

Client.list = function () {
    return API.get('clients', {type: Client});
}

Client.save = function (data,options) {
    return API.post('clients',data,options);
}

Client.delete = function (id) {
    return API.get(`temporal/delete/clients/${id}`);
}






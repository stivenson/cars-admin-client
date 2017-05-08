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
    this.available = m.prop(data.available || '');
    this.iva = m.prop(data.iva || 0);
    let mime = data.mime || ' ';
    let urlImage = `data:image/${mime};base64,${(data.image1 || ' ')}`;
    this.image = m.prop(urlImage);
    

    this.form = {
        id: m.prop(data.id || ''),
        name: m.prop(data.name || ''),
        description: m.prop(data.description || ''),
        value: m.prop(data.value || ''),
        available: m.prop(data.available || ''),
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

Product.update = function (data,options) {
    return API.post(`temporal/edit/products/${data.id}`,data,options);
}

Product.delete = function (id) {
    return API.get(`temporal/delete/products/${id}`);
}




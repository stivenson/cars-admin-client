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


    this.form = {
        id: m.prop(data.id || ''),
        name: m.prop(data.name || ''),
        description: m.prop(data.description || ''),
        value: m.prop(data.value || ''),
        available: m.prop(data.available || ''),
        iva: m.prop(data.iva || '')
    } 

}

Product.list = function () {
    return API.get('products', {type: Product});
}

Product.save = function (data,options) {
    return API.post('products',data,options);
}



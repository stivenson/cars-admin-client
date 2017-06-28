import m from 'mithril';
import API from '../api';
import Utils from '../utils';
// For Castings

export const MProduct = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.name = m.prop(data.name || "");
    this.description = m.prop(data.description || "");
    this.value = m.prop(Utils.formatMoney(data.value) || "");
    this.numberValue = m.prop(data.value || 0);
    this.iva = m.prop(data.iva || "");
    this.available = m.prop(data.available || "");
    this.image1 = m.prop(data.image1 || "");
    this.mime = m.prop(data.mime || "");

    this.srcImage = m.prop(`data:image/${this.mime()};base64,${this.image1()}`);
}


MProduct.listAvailable = () => {
    return API.get('spe/products/available',{type:MProduct});
}

MProduct.get = (id) => {
	return API.get(`products/${id}`,{type:MProduct});
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

Client.list = function (select) {
    if(select)
        return API.get('clients/order/true', {type: Client});
    else
        return API.get('clients', {type: Client});
}

Client.save = function (data,options) {
    return API.post('clients',data,options);
}

Client.delete = function (id) {
    return API.get(`temporal/delete/clients/${id}`);
}
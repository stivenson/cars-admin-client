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
    this.iva = m.prop(data.iva || "");
    this.available = m.prop(data.available || "");
    this.image1 = m.prop(data.image1 || "");
    this.mime = m.prop(data.mime || "");
    this.srcImage = m.prop(`data:image/${data.mime.trim()};base64,${data.image1.trim()}`);
}


MProduct.listAvailable = () => {
    return API.get('spe/products/available',{type:MProduct});
}

MProduct.get = (id) => {
	return API.get(`products/${id}`,{type:MProduct});
}
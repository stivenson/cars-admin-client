import m from 'mithril';
import API from '../api';
import Utils from '../utils';


export const Client = function(data) {
    data = data || {};
    this.id = m.prop(data.id || false);
    this.email = m.prop(data.email || '');
    this.password = m.prop(data.password || '');

    this.form = {
        id: m.prop(data.id || ''),
        email: m.prop(data.email || ''),
        password: m.prop(data.password || '')
    }
}

Client.login = function (credentials) {
	// pending
	return new Promise((resolve, reject) => { // temporal
		resolve(true);	
	});
}
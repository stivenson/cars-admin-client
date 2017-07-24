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

const TEMPORAL_CREDENTIALS = {
    EMAIL: 'admin@senseibistro.com', // temporal validation
    PASSWORD: 'admin_sen_321' // temporal validation
}

Client.login = function (credentials) {
	// pending
	return new Promise((resolve, reject) => { // temporal
        // Temporal
        if(TEMPORAL_CREDENTIALS.EMAIL == credentials.email && TEMPORAL_CREDENTIALS.PASSWORD == credentials.password ){
            localStorage.setItem('sesion',true);
            localStorage.setItem('users_id',1);
            resolve(true);
        } else {
            localStorage.setItem('sesion',false);
            localStorage.setItem('users_id',null);
            resolve(false);
        }
	});
}

Client.logout = function () {
    localStorage.setItem('sesion',false);
}
import m from 'mithril';
import API from '../api';
import Utils from '../utils';
//import Auth from '../../containers/auth/auth';

import {
    InputAutoComplete,
    TextArea,
    Button,
    Spinner
} from '../ui';

import { ModalHeader } from '../modal/header';
import { ModalTabs } from '../modal/tabs';
import Modal from '../../containers/modal/modal';
import { MProduct } from './models';


const CarModalproduct = {};

CarModalproduct.vm = function (config) {
    return {
        methods: {
            goToClient() {
                if (this.areDetailsValid()) {
                    this.step(TAB_CLIENT);
                }
            }
        },
        appointment: m.prop(false),
        step: m.prop(TAB_DETAILS),
        saving: m.prop(false),
        submitted: m.prop(false),
        slots: m.prop([]),
        employees: CarModalproduct.employees(),
        categories: Category.list(),
        validators: {
            customer: Customer.validator()
        },
        loading: {
            employees: m.prop(true),
            categories: m.prop(true)
        },
        fetchSlots() {
            var date = this.appointment().starts().format('YYYY-MM-DD');
            var service = this.appointment().services_id();
            var employee = this.appointment().employees_id();

            return Service.availabilities(date, service, employee).then(this.slots).then(() => m.redraw());
        },
        searchCustomers(text) {
            return Customer.list(text);
        },
        next() {
            this.step(this.step() === 0 ? 1 : 0);
        },
        isReady() {
            return this.appointment().form.service() !== false
                && this.appointment().form.customer() !== false
                && this.appointment().form.duration() > 0
                && this.appointment().form.slot() != false
                && this.appointment().form.employee() !== false
                && (this.appointment().status());
        },
        validate() {
            var filled = this.isReady();

            // Mark all form as submitted
            this.submitted(true);
            this.validators.customer.clearErrors();

            if (filled) {
                this.validators.customer.validate(this.appointment().form.customer());
                if (this.validators.customer.hasErrors()) {
                    this.step(1);
                    return false;
                }

                return true;
            }

            return false;
        },
        areDetailsValid() {
            return this.appointment() !== false
                && this.appointment().starts() !== false
                && this.appointment().services_id() != false
                && this.appointment().employees_id() != false;
        },
        onChangeStatus(status) {
            let s = Statuses[status];

            this.appointment().status(s);
        },
        onChangeService(id) {
            this.categories().map((category) => {
                category.children().map((service) => {
                    if (service.id() == id) {
                        this.appointment().services_id(id);
                        this.appointment().form.duration(service.duration());
                        this.appointment().form.price(service.price());
                    }
                });
            });
        },
        onDateChange(dateStr) {
            var date = moment(dateStr);

            if (date.isValid()) {
                this.appointment().starts().set({
                    year: date.year(),
                    month: date.month(),
                    date: date.date()
                });

                this.fetchSlots();
            }
        },
        onTimeChange(timeStr) {
            var time = moment(timeStr, "HH:mm");

            if (time.isValid()) {
                this.appointment().starts().set({
                    hour: time.hour(),
                    minute: time.minute(),
                });
            }
        },
        onChangeEmployee(id) {
            this.appointment().employees_id(id);
        },
        submit(event, forUploadAutomaticEmployee) {
            if (event) { event.preventDefault(); }
            let automaticEmployee = forUploadAutomaticEmployee || false;
            if (this.saving()) {
                return;
            }

            let isNew = this.appointment().isNew();
            let step = this.step();

            if (isNew) {
                if (step == TAB_DETAILS && this.areDetailsValid()) {
                    return this.step(TAB_CLIENT);
                }
            } else {
                if (step != TAB_RESUME && this.appointment().status().id() == 'canceled' && this.appointment().form.cancelReason() == false) {
                    return this.step(TAB_RESUME);
                }
            }

            this.validators.customer.clearErrors();
            this.validators.customer.validate(this.appointment().form.customer());

            if (this.validators.customer.hasErrors()) {
                return this.step(TAB_CLIENT);
            }

            this.saving(true);

            Customer.save(this.appointment().form.customer()).then((_customer) => {
                if (this.appointment().form.customer().id() == false) {
                    this.appointment().form.customer().id(_customer.users_id);
                }

                Appointment.save(this.appointment()).then((appointment) => {
                    config.resolve(appointment);
                    if (!automaticEmployee) {
                        Modal.vm.terminate();
                        m.redraw(true);
                    } else {
                        this.saving(false);
                    }
                });
            }, (exception) => {
                let errors = exception.errors || {};

                // Something has failed while updating or creating the customer
                for (var e in errors) {
                    var error = errors[e];
                    this.validators.customer.errors[error.field] = error.message;
                }

                this.saving(false);
                this.step(TAB_CLIENT);
                m.redraw(true);
            });
        },
        timetable: m.prop(false),
        getTimetable: () => {
            return API.get('venues/:vid:/schedules');
        },
        findEmployeeAvailable(date_start, date_end) {

            if (date_start == null || date_end == null) { return false; }

            let arrResources = Auth.vm.venue().employees;
            if (arrResources.length < 1) { return false; }
            let nextResourceAvailable = false;
            let objArrHours = this.timetable().employees;

            for (let ioah in arrResources) {

                let arrRangesAvailables = objArrHours[arrResources[ioah].id].week;
                for (let iara in arrRangesAvailables) {

                    let daysOfRanges = arrRangesAvailables[iara];
                    for (let iiara in daysOfRanges) {

                        let currentSlot = daysOfRanges[iiara];
                        let minutesSlotInit = Utils.getMinutesOfTime(currentSlot[0]);
                        let minutesSlotStart = Utils.getMinutesOfTime(date_start.substring(11, 19));
                        let minutesSlotEnd = Utils.getMinutesOfTime(currentSlot[1]);
                        let minutesSlotfinish = Utils.getMinutesOfTime(date_end.substring(11, 19));

                        if (minutesSlotStart >= minutesSlotInit && minutesSlotfinish <= minutesSlotEnd) {

                            nextResourceAvailable = arrResources[ioah].id;
                            break;
                        }
                    }
                    if (nextResourceAvailable != false) { break; }
                }
                if (nextResourceAvailable != false) { break; }
            }
            return nextResourceAvailable;
        },
        save() {
            if (this.saving()) {
                return;
            }

            if (this.validate()) {
                this.saving(true);
                var customer = Customer.save(this.appointment().form.customer());

                customer.then((_customer) => {
                    if (this.appointment().form.customer().id() == false) {
                        this.appointment().form.customer().id(_customer.users_id);
                    }

                    Appointment.save(this.appointment()).then((appointment) => {
                        config.resolve(appointment);
                        Modal.vm.terminate();
                        m.redraw(true);
                    });
                }, (exception) => {

                    // Something has failed while updating or creating the customer
                    for (var e in exception.errors) {
                        var error = exception.errors[e];
                        this.validators.customer.errors[error.field] = error.message;
                    }

                    this.saving(false);
                    this.step(1);
                    m.redraw(true);
                });
            }
        },
        delete() {
            if (this.appointment().isNew() || this.appointment().seller() == 'miora') {
                return window.alert('No es posible realizar esta acción en este momento...');
            }

            var confirm = window.confirm("¿Estás seguro de querer borrar esta reserva? No podrá revertirse...");

            if (confirm) {
                this.saving(true);

                Appointment.delete(this.appointment()).then(() => {
                    config.resolve();
                    Modal.vm.terminate();
                    m.redraw(true);
                });
            }
        }
    };
}

CarModalproduct.controller = function (props) {

    var appointment = Appointment.prepare(props);
    this.vm = CarModalproduct.vm(props);

    // Once the appointment has been resolved save it inside the vm
    appointment.then((obj) => this.vm.appointment(obj)).then(() => {

        if (!this.vm.appointment().isNew()) {
            this.vm.step(TAB_RESUME);
        }

        // Use first employee by default or selected employee
        this.vm.employees.then((users) => {
            var employees_id = this.vm.appointment().employees_id();

            if (!employees_id && users.length > 0) {
                this.vm.appointment().employees_id(users[0].id()); // while 
                this.vm.getTimetable().then(tt => {
                    this.vm.timetable(tt);
                    // Check Available 
                    let eav = this.vm.findEmployeeAvailable(this.vm.appointment().date_start(), this.vm.appointment().date_end());
                    if (eav == false) {
                        console.log('No se encontró profesional con horario disponible para asignación automatica a reserva desde Miora');
                    } else {
                        this.vm.appointment().employees_id(eav);
                        this.vm.submit(null, true); // Saving automatic employee
                    }
                });
            }

            this.vm.loading.employees(false);
            this.vm.fetchSlots();

            m.redraw(true);
        });

        this.vm.categories.then((categories) => m.redraw(true));
    });
}

CarModalproduct.view = function (ctrl) {

    // Show loading modal until appointment is resolved
    if (ctrl.vm.appointment() === false) {
        return CarModalproduct.loading();
    }

    var employee = ctrl.vm.appointment().employees_id(),
        service = ctrl.vm.appointment().services_id(),
        seller = ctrl.vm.appointment().seller();

    var date = ctrl.vm.appointment().starts().format('YYYY-MM-DD'),
        time = ctrl.vm.appointment().starts().format('HH:mm'),
        status = ctrl.vm.appointment().status(),
        statuses = Statuses.getNext(status)();

    if (m.route.param("view") != null && m.route.param("view") == 'listDay' && m.route.param("at") != null) {
        date = m.route.param("at");
        let objDate = moment(date);
        ctrl.vm.appointment().starts().set({
            year: objDate.year(),
            month: objDate.month(),
            date: objDate.date()
        });
    }

    var detailsValid = ctrl.vm.areDetailsValid(),
        isNew = ctrl.vm.appointment().isNew(),
        step = ctrl.vm.step();

    var continueButton = <Button fill large loading={ctrl.vm.saving()}>Continuar</Button>;

    if (!isNew) {
        continueButton = (
            <div class="pt-button-group pt-large pt-fill">
                <Button fill loading={ctrl.vm.saving()} type="submit">Guardar cita</Button>
                <button class="pt-button pt-intent-primary pt-icon-trash" onclick={ctrl.vm.delete.bind(ctrl.vm)}></button>
            </div>
        );
    }

    return (
        <div class="mmodal-body appointment-modal">
            <ModalHeader>
                {ctrl.vm.appointment().isNew() ? 'Nueva reserva' : 'Modificar reserva'}
            </ModalHeader>

            <ModalTabs>
                <a onclick={ctrl.vm.step.bind(ctrl, TAB_DETAILS)} class={ctrl.vm.step() == TAB_DETAILS ? "active" : ""}><span class={'pt-icon-standard pt-icon-confirm' + (detailsValid && isNew ? '' : ' hidden')}></span> Detalles</a>
                <a onclick={ctrl.vm.methods.goToClient.bind(ctrl.vm)} class={(step == TAB_CLIENT ? 'active ' : '') + (detailsValid ? '' : 'disabled')}>Cliente</a>

                {(() => {
                    if (!isNew) {
                        return (
                            <a onclick={ctrl.vm.step.bind(ctrl, TAB_RESUME)} class={ctrl.vm.step() == TAB_RESUME ? "active" : ""}>Estado y Pago</a>
                        );
                    }
                })()}
            </ModalTabs>

            <div class={"pad2x pad1y" + (ctrl.vm.step() == TAB_DETAILS ? '' : ' hidden')}>
                <form onsubmit={ctrl.vm.submit.bind(ctrl.vm)}>
                    <label class="pt-label">
                        Fecha y hora de la cita

                        <div class="row">
                            <div class="col-md-8">
                                <div class="pt-input-group contain">
                                    <span class="pt-icon pt-icon-calendar"></span>
                                    <input
                                        class="pt-input"
                                        type="date"
                                        name="date"
                                        placeholder="DD/MM/YYYY"
                                        value={date}
                                        onchange={m.withAttr('value', (value) => ctrl.vm.onDateChange(value))}
                                        required
                                        />
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="pt-select">
                                    <select name="time" onchange={m.withAttr('value', (value) => ctrl.vm.onTimeChange(value))} required>
                                        {ctrl.vm.slots().map((s) => {
                                            return (
                                                <option value={s.time()} selected={time == s.time()}>{s.label()}</option>
                                            )
                                        })}
                                        {(() => {
                                            if (!ctrl.vm.slots().length) {
                                                return <option value="">No disponible</option>;
                                            }
                                        })()}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </label>

                    <label class="pt-label">
                        Servicio
                        <div class="pt-select">
                            <select name="service" onchange={m.withAttr('value', (value) => ctrl.vm.onChangeService(value))} required>
                                {(() => {
                                    if (isNew) {
                                        return <option value="">Selecciona un servicio...</option>;
                                    }
                                })()}
                                {ctrl.vm.categories().map((category) => {
                                    return (
                                        <optgroup label={category.label()}>
                                            {category.children().map((s) => {
                                                let contText;
                                                if (s.label().length > 59) { contText = <span>...</span> }
                                                return (
                                                    <option value={s.id()} selected={s.id() === service}>{s.label().substring(0, 60)}{contText}</option>
                                                );
                                            })}
                                        </optgroup>
                                    );
                                })}
                            </select>
                        </div>
                    </label>

                    <label class="pt-label">
                        Profesional
                        <div class="pt-select">
                            <select name="employee" onchange={m.withAttr('value', value => ctrl.vm.onChangeEmployee(value))} required>
                                {ctrl.vm.employees().map((e) => {
                                    return (
                                        <option value={e.id()} selected={employee == e.id()}>{e.label()}</option>
                                    );
                                })}
                            </select>
                        </div>
                    </label>

                    <label class="pt-label">
                        Notas internas
                        <TextArea placeholder="Ej. esta esta la segunda sesión de..." onchange={m.withAttr('value', ctrl.vm.appointment().form.comments)}>{ctrl.vm.appointment().form.comments()}</TextArea>
                    </label>

                    <label class="pt-label">
                        Comentarios para el cliente
                        <TextArea
                            placeholder="Se enviarán en el correo de confirmación al cliente."
                            disabled={ctrl.vm.appointment().isNew() == false}
                            onchange={m.withAttr('value', ctrl.vm.appointment().form.customer_notes)}>{ctrl.vm.appointment().form.customer_notes()}</TextArea>
                    </label>

                    {continueButton}
                </form>
            </div>

            <div class={"pad2x pad1y" + (ctrl.vm.step() == TAB_CLIENT ? '' : ' hidden')}>
                <form onsubmit={ctrl.vm.submit.bind(ctrl.vm)}>
                    {(() => {
                        if (ctrl.vm.appointment().form.customer() == false) {
                            return (
                                <div>
                                    <InputAutoComplete bind={ctrl.vm.appointment().form.customer.bind(ctrl.vm)} source={Customer.list} placeholder="Buscar cliente..." />
                                    <hr />
                                    <Button fill large onclick={ctrl.vm.appointment().form.customer.bind(ctrl.vm, new Customer())}>Nuevo cliente</Button>
                                </div>
                            );
                        } else {
                            var usr = ctrl.vm.appointment().form.customer();

                            return (
                                <div>
                                    <CustomerForm data={usr} validator={ctrl.vm.validators.customer} />
                                    <a style="margin-bottom: 15px;cursor:pointer;display: block;" onclick={ctrl.vm.appointment().form.customer.bind(ctrl.vm, false)}>ó seleccionar otro cliente</a>
                                    <hr />
                                    {continueButton}
                                </div>
                            );
                        }
                    })()}
                </form>
            </div>

            <div class={"pad2x pad1y" + (ctrl.vm.step() == TAB_RESUME ? '' : ' hidden')}>
                <form onsubmit={ctrl.vm.submit.bind(ctrl.vm)}>
                    <div class="row labeled">
                        <div class="col-md-5"><label class="pt-label">Estado</label></div>
                        <div class="col-md-7">
                            <div class="pt-select pt-fill">
                                <select name="status" onchange={m.withAttr('value', value => ctrl.vm.onChangeStatus(value))} required>
                                    {statuses.map(s => {
                                        return (
                                            <option key={s.id()} value={s.id()} selected={status.id() == s.id()}>{s.label()}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>

                    {(() => {
                        if (status.id() == 'canceled') {
                            return (
                                <div class="row">
                                    <div class="col-md-5">
                                        <label class="pt-label">Motivo de cancelacion</label>
                                    </div>
                                    <div class="col-md-7">
                                        <div class="pt-select pt-fill">
                                            <select name="cancelReason" onchange={m.withAttr('value', value => ctrl.vm.appointment().form.cancelReason(value))} required>
                                                <option value="">Selecciona un motivo de cancelación</option>
                                                {CancelReasons().map(r => {
                                                    return (
                                                        <option value={r.id()} selected={r.id() == ctrl.vm.appointment().form.cancelReason()}>{r.label()}</option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                    <div class="row labeled">
                        <div class="col-md-5"><label class="pt-label">Agendado por</label></div>
                        <div class="col-md-7">
                            <span class={'tag' + (seller == 'miora' ? '' : ' hidden')}>Miora</span>
                            <span class={'tag' + (seller != 'miora' ? '' : ' hidden')}>Salón</span>
                        </div>
                    </div>

                    <div class="row labeled">
                        <div class="col-md-5"><label class="pt-label">Método de pago</label></div>
                        <div class="col-md-7">
                            {(() => {
                                if (ctrl.vm.appointment().gateway_provider() == 'venue' && (ctrl.vm.appointment().order() == false || parseFloat(ctrl.vm.appointment().order().order.total) > 0)) {
                                    // We're assuming that there are only offline payments
                                    // when the appointment was created by the venue
                                    // TODO: review more options
                                    return <span class="tag">En el establecimiento</span>;
                                } else {
                                    return <span class="tag">Miora</span>;
                                }
                            })()}
                        </div>
                    </div>

                    {(() => {
                        if (ctrl.vm.appointment().order() != false && ctrl.vm.appointment().order().order.comments != null && ctrl.vm.appointment().order().order.comments.length > 0) {
                            return (
                                <div class="row labeled">
                                    <div class="col-md-5"><label class="pt-label">Comentarios</label></div>
                                    <div class="col-md-7">
                                        <TextArea disabled={true}>
                                            {ctrl.vm.appointment().order().order.comments}
                                        </TextArea>
                                    </div>
                                </div>
                            );
                        }
                    })()}

                    <div class="row labeled">
                        <div class="col-md-5"><label class="pt-label">Monto</label></div>
                        <div class="col-md-7">
                            <span class="tag">$ {ctrl.vm.appointment().price()}</span>
                        </div>
                    </div>

                    <hr />
                    {continueButton}
                </form>
            </div>
        </div>
    );
}

CarModalproduct.loading = function () {
    return (
        <div class="mmodal-body appointment-modal">
            <ModalHeader>Detalles de la reserva</ModalHeader>

            <ModalTabs>
                <a>Detalles</a>
                <a>Cliente</a>
            </ModalTabs>

            <div class="pad2x pad2y loading">
                <Spinner />
            </div>
        </div>
    );
}

export default CarModalproduct;
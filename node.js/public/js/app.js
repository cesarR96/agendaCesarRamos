'use strict';

class EventManager {
    constructor() {
        this.urlBase = "/events";
        this.obtenerDataInicial();
        this.inicializarFormulario();
        this.guardarEvento();
    }

    

    eliminarEvento(evento) {
        let eventId = evento._id;
        $.post('/events/delete/' + eventId, { id: eventId }, (response) => {
            alert(parseInt(response.n) > 0 ? "Evento borrado...": "Error al grabar");
        });
    }

    guardarEvento() {
        $('.addButton').on('click', (ev) => {
            ev.preventDefault();
            let start = $('#start_date').val(),
                title = $('#titulo').val(),
                end = '',
                start_hour = '',
                end_hour = '';

            if (!$('#allDay').is(':checked')) {
                end = $('#end_date').val();
                start_hour = $('#start_hour').val();
                end_hour = $('#end_hour').val();
                if (start_hour !== "") 
                    start = start + 'T' + start_hour;
                if (end_hour !== "")
                    end = end + 'T' + end_hour  ;
            }
            let url = this.urlBase + "/new";
            if (title != "" && start != "") {
                let ev = {
                    title: title,
                    start: start,
                    end: end
                };
                $.post(url, ev, (response) => {
                    this.inicializarFormulario();
                    ev._id = response.id;
                    $('.calendario').fullCalendar('renderEvent', ev);
                    alert(parseInt(response.total) > 0 ? "Registro grabado correctamente...": "Error al grabar");
                });
            } else {
                alert("Complete los campos obligatorios para el evento");
            }
        });
    }

    obtenerDataInicial() {
        let url = this.urlBase + "/all";
        $.get(url, (response) => {
            if (typeof(response) == "string")
                window.location.href = '/';
            else
                this.inicializarCalendario(response);
        });
    }

    actualizarEvento(evento) {
        $.post('/events/update/' + evento._id, {ini: evento.start.format(), fin: evento.end.format(), id: evento._id}, (response) => {
            console.log(response);
        });
    }

    inicializarFormulario() {
        $('#start_date, #titulo, #end_date, #start_hour, #end_hour').val('');
        $('#start_date, #end_date').datepicker({
            dateFormat: "yy-mm-dd"
        });
        $('.timepicker').timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: '5',
            maxTime: '23:59:59',
            defaultTime: '',
            startTime: '5:00',
            dynamic: false,
            dropdown: true,
            scrollbar: true
        });
        $('#allDay').on('change', function () {
            if (this.checked) {
                $('.timepicker, #end_date').attr("disabled", "disabled");
            } else {
                $('.timepicker, #end_date').removeAttr("disabled");
            }
        });
    }

    inicializarCalendario(eventos) {
        $('.calendario').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,basicDay'
            },
            defaultDate: '2017-08-01',
            navLinks: true,
            editable: true,
            eventLimit: true,
            droppable: true,
            dragRevertDuration: 0,
            timeFormat: 'H:mm',
            eventDrop: (event) => {
                this.actualizarEvento(event);
            },
            events: eventos,
            eventDragStart: (event, jsEvent) => {
                $('.delete').find('img').attr('src', "img/trash-open.png");
                $('.delete').css('background-color', '#a70f19');
            },
            eventDragStop: (event, jsEvent) => {
                $('.delete').find('img').attr('src', "img/delete.png");
                var trashEl = $('.delete');
                var ofs = trashEl.offset();
                var x1 = ofs.left;
                var x2 = ofs.left + trashEl.outerWidth(true);
                var y1 = ofs.top;
                var y2 = ofs.top + trashEl.outerHeight(true);
                if (jsEvent.pageX >= x1 && jsEvent.pageX <= x2 &&
                    jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
                    this.eliminarEvento(event);
                    $('.calendario').fullCalendar('removeEvents', event._id);
                }
            }
        });
    }
}

const Manager = new EventManager();

//inicializo el calendario y la hora en la vista 
$(function(){
  initForm();
  obtenerDataInicial();
});

function initForm(){
  $('#start_date, #titulo, #end_date').val('');
  $('#start_date, #end_date').datepicker({
    dateFormat: "yy-mm-dd"
  });
  $('.timepicker').timepicker({
    timeFormat: 'HH:mm',
    interval: 30,
    minTime: '5',
    maxTime: '23:30',
    defaultTime: '7',
    startTime: '5:00',
    dynamic: false,
    dropdown: true,
    scrollbar: true
  });
  //si esta activado todo el dia
  $('#allDay').on('change', function(){
    if (this.checked) {
      $('.timepicker, #end_date').attr("disabled", "disabled")
    }else {
      $('.timepicker, #end_date').removeAttr("disabled")
    }
  })
}//fin init form

//envio la peticion para mostrar los datos en la vista y cargar el calendario
function obtenerDataInicial() {
  let url = '../server/getEvents.php'
  $.ajax({
    url: url,
    cache: false,
    type: 'GET',
    success: (data) =>{

      if (data != null) {
        
        console.log(data)
        var json 
        console.log("llegaa obtener data inicial")
        //inicio de each
        if (data != "") {
          //realizamos un parse para obtener cada uno de los datos del arreglo
          data = JSON.parse(data)
          //luego recorremos este arreglo con foreach
        data.forEach( function(valor, indice, array) {
          //indice es el numero que se encuentra el arreglo
         if(indice == 0){
        // console.log("En el índice " + indice + " hay este valor: " + valor.IDEVENTO);
           json = '[{"id":"'+valor.IDEVENTO+'","title":"'+valor.TITULO+'","start":'+'"'+valor.FECHAINICIO+'","end":'+'"'+valor.FECHAFIN+'","start_hour":'+'"'+valor.HORAINICIO+'","end_hour":'+'"'+valor.HORAFIN+'"}'
         }else{
           json += ',{"id":"'+valor.IDEVENTO+'","title":"'+valor.TITULO+'","start":'+'"'+valor.FECHAINICIO+'","end":'+'"'+valor.FECHAFIN+'","start_hour":'+'"'+valor.HORAINICIO+'","end_hour":'+'"'+valor.HORAFIN+'"}'
         }
       })//FIN DEL EACH
       }else{
        alert("no tienes ningun evento")
       }
        json += ']'

        json = JSON.parse(json)
       
        poblarCalendario(json);
      }else {
        alert(data)
        window.location.href = 'index.html';
      }
    },
    error: function(){
      alert("error en la comunicación con el servidor");
    }
  })
}

//llenamos el calendario

function poblarCalendario(eventos) {
     $('#calendar').fullCalendar({
        // put your options and callbacks here
        //metodos que trae por defecto y se puede perzonalizar de full calendar
       header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,basicDay'
          },
          defaultDate: '2018-01-01',
          navLinks: true,
          editable: true,
          eventLimit: true,
          droppable: true,
          dragRevertDuration: 0,
          timeFormat: 'H:mm',
          eventDrop: (event) => {
          this.actualizarEvento(event)
            },
            //en esta parte es donde le mandamos el arreglo json al calendario
           events: eventos,
           eventDrop: (event) => {
          this.actualizarEvento(event)
        },
        //cuando se mueva un evento se cambiara la imagen
        eventDragStart: (event,jsEvent) => {
          $('.delete-btn').find('img').attr('src', "img/trash-open.png");
          $('.delete-btn').css('background-color', '#a70f19')
        },
        eventDragStop: (event,jsEvent) =>{
          var trashEl = $('.delete-btn');
          var ofs = trashEl.offset();
          var x1 = ofs.left;
          var x2 = ofs.left + trashEl.outerWidth(true);
          var y1 = ofs.top;
          var y2 = ofs.top + trashEl.outerHeight(true);
          if (jsEvent.pageX >= x1 && jsEvent.pageX<= x2 &&
            jsEvent.pageY >= y1 && jsEvent.pageY <= y2) {
            this.eliminarEvento(event, jsEvent)
          $('.calendario').fullCalendar('removeEvents', event.id);
        }

          }//fin de evento      
        })
  }

//funsion para crear un evento
function anadirEvento(){
      event.preventDefault();
      var form_data = new FormData();
      var vacia = false;
      var dia = 1;
      form_data.append('titulo', $('#titulo').val());
      form_data.append('start_date',$('#start_date').val());
      if (!document.getElementById('allDay').checked){
        form_data.append('allDay', document.getElementById('allDay').checked);
        form_data.append('end_date',$('#end_date').val());
        form_data.append('end_hour',$('#end_hour').val());
        form_data.append('start_hour',$('#start_hour').val());
      } else {
        form_data.append('allDay',dia);
        form_data.append('end_date',vacia);
        form_data.append('end_hour',vacia);
        form_data.append('start_hour',vacia);
      }
      $.ajax({
        url: '../server/new_event.php',
        dataType: "text",
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,
        type: 'post',
        success: function(data){

         
          data = JSON.parse(data)
          if (data.msg=="OK") {
            alert('Se ha añadido el evento exitosamente')
            location.reload();
          }else {
            alert(data.msg)
          }
        },
        error: function(){
          alert("error en la comunicación con el servidor");
        }
      })

    }
//funsion para eliminar simplemente mandando el id al modelo de php
  function eliminarEvento(event, jsEvent){
      var id = event.id;
      $.ajax({
        url: '../server/delete_event.php',
        cache: false,
        data: {id:id},
        type: 'POST',
        success: (data) =>{
          console.log(data);
          data = JSON.parse(data);
          if (data.msg=="OK") {
            alert('Se ha eliminado el evento exitosamente')
            location.reload();
          }else {
            alert(data.msg)
          }
        },
        error: function(){
          alert("error en la comunicación con el servidor");
        }
      })
      //luego que se haya eliminado las imagenes vuelven a su lugar
      $('.delete-btn').find('img').attr('src', "img/trash.png");
      $('.delete-btn').css('background-color', '#8B0913')
    }
//actualizamos
   function actualizarEvento(evento) {
        var id = evento.id
        var start = moment(evento.start).format('YYYY-MM-DD')
        var end = moment(evento.end).format('YYYY-MM-DD')

        $.ajax({
          url: '../server/update_event.php',
          cache: false,
          data: {id:id, start:start, end:end},
          type: 'post',
          success: (data) =>{
            data = JSON.parse(data);
            console.log(data.ver)
            if (data.msg == "OK") {
              alert('Se ha actualizado el evento exitosamente')
            }else {
              alert(data)
            }
          },
          error: function(){
            alert("error en la comunicación con el servidor");
          }
        })
    }



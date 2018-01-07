//creo la funsion send la cual me envia los datos para verificar el usuario

 function send(){
    event.preventDefault();
    var form_data = new FormData();
    form_data.append('user', $('#user').val());
    form_data.append('password',$('#password').val());

//utilizo ajax y envio los datos a mi modelo en php
    $.ajax({
      url: '../server/check_login.php',
      dataType: "text",
      cache: false,
      processData: false,
      contentType: false,
      data: form_data,
      type: 'POST',
      success: function(data){
//si es correcto me redirige al inicio y si es falso muestra un mensaje
        if (data == "OK") {
          window.location.href = 'main.html';
        }else {
          alert("datos incorrectos");
        }

      }
    })
  }


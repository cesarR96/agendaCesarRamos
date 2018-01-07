<?php
 
  require('conexion.php');
  session_start();
  $com = new ConectorDB;
  $mensaje;
  $condicion = " IDEVENTO = ".$_POST['id'];
  $datos['FECHAINICIO'] = $_POST['start'];
  $datos['FECHAFIN'] = $_POST['end'];

//obtenemos los datos y realizamos la consulta
  

  if(isset($_SESSION['sesion'])){
  	 if ($com->initConexion() == 'ok') {
  	 	# code...

         /* $com->actualizarRegistro('evento',$datos,$condicion);*/
  	    	$mensaje['msg'] = "OK";
        
  	 }else{
  	 	echo  "problemas con la conexion a la base";
  	 }
     
  }else{
  	echo "erro de usuario ud no esta logueado";
  }

   echo json_encode($mensaje);

  

 ?>

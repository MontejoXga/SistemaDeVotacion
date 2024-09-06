$(document).ready(function(){
    let departamento = $('#departamento')
    let provincia = $('#provincia')
    let distrito = $('#distrito')

    let nombre =$('#nombre')
    let alias = $('#alias')
    let dni = $('#dni')
    let candidato = $('#candidato')
    let email = $('#email')

    let selectDepartamento = $('#departamento');
    let selectProvincia = $('#provincia');
    let selectDistrito = $('#distrito');

///////////////////////////////////////////////////////////////////////////////////
/////////////////////BUSQUEDA DE CANDIDATOS//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
    function obtenerCandidato(){
        $.ajax({
            url: 'controlador/VotoController.php',
            type: 'POST',
            data:{'obtenerCandidato':'obtenerCandidato'},
            success: function(response){
                let candidatos = JSON.parse(response);
                let template = `<option value="0" selected disabled>-- Seleccione --</option>`;

                $.each(candidatos, function(index, candidatos) {
                    template += `<option value="${candidatos.idCandidato}">${candidatos.nomCandidato} ${candidatos.apeCandidato} || ${candidatos.nomPartido}</option>`
                });

                candidato.html(template)

            }
        })
    }
    obtenerCandidato();
    
///////////////////////////////////////////////////////////////////////////////////
/////////////////////BUSQUEDA DE DEPARTAMENTO//////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


    function obtenerDepartamentos(){
        $.ajax({
            url: 'controlador/VotoController.php',
            type: 'GET',
            success: function(response){
                const departamentos = JSON.parse(response);
                let template = '<option value="0" selected disabled>-- Seleccione --</option>';

                $.each(departamentos, function(index, departamentos) {
                    template += `<option value="${departamentos.idDepartamento}">${departamentos.nomDepartamento}</option>`
                });

                departamento.html(template)
            },
            error: function(jqXHR, textStatus, errorThrown){
                console.log('Error: '+ textStatus+'||'+errorThrown)
            }
        })
    }
    obtenerDepartamentos()
    
    
///////////////////////////////////////////////////////////////////////////////////
//////////////////////BUSQUEDA DE PROVINCIA///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    function obtenerProvincia(idDepartamento){
        
        $.ajax({
            url: 'controlador/VotoController.php',
            type: 'POST',
            data: {'idDepartamento':idDepartamento},
            success: function(response){
                const provinciaResults = JSON.parse(response);
                let template = '<option value="0" selected disabled>-- Seleccione --</option>';
                
                $.each(provinciaResults, function(index,provincia){
                    template += `<option value="${provincia.idProvincia}">${provincia.nomProvincia}</option>`;
                })
                provincia.html(template)
            }
        })
    }

    departamento.on('change', function() {
        const idDepartamento = departamento.val()
        obtenerProvincia(idDepartamento)
        distrito.html('')
    })

///////////////////////////////////////////////////////////////////////////////////
///////////////////////BUSQUEDA DE DISTRITO////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    function obtenerDistrito(idProvincia){
        $.ajax({
            url: 'controlador/VotoController.php',
            type: 'POST',
            data: {'idProvincia':idProvincia},
            success: function(response){
                const distritoResults = JSON.parse(response);
                let template = '<option value="0" selected disabled>-- Seleccione --</option>';
                $.each(distritoResults, function(index,distrito){
                    template += `<option value="${distrito.idDistrito}">${distrito.nomDistrito}</option>`;
                })

                distrito.html(template)

            }
        })
    }

    provincia.on('change', function() {
        const idProvincia = provincia.val() 
        obtenerDistrito(idProvincia)
        distrito.html('')
    })

///////////////////////////////////////////////////////////////////////////////////
////////////////////////LIMITAR CHECKBOX///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    const checkboxes = $('.opciones');
    checkboxes.on('change', function() {
        const checkedCheckboxes = $('.opciones:checked');
        
        if (checkedCheckboxes.length >= 2) {
            checkboxes.each(function() {
                if (!$(this).is(':checked')) {
                    $(this).prop('disabled',true)
                }
            });
        } else {
            checkboxes.prop('disabled',false)
        }
    });


///////////////////////////////////////////////////////////////////////////////////
///////////////////////CAMBIO CON CHECKBOX///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    $("input[type='checkbox']").on('change', function() {

        $("input[type='checkbox']").removeAttr('id');
        var checkboxesSeleccionados = $("input[type='checkbox']:checked");

        checkboxesSeleccionados.each(function(index) {
            $(this).attr('id', 'checkbox' + (index + 1));
        });
    });
    

///////////////////////////////////////////////////////////////////////////////////
///////////////////////VERIFICADOR DE DNI///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////


    function validaDni(data){
    const dni = data.replace('-', '').trim().toUpperCase()
    if (!dni || dni.length < 9) return false

        const multiples = [3, 2, 7, 6, 5, 4, 3, 2]
        const dcontrols = {
        numbers: [6, 7, 8, 9, 0, 1, 1, 2, 3, 4, 5],
        letters: ['K', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        }

        const numdni = dni.substring(0, dni.length - 1).split('')
        const dcontrol = dni.substring(dni.length - 1)
        const dsum = numdni.reduce((acc, digit, index) => {
        acc += digit * multiples[index]
        return acc
        }, 0)
        const key = 11 - (dsum % 11)
        const index = (key === 11) ? 0 : key
        if (/^\d+$/.test(dni)) {
        return dcontrols.numbers[index] === parseInt(dcontrol, 10)
        }
        return dcontrols.letters[index] === dcontrol
    }

  
    dni.on('input', function() {
        dni.val(dni.val().replace(/ /g, ''))

    });




///////////////////////////////////////////////////////////////////////////////////
///////////////////////VALIDACION DEL SUBMIT///////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    $( "#formulario" ).on('submit',function( e ) {

        e.preventDefault();
        data = dni.val();
        const regex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{5,}$/;
        const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
       
        if (nombre.val().trim()==='') {
            alert('El campo nombre es obligatorio')
        }else{
            if (alias.val().trim()==='') {
                alert('El campo alias es obligatorio')
            }else if(!regexCorreo.test(email.val())){
                alert('Asegurece de ingresar un email valido')
            }else{
                if (dni.val().trim() ==='') {
                    alert('ingrese su numero de DNI')
                }else if(validaDni(data) == false){
                    alert('El dni ingresado es incorrecto, revise su numero y su codigo verificador que se encuentra despues de los numeros del dni ')
                }
                else{
                    if (email.val().trim() ==='') {
                        alert('El campo email es obligatorio')
                    }else if (!regexCorreo.test(email.val())) {
                        alert('Verifique su correo. Puede que este mal escrito')
                    }else{
                        const checkedCheckboxes = $('.opciones:checked');
                
                        if (checkedCheckboxes.length<1) {
                            alert('marque al menos una opcion de como se entero de nosotros')
                        }else{
                            if (selectDepartamento.val() === "0" && selectProvincia.val() ==="0" && selectDistrito.val() ==="0") {
                                alert('asegurece de marcar su DEPARTAMENTO, PROVINCIA y DISTRITO')
                            }else{
                                if (candidato.val() === "0") {
                                    alert('asegurece de marcar su candidato')
                                }else{
                                    var datosCheckboxes = {};
                                    checkedCheckboxes.each(function() {
                                        datosCheckboxes[$(this).attr("id")] = $(this).val();
                                    });
                        
                                    var check = $.param(datosCheckboxes);
                                    var datos = $("#formulario").serialize();
                                    var datosCombinados = datos + '&' + check;
    
                                    $.ajax({
                                        url: 'controlador/VotoController.php',
                                        type: 'POST',
                                        data: {'datosCombinados':datosCombinados},
                                        success: function(response){
                                            var responseData = JSON.parse(response);
                                            console.log(responseData)
                                            if (responseData.status == 1) {
                                                alert(responseData.message);
                                                $('#formulario')[0].reset();
                                                $('.opciones:disabled').prop('disabled', false);
                                            }else{
                                                alert(responseData.message)
                                            }
                            
                                        }
                                    })
                                }
                                
                            }
                            
                        }      
                    }

                }

            }
        }
    
    });
})
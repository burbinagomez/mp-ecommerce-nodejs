window.onload = function() {
    pagar()
};

function pagar() {
    const public_api = $("#public_api").val()
    const mp = new MercadoPago(public_api, {
        locale: 'es-CO'
    });
    let items = [{
        id: 1234,
        picture_url: window.location.hostname + $("#img").val(),
        description: "Dispositivo móvil de Tienda e-commerce",
        title: $("#title").val(),
        unit_price: $("#price").val(),
        quantity: $("#unit").val(),
    }]
    $.ajax({
        url: "/paid",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(items),
        success: function(respuesta) {
            mp.checkout({
                preference: {
                    id: respuesta.id
                },
                render: {
                    container: '#pagar', // Indica dónde se mostrará el botón de pago
                    label: 'Pagar', // Cambia el texto del botón de pago (opcional)
                }
            });
        },
        error: function() {
            console.log("No se ha podido obtener la información");
        }
    });

}
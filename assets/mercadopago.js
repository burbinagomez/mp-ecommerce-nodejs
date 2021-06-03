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
        picture_url: $("#img").val().replace('.', ''),
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
            var script = document.createElement("script");
            script.src = "https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js";
            script.type = "text/javascript";
            script.dataset.preferenceId = respuesta.id;
            document.getElementById("prueba").innerHTML = ''
            document.querySelector("#prueba").appendChild(script);
            // mp.checkout({
            // preference: {
            // id: respuesta.id
            // },
            // render: {
            // container: '#pagar', 
            // label: 'Pagar', 
            // }
            // });
        },
        error: function() {
            console.log("No se ha podido obtener la información");
        }
    });

}
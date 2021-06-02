window.onload = function() {
    const mp = new MercadoPago('APP_USR-a98b17ae-47a6-4a35-b92d-01919002b97e', {
        locale: 'es-CO'
    });
    pagar(mp)
};
var payer = {
    name: "Lalo",
    surname: "Landa",
    email: "test_user_83958037@testuser.com",
    phone: {
        area_code: "52",
        number: "5549737300"
    },
    address: {
        street_name: "Insurgentes Sur",
        street_number: "4602",
        zip_code: "03940"
    }
}


function pagar(mp) {
    let producto = {
        items: [{
            id: $("#id").val(),
            picture_url: window.location.hostname + $("#img").val(),
            description: "Dispositivo móvil de Tienda e-commerce",
            title: $("#title").val(),
            unit_price: $("#price").val(),
            quantity: $("#unit").val(),
        }],
        payer: payer,
        back_urls: {
            success: window.location.hostname + "/success",
            failure: window.location.hostname + "/fail",
            pending: window.location.hostname + "/pending"
        },
        auto_return: "approved",
        payment_methods: {
            excluded_payment_methods: [{
                id: "amex"
            }],
            excluded_payment_types: [{
                id: "atm"
            }],
            installments: 6,
        },
        external_reference: "burbinagomez@gmail.com",
        notification_url: window.location.hostname + "/notification",
    };
    $.ajax({
        url: "/paid",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(producto),
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
odoo.define('ALTANMYA_Low_Stock_POS_Alert.Low_Stock_POS_Alert', function (require) {
    "use strict";

    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');
    const PaymentScreen = require('point_of_sale.PaymentScreen');
    const Registries = require('point_of_sale.Registries');
    const { Gui } = require('point_of_sale.Gui');

    const PosLowStockAlertPaymentScreen = PaymentScreen => class extends PaymentScreen {
        //@override
        async validateOrder(isForceValidate) {
            var order_lines_length = this.env.pos.get_order().get_orderlines().length
            var check_out_of_stock = false
            if(!this.env.pos.config.allow_order_when_product_out_of_stock)
            {
                for(var i = 0; i < order_lines_length; i++)
                {
                    var product_id = this.env.pos.get_order().get_orderlines()[i].get_product().id
                    var product_name = this.env.pos.get_order().get_orderlines()[i].get_product().display_name
                    var product_quantity = this.env.pos.get_order().get_orderlines()[i].get_quantity()
                    const res = await rpc.query({
                                model: 'stock.quant',
                                method: 'search_read',
                                fields: ['quantity'],
                                domain: [['product_id', '=', product_id], ['inventory_date', '!=', null]]
                                })
                    if(res.length > 0)
                    {
                        if(product_quantity > res[0].quantity || res[0].quantity < 0)
                        {
                            check_out_of_stock = true
                            Gui.showPopup('ErrorPopup',
                            {
                            title: 'Cannot order a product more than its availability',
                            body: "Product '" + product_name + "' is out of stock.",
                            });
                        }
                    }
                    else
                    {
                        check_out_of_stock = true
                        Gui.showPopup('ErrorPopup',
                        {
                        title: 'Cannot order a product more than its availability',
                        body: "Product '" + product_name + "' is out of stock.",
                        });
                    }
                }
            }
            if(check_out_of_stock == false)
            {
                await super.validateOrder(...arguments);
            }
        }
    };

    Registries.Component.extend(PaymentScreen, PosLowStockAlertPaymentScreen);

    return PaymentScreen;
});
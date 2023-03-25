# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Batec Print Report',
    'version': '5.0',
    'category': 'Inventory/Purchase',
    'depends': ['mrp'],
    'data': [
        'views/mrp_production_view.xml',
        'views/product_product_view.xml',
        'report/report_info.xml',
        'report/mrp_production_report_template.xml',
    ],
    'license': 'LGPL-3',
    'installable': True,
    'auto_install': True,
    'application': False,
}

from odoo import api, fields, models


class MrpProductionReport(models.Model):
    _inherit = 'product.product'
    sheet = fields.Char(string="Sheet_Pallet")

from odoo import api, fields, models


class MrpProductionReport(models.Model):
    _inherit = 'mrp.production'

    print_barcode = fields.Char(string="Barcode", compute="_compute_print_barcode")
    inspector = fields.Many2one('res.users', compute="_compute_inspector")
    note = fields.Html(string="Note", compute="_compute_note")
    sheet_pallet = fields.Char(string="Sheet", compute="_compute_sheet_pallet")

    @api.depends('product_id')
    def _compute_print_barcode(self):
        for record in self:
            record.print_barcode = record.product_id.barcode

    @api.depends('lot_producing_id')
    def _compute_note(self):
        for record in self:
            record.note = record.lot_producing_id.note

    @api.depends('product_id')
    def _compute_inspector(self):
        for record in self:
            record.inspector = record.env['quality.check'].search([('product_id', '=', record.product_id.id)]).write_uid

    @api.depends('product_id')
    def _compute_sheet_pallet(self):
        for record in self:
            record.sheet_pallet = record.product_id.sheet


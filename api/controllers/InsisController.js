/**
 * InsisController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
let moment = require('moment');

module.exports = {
    addNew: async (req, res) => {
        /**
         * menambahkan nilai baru untuk matakuliah:
         * Integrasi Sistem
         */
        await Insis.create(req.body).fetch().exec((err, insis) => {
            /**
             * jika post gagal, tampilkan error response
             * yang dinamis
             */
            if (err) {
                return res.status(500).json({
                    status: err.status,
                    message: err
                });
            } else {
                //konversi format yang readable untuk createdAt dan updatedAt
                let dateFormat = sails.config.dateFormat;
                insis.createdAt = moment(insis.createdAt).format(dateFormat);
                insis.updatedAt = moment(insis.updatedAt).format(dateFormat);

                /**
                 * post berhasil!
                 */
                return res.status(200).json({
                    status: 200,
                    value: insis,
                });
            }
        });
    },

    /**
     * Get user by uuid
     * @Status {pass}
     */
    getByUuid: async (req, res) => {
        let uuid = req.param(parameter.uuid);
        await Insis.findOne({uuid: uuid}, (err, insis) => {
            return res.status(200).json({
                status: 200,
                value: insis
            });
        })
    }

};


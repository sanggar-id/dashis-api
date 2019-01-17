/**
 * StudentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

let moment = require('moment');

let parameter = {
	uuid		: 'uuid',
	email		: 'email',
	password	: 'password'
};

module.exports = {
	login: (req, res) => {
		let email 	 = req.param(parameter.email);
		let password = req.param(parameter.password);
		
		//untuk login, email dan password harus di isi
		if (!email || !password) {
			/**
			 * jika kosong, tampilkan respon berikut dengan kode 401
			 * kode 401 merepresentasikan `not found`
			 */
			return res.status(401).json({
				status: 401,
				message: sails.config.helper.errMessage[401]
			});
		}

		Student.findOne({email: email}, (err, student) => {
			/**
			 * validasi dibawah untuk mengecek, apakah user dengan `email`
			 * yang dimasukkan terdaftar didalam database atau tidak
			 */
			if (!student) res.status(401).json({
				status: 401,
				message: sails.config.helper.errMessage[401]
			});

			/**
			 * selanjutkan, melakukan validasi untuk melakukan komparasi
			 * dari password yang dimasukan dengan password yang sudah terdaftar
			 * didalam database
			 */
			Student.comparePassword(password, student, (err, valid) => {
				/**
				 * lakukan validasi jika password yang dimasukkan-
				 * tidak sama yang ada di database.
				 * kode 403 merepresentasikan `forbidden`
				 */
				if (err) return res.status(403).json({
					status: 403,
					message: sails.config.helper.errMessage[403]
				});

				/**
				 * lakukan validasi terakhir untuk memastikan autentikasi
				 * tidak dapat di bypass.
				 */
				if (!valid) {
					return res.status(401).json({
						status: 401,
						message: sails.config.helper.errMessage[401]
					});
				} else {
					/**
					 * jika login berhasil, tampilkan response OK dengan kode 200.
					 */
					return res.status(200).json({
						status: 200,
						student: student,
						token: jwToken.issue({id: student.id})
					});
				}
			});
		});
	},
	register: async (req, res) => {
		/**
		 * student registration berdasarkan-
		 * body dan table yang ada di model
		 */
		await Student.create(req.body).fetch().exec((err, student) => {
			/**
			 * jika registrasi gagal, tampilkan error response
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
				student.createdAt = moment(student.createdAt).format(dateFormat);
				student.updatedAt = moment(student.updatedAt).format(dateFormat);

				/**
				 * registrasi berhasil!
				 */
				return res.status(200).json({
					status: 200,
					student: student,
					token: jwToken.issue({id: student.id})
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
		await Student.findOne({uuid: uuid}, (err, student) => {
			return res.status(200).json({
				status: 200,
				student: {
					createdAt: student.createdAt,
					updatedAt: student.updatedAt,
					name: student.name
				}
			});
		})
	}
};


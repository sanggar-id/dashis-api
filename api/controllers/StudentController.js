/**
 * StudentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	login: (req, res) => {
		let email = req.param('email');
		let password = req.param('password');
		
		//untuk login, email dan password harus di isi
		if (!email || !password) {
			/**
			 * jika kosong, tampilkan respon berikut dengan kode 401
			 * kode 401 merepresentasikan `not found`
			 */
			return res.status(401).json({
				code: 401,
				message: 'email or password required'
			});
		}

		Student.findOne({email: email}, (err, student) => {
			/**
			 * validasi dibawah untuk mengecek, apakah user dengan `email`
			 * yang dimasukkan terdaftar didalam database atau tidak
			 */
			if (!student) res.status(401).json({
				code: 401,
				message: 'email or password required'
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
					code: 403,
					message: 'email or password required'
				});

				/**
				 * lakukan validasi terakhir untuk memastikan autentikasi
				 * tidak dapat di bypass.
				 */
				if (!valid) {
					return res.status(401).json({
						code: 401,
						message: 'email or password required'
					});
				} else {
					/**
					 * jika login berhasil, tampilkan response OK dengan kode 200.
					 */
					return res.status(200).json({
						code: 200,
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
					code: err.status,
					message: err
				});
			} else {
				/**
				 * registrasi berhasil!
				 */
				res.status(200).json({
					code: 200,
					student: student,
					token: jwToken.issue({id: student.id})
				});
			}
		});
	}
};


/**
 * StudentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
	login = (req, res) => {
		let email = req.param('email');
		let password = req.param('password');
		
		//untuk login, email dan password harus di isi
		if (!email || !password) {
			/**
			 * jika kosong, tampilkan respon berikut dengan kode 401
			 * kode 401 merepresentasikan `not found`
			 */
			return res.json(401, {
				code: 401,
				message: 'email or password required'
			});
		}

		Student.findOne({email: email}, (err, student) => {
			/**
			 * validasi dibawah untuk mengecek, apakah user dengan `email`
			 * yang dimasukkan terdaftar didalam database atau tidak
			 */
			if (!student) return res.json(401, {
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
				if (err) return res.json(403, {
					code: 403,
					message: 'email or password required'
				});

				/**
				 * lakukan validasi terakhir untuk memastikan autentikasi
				 * tidak dapat di bypass.
				 */
				if (!valid) {
					return res.json(401, {
						code: 401,
						message: 'email or password required'
					});
				} else {
					/**
					 * jika login berhasil, tampilkan response OK dengan kode 200.
					 */
					return res.json(200, {
						code: 200,
						mahasiswa: student,
						token: jwToken.issue({id: student.id})
					});
				}
			});
		});
	},
	register = (req, res) => {
		/**
		 * student registration berdasarkan-
		 * body dan table yang ada di model
		 */
		Student.create(req.body).exec((err, student) => {
			/**
			 * jika registrasi gagal, tampilkan error response
			 * yang dinamis
			 */
			if (err) return res.json(err.status, {
				code: err.status,
				message: err
			});

			/**
			 * registrasi berhasil!
			 */
			if (student) return res.json(200, {
				code: 200,
				mahasiswa: student,
				token: jwToken.issue({id: student.id})
			});
		});
	}
};


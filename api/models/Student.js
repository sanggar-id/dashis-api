/**
 * Student.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

module.exports = {

  primaryKey: 'id',

  attributes: {

    id          : { type: 'number', autoIncrement: true },
    name        : { type: 'string' },
    email       : { type: 'string', unique: true },
    password    : { type: 'string' },
    createdAt   : { type: 'number', autoCreatedAt: true },
    updatedAt   : { type: 'number', autoUpdatedAt: true },

  },
  
    //ketika kueri ke student, jangan tampilkan data yang sensitif
    customToJSON: function () {
        return _.omit(this, ['id', 'name', 'email', 'createdAt'])
    },

    //encrypt password menggunakan bcrypt
    beforeCreate: function (values, next) {
        bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(values.password, salt, function (err, hash) {
            if (err) return next(err);
            values.password = hash;
            next();
        })
        })
    },

    //keperluan untuk login
    comparePassword: function (password, user, cb) {
        bcrypt.compare(password, user.password.replace('$2y$', '$2a$'), function (err, match) {
        if (err) cb(err);
        if (match) {
            cb(null, true);
        } else {
            cb(err);
        }
        })
    }
};

/**
 * Student.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let bcrypt = require('bcrypt');
let uuid = require('node-uuid');

module.exports = {

  primaryKey: 'id',

  attributes: {

    id          : { type: 'number', autoIncrement: true },
    uuid        : { type: 'string' },
    name        : { type: 'string' },
    email       : { type: 'string', unique: true },
    password    : { type: 'string' },
    createdAt   : { type: 'string', autoCreatedAt: true, },
    updatedAt   : { type: 'string', autoUpdatedAt: true, },

  },
  
    //ketika kueri ke student, jangan tampilkan data yang sensitif
    customToJSON: function () {
        return _.omit(this, ['password'])
    },

    //encrypt password menggunakan bcrypt
    beforeCreate: function (values, next) {
        values.uuid = uuid.v4();
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

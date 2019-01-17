/**
 * Insis.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let uuid = require('node-uuid');

module.exports = {

  primaryKey: 'id',

  attributes: {

    id          : { type: 'number', autoIncrement: true },
    uuid        : { type: 'string' },
    title       : { type: 'string' },
    value       : { type: 'number' },
    student_id  : { model: 'Student' },
    createdAt   : { type: 'string', autoCreatedAt: true, },
    updatedAt   : { type: 'string', autoUpdatedAt: true, },

  },

  //encrypt password menggunakan bcrypt
  beforeCreate: function (values, _) {
    values.uuid = uuid.v4();
  },

};


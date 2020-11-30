'use strict';
const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    //localhostのDB指定
  'postgres://postgres:postgres@localhost/kyoblog'
);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};
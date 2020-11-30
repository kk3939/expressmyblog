'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Pages = loader.database.define(
  'pages',
  {
    // 11/25追記
    // DBをやり直す際、dropしてもう一回create
    pagesId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false
    },
    title: {
      type: Sequelize.STRING,
      allowNull: true
    },
    contents: {
      type: Sequelize.STRING,
      allowNull: true
    },
    createdBy: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Pages;
'use strict';
const express = require('express');
const router = express.Router();
const Pages = require('../models/pages');

router.get('/', (req, res, next) => {
  if (req.user) {
    Pages.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['updatedAt', 'DESC']]
    }).then(pages => {
      // console.log(pages);
      res.render('index', {
        title: 'KyoBlog',
        user: req.user,
        pages: pages
      });
    });
    // pagesに詰め込まれてる
  } else {
    // 無かった時の処理
    res.render('index', { user: req.user });
  }
});

module.exports = router;

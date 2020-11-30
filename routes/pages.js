const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');

const uuid = require('uuid');
const Pages = require('../models/pages');
const User = require('../models/user');

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  const pagesId = uuid.v4();
  const updatedAt = new Date();
  // DB処理
  // DB設計変える際は、modelごと変える必要あり
  // 加えて、drop&create
  Pages.create({
    pagesId: pagesId,
    title: req.body.title.slice(0, 50) || '（名称未設定）',//50文字の制限もしくは空の場合名称未設定
    contents: req.body.contents,
    createdBy: req.user.id,
    updatedAt: updatedAt
  }).then(pages => {
    res.redirect('/pages/' + pages.pagesId);
  });
}); 


router.get('/:pagesId', authenticationEnsurer, (req, res, next) => {
  Pages.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    where: {
      pagesId: req.params.pagesId
    },
    order: [['updatedAt', 'DESC']]
  }).then(pages => {
    if (pages) {
      //viewのpagesへ飛ぶ
      res.render('pages', {
        user: req.user,
        pages: pages
      });
    } else {
      const err = new Error('指定された予定は見つかりません');
      err.status = 404;
      next(err);
    }
  });
});

router.get('/:pagesId/edit', authenticationEnsurer, (req, res, next) =>{
  Pages.findOne({
    where: {
      pagesId: req.params.pagesId
    }
  }).then((pages) => {
    // console.log(pages);
    if (isMine(req, pages)) { 
      res.render('edit', {
        user: req.user,
        pages: pages,
      });
    } else {
      const err = new Error('指定された予定がない、または、予定する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});

router.get('/:pagesId/delete', authenticationEnsurer, (req, res, next) =>{
  Pages.findOne({
    where: {
      pagesId: req.params.pagesId
    }
  }).then((pages) => {
    // console.log(pages);
    if (isMine(req, pages)) { 
      res.render('delete', {
        user: req.user,
        pages: pages,
      });
    } else {  
      const err = new Error('指定された予定がない、または、予定する権限がありません');
      err.status = 404;
      next(err);
    }
  });
});

router.post('/delete', authenticationEnsurer, (req, res, next) => {
  Pages.findOne({
    where: {
      pagesId: req.body.pagesId
    }
  }).then((pages) => {
    //削除かます
    pages.destroy();
    res.redirect('/');
  });
}); 

router.post('/edit', authenticationEnsurer, (req, res, next) => {
  Pages.findOne({
    where: {
      pagesId: req.body.pagesId
    }
  }).then((pages) => {
    // pageIdだけそのまま引き継ぐ
    pages.update({
      pagesId: req.body.pagesId,
      title: req.body.title.slice(0, 50) || '（名称未設定）',
      contents: req.body.contents,
      createdBy: req.user.id,
      updatedAt: pages.updatedAt
    })
    //投稿詳細画面
    res.redirect('/pages/' + pages.pagesId);
  });
}); 


//予定がログインユーザーかどうか判定する関数
function isMine(req, pages) {
  return pages && parseInt(pages.createdBy) === parseInt(req.user.id);
}


module.exports = router;
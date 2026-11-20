const express = require('express');
const router = express.Router();
const task = require('../controllers/taskController');
const { protect } = require('../middlewares/auth');

router.use(protect);

router.get('/', task.index);
router.get('/new', task.newForm);
router.post('/', task.create);
router.get('/:id', task.show);
router.get('/:id/edit', task.editForm);
router.put('/:id', task.update);
router.delete('/:id', task.destroy);

module.exports = router;
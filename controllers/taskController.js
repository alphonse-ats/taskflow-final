const Task = require('../models/Task');

// Comparación robusta: normaliza ambos lados a string
const isOwner = (user, task) => {
  if (!task.owner) return false;
  const ownerId = task.owner._id
    ? task.owner._id.toString()
    : task.owner.toString();
  return ownerId === user._id.toString();
};

const canEdit = (user, task) => user.role === 'admin' || isOwner(user, task);

exports.index = async (req, res, next) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { owner: req.user._id };
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const total = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.render('tasks/index', {
      title: 'Mis Tareas',
      tasks,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

exports.show = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('owner', 'name');
    if (!task) {
      return res.status(404).render('error', { error: 'Tarea no encontrada' });
    }
    if (!canEdit(req.user, task)) {
      return res.status(403).render('error', { error: 'No autorizado' });
    }
    res.render('tasks/show', { title: task.title, task });
  } catch (err) {
    next(err);
  }
};

exports.newForm = (req, res) =>
  res.render('tasks/new', { title: 'Nueva Tarea' });

exports.create = async (req, res, next) => {
  try {
    await Task.create({ ...req.body, owner: req.user._id });
    res.redirect('/tasks');
  } catch (err) {
    next(err);
  }
};

exports.editForm = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id); // sin populate
    if (!task) {
      return res.status(404).render('error', { error: 'Tarea no encontrada' });
    }
    if (!canEdit(req.user, task)) {
      return res.status(403).render('error', { error: 'No autorizado' });
    }
    res.render('tasks/edit', { title: 'Editar Tarea', task });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id); // sin populate
    if (!task) {
      return res.status(404).render('error', { error: 'Tarea no encontrada' });
    }
    if (!canEdit(req.user, task)) {
      return res.status(403).render('error', { error: 'No autorizado' });
    }

    const { title, description, status, priority } = req.body;
    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;

    await task.save();
    res.redirect(`/tasks/${task._id}`);
  } catch (err) {
    console.error('Error al actualizar tarea:', err);
    next(err);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).render('error', { error: 'Tarea no encontrada' });
    }
    if (!canEdit(req.user, task)) {
      return res.status(403).render('error', { error: 'No autorizado' });
    }
    await task.deleteOne();
    res.redirect('/tasks');
  } catch (err) {
    next(err);
  }
};
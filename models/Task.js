const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [3, 'Mínimo 3 caracteres'],
      maxlength: [100, 'Máximo 100 caracteres']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Máximo 500 caracteres'],
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'done'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
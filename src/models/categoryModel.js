const mongoose = require("mongoose");
const { type } = require("os");

const categorySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // Refere-se ao modelo de usuário
  },
  name: String,
  description: String,
  category_type: String,
  isActive: Boolean,
  budget: Number,
  color: {
    type: String,
    default: "#000000", // Cor padrão caso o usuário não escolha uma
  },
  icon: {
    type: String,
    default: "fa-tag", // Ícone padrão
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

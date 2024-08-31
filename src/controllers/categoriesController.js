const Category = require("../models/categoryModel");

class categoriesController {
  async getCategories(req, res) {
    const categories = await Category.find({ user_id: req.user_id });

    return res.status(201).json(categories);
  }
  async createCategory(req, res) {
    const { name, description, color, icon, category_type, isActive, budget } =
      req.body;
    const user_id = req.user_id;

    try {
      // Verifica se a categoria já existe para o usuário
      const existingCategory = await Category.findOne({
        user_id,
        name,
      });

      if (existingCategory) {
        return res.status(409).json({ message: "Essa categoria já existe." });
      }

      // Verifica se o nome da categoria foi fornecido
      if (!name) {
        return res
          .status(400)
          .json({ message: "O nome da categoria é obrigatório." });
      }

      // Cria uma nova categoria
      const newCategory = new Category({
        user_id,
        name,
        description,
        category_type,
        isActive,
        budget,
        color: color || "#000000", // Usa a cor fornecida ou a cor padrão
        icon: icon || "fa-tag", // Usa o ícone fornecido ou o ícone padrão
      });

      // Salva a nova categoria no banco de dados
      const savedCategory = await newCategory.save();

      // Retorna a categoria criada
      console.log(savedCategory);
      return res.status(201).json(savedCategory);
    } catch (error) {
      console.error("Erro ao criar a categoria:", error.message);
      return res.status(500).json(error);
    }
  }
}
module.exports = new categoriesController();

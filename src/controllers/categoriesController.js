const Category = require("../models/categoryModel");

class categoriesController {
  async getCategories(request, reply) {
    const categories = await Category.find({ user_id: request.user_id });

    return reply.status(201).json(categories);
  }
  async createCategory(request, reply) {
    const { name, description, color, icon, category_type, isActive, budget } = request.body;
    const user_id = request.user_id;

    try {
      // Verifica se a categoria já existe para o usuário
      const existingCategory = await Category.findOne({
        user_id,
        name,
      });

      if (existingCategory) {
        return reply.status(409).json({ message: "Essa categoria já existe." });
      }

      // Verifica se o nome da categoria foi fornecido
      if (!name) {
        return reply.status(400).json({ message: "O nome da categoria é obrigatório." });
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
      return reply.status(201).json(savedCategory);
    } catch (error) {
      console.error("Erro ao criar a categoria:", error.message);
      return reply.status(500).json(error);
    }
  }

  async deleteCategory(request, reply) {
    //Deletar conta
    const { id } = request.params;

    try {
      const catgory = await Category.findOneAndDelete({
        _id: id,
        user_id: request.user_id,
      });

      if (!catgory) {
        return reply.status(404).json({ message: "Category not found" });
      }
      return reply.status(201).json({ message: "Category successfully deleted" });
    } catch (error) {
      return reply.status(404).json({ message: "Category not found" });
    }
  }
}
module.exports = new categoriesController();

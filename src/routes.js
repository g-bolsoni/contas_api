const jwt = require("jsonwebtoken");

const billsController = require("./controllers/billsController");
const filterController = require("./controllers/filterController");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const categoryControler = require("./controllers/categoriesController");
const { schema } = require("./models/billsModel");
const { file } = require("googleapis/build/src/apis/file");
const { response } = require("express");

async function routes(fastify, options) {
  // Middleware para autenticação
  fastify.decorate("verifyToken", async (request, reply) => {
    const token = request.headers["authorization"];

    if (!token) {
      return reply.status(401).send({ message: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.SECRET);
      request.user_id = decoded.id;
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ message: "Invalid token" });
    }
  });

  // Bills
  fastify.get(
    "/bills",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Bills"],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            sortBy: { type: "string" },
            orderBy: { type: "string" },
          },
          required: ["page", "limit", "sortBy", "orderBy"],
        },
      },
    },
    billsController.index
  );
  fastify.get(
    "/bills/:id",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Bills"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    billsController.findOne
  );
  fastify.post(
    "/bills",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Bills"],
        body: {
          type: "object",
          required: ["description", "value", "category_id", "bill_type", "due_date"],
          properties: {
            description: { type: "string" },
            value: { type: "number" },
            category_id: { type: "string" },
            bill_type: { type: "string" },
            due_date: { type: "string", format: "date" },
          },
        },
      },
    },
    billsController.createBills
  );
  fastify.put(
    "/bills/:id",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Bills"],
        body: {
          type: "object",
          required: ["description", "value", "category_id", "bill_type", "due_date"],
          properties: {
            description: { type: "string" },
            value: { type: "number" },
            category_id: { type: "string" },
            bill_type: { type: "string" },
            due_date: { type: "string", format: "date" },
          },
        },
      },
    },
    billsController.updateBills
  );
  fastify.delete(
    "/bills/:id",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Bills"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    billsController.deleteBills
  );
  fastify.delete(
    "/bills",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Bills"],
        querystring: {
          type: "object",
          properties: {
            ids: { type: "array", items: { type: "string" } },
          },
          required: ["ids"],
        },
      },
    },
    billsController.deleteAllBills
  );
  fastify.post(
    "/updateMonthlyBills",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Bills"],
        body: {
          type: "object",
          required: ["month", "year"],
          properties: {
            month: { type: "number" },
            year: { type: "number" },
          },
        },
      },
    },
    billsController.createMonthlyBills
  );

  // Bills filters
  fastify.post(
    "/filter",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Filters"],
        body: {
          type: "object",
          required: ["startDate", "endDate", "category_id", "bill_type"],
          properties: {
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" },
            category_id: { type: "string" },
            bill_type: { type: "string" },
          },
        },
      },
    },
    billsController.filterBills
  );
  fastify.get(
    "/filter",
    {
      schema: {
        tags: ["Filters"],
        querystring: {
          type: "object",
          properties: {
            startDate: { type: "string", format: "date" },
            endDate: { type: "string", format: "date" },
            category_id: { type: "string" },
            bill_type: { type: "string" },
          },
        },
      },
    },
    filterController.getData
  );

  // Auth
  fastify.post(
    "/auth/register",
    {
      schema: {
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            confirmPassword: { type: "string" },
          },
        },
        response: {
          442: {
            type: "object",
            properties: {
              field: { type: "string" },
              message: { type: "string" },
            },
          },
          201: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    authController.registerUser
  );
  fastify.post(
    "/auth/login",
    {
      schema: {
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        response: {
          422: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              field: { type: "string" },
              message: { type: "string" },
            },
          },
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              Token: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    authController.loginUser
  );
  fastify.post(
    "/resetPassword",
    {
      schema: {
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" },
          },
        },
        response: {
          422: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    authController.resetPassword.bind(authController)
  );
  fastify.post(
    "/resetPasswordConfirm",
    {
      schema: {
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["email", "code", "password"],
          properties: {
            token: { type: "string" },
            password: { type: "string" },
            confirmPassword: { type: "string" },
          },
        },
        response: {
          422: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              field: { type: "string" },
              message: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              field: { type: "string" },
              message: { type: "string" },
            },
          },
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
            },
          },
        },
      },
    },
    authController.resetPasswordConfirm
  );

  // User
  fastify.get(
    "/user",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["User"],
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              email: { type: "string", format: "email" },
            },
          },
        },
      },
    },
    userController.getUser
  );
  fastify.put(
    "/user",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["User"],
        body: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
      },
    },
    userController.updateUserInfo
  );
  fastify.delete(
    "/user",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["User"],
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          401: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    userController.deleteUser
  );

  // Categories
  fastify.get(
    "/category",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Categories"],
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                user_id: { type: "string" },
              },
            },
          },
          401: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          422: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    categoryControler.getCategories
  );
  fastify.post(
    "/category",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Categories"],
        body: {
          type: "object",
          required: ["name", "description", "color", "icon", "category_type", "isActive", "budget"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            color: { type: "string" },
            icon: { type: "string" },
            category_type: { type: "string" },
            isActive: { type: "boolean" },
            budget: { type: "number" },
          },
        },
        response: {
          201: {
            type: "object",
            properties: {
              id: { type: "string" },
              name: { type: "string" },
              description: { type: "string" },
              color: { type: "string" },
              icon: { type: "string" },
              category_type: { type: "string" },
              isActive: { type: "boolean" },
              budget: { type: "number" },
            },
            500: {
              type: "object",
              properties: {
                message: { type: "string" },
              },
            },
          },
        },
      },
    },
    categoryControler.createCategory
  );
  fastify.delete(
    "/category/:id",
    {
      preHandler: fastify.verifyToken,
      schema: {
        tags: ["Categories"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          401: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    categoryControler.deleteCategory
  );
}

module.exports = routes;

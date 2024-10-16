exports.SHide = {
  hide: true,
};

exports.SLogin = {
  schema: {
    description: "Login user with email and password",
    tags: ["Authentication"],
    summary: "User login",
    body: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          description: "The user's email address",
        },
        password: {
          type: "string",
          description: "The user's password",
        },
      },
    },
    response: {
      200: {
        description: "Successful login response",
        type: "object",
        properties: {
          status: { type: "integer", example: 200 },
          message: { type: "string", example: "success login" },
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR..." },
        },
      },
      422: {
        description: "Validation error or wrong credentials",
        type: "object",
        properties: {
          status: { type: "integer", example: 422 },
          message: { type: "string", example: "Email or Password is wrong" },
          errors: {
            type: "object",
            additionalProperties: { type: "string" },
          },
        },
      },
      500: {
        description: "Internal server error",
        type: "object",
        properties: {
          status: { type: "integer", example: 500 },
          message: { type: "string", example: "Internal server error" },
        },
      },
    },
  },
};

exports.SMe = {
  description: "Get logged-in user details",
  tags: ["Authentication"],
  summary: "Get logged-in user details",
  security: [{ BearerAuth: [] }],
  response: {
    200: {
      description: "User details",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};

exports.SGetUsers = {
  description: "Get paginated list of users",
  tags: ["User"],
  summary: "Fetch users with pagination and search",
  security: [{ BearerAuth: [] }],
  querystring: {
    type: "object",
    properties: {
      page: { type: "integer", description: "Page number", default: 1 },
      limit: {
        type: "integer",
        description: "Limit of users per page",
        default: 10,
      },
      search: {
        type: "string",
        description: "Search query for users by name or email",
      },
      sort_by: { type: "string", description: "Sort by", default: "id" },
      order_by: { type: "string", description: "order by", default: "true" },
    },
    required: ["page", "limit"],
  },
  response: {
    200: {
      description: "Successful response",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            rows: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  name: { type: "string" },
                  email: { type: "string" },
                },
              },
            },
            page: { type: "integer" },
            limit: { type: "integer" },
            total_rows: { type: "integer" },
            total_page: { type: "integer" },
          },
        },
      },
    },
    400: {
      description: "Bad request for invalid page or limit values",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};

exports.SGetUserById = {
  description: "Get user details by ID",
  tags: ["User"],
  summary: "Retrieve a user by their ID",
  security: [{ BearerAuth: [] }],
  params: {
    type: "object",
    properties: {
      id: { type: "integer", description: "User ID" },
    },
    required: ["id"],
  },
  response: {
    200: {
      description: "User details retrieved successfully",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              email: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    400: {
      description: "User not found",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};

exports.SCreateUser = {
  description: "Create a new user",
  tags: ["User"],
  summary: "Register a new user in the system",
  security: [{ BearerAuth: [] }],
  body: {
    type: "object",
    properties: {
      name: { type: "string", description: "Name of the user" },
      email: {
        type: "string",
        description: "Email address of the user",
      },
      password: {
        type: "string",
        description: "Password for the user",
      },
    },
    required: ["name", "email", "password"],
  },
  response: {
    201: {
      description: "User created successfully",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    422: {
      description: "Validation error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        errors: {
          type: "object",
          additionalProperties: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};

exports.SUpdateUser = {
  description: "Update an existing user",
  tags: ["User"],
  summary: "Update user information by ID",
  security: [{ BearerAuth: [] }],
  params: {
    type: "object",
    properties: {
      id: { type: "string", description: "ID of the user to update" },
    },
    required: ["id"],
  },
  body: {
    type: "object",
    properties: {
      name: { type: "string", description: "Updated name of the user" },
      email_old: { type: "string", description: "Current email of the user" },
      email: {
        type: "string",
        description: "Updated email address of the user",
      },
      password: {
        type: "string",
        description: "Updated password for the user",
      },
    },
    required: ["name", "email", "email_old", "password"],
  },
  response: {
    200: {
      description: "User updated successfully",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              email: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    400: {
      description: "User not found",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    422: {
      description: "Validation error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        errors: {
          type: "object",
          additionalProperties: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};

exports.SDeleteUser = {
  description: "Delete an existing user",
  tags: ["User"],
  summary: "Delete user by ID",
  security: [{ BearerAuth: [] }],
  params: {
    type: "object",
    properties: {
      id: { type: "string", description: "ID of the user to delete" },
    },
    required: ["id"],
  },
  response: {
    200: {
      description: "User deleted successfully",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    400: {
      description: "User not found",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};

// INPLATFORM
exports.SGetUsersInplatform = {
  description: "Retrieve all users from the inplatform",
  tags: ["Inplatform"],
  summary: "Fetch all users",
  security: [{ BearerAuth: [] }],
  response: {
    200: {
      description:
        "Successful response with a list of users sorted by ID in descending order",
      type: "object",
      properties: {
        status: { type: "integer", example: 200 },
        message: { type: "string", example: "inplatform all users" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "integer" },
              name: { type: "string" },
              email: { type: "string" },
              password: { type: "string" },
              created_at: { type: "string" },
              updated_at: { type: "string" },
            },
          },
        },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};

exports.SGetUserByIdInplatform = {
  description: "Retrieve user details by user ID from the inplatform",
  tags: ["Inplatform"],
  summary: "Fetch user by ID",
  security: [{ BearerAuth: [] }],
  params: {
    type: "object",
    properties: {
      id: {
        type: "integer",
        description: "ID of the user to retrieve",
      },
    },
    required: ["id"],
  },
  response: {
    200: {
      description: "Successful response with the user details",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            created_at: { type: "string" },
            updated_at: { type: "string" },
          },
        },
      },
    },
    400: {
      description: "User not found",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};

exports.SCreateUserInplatform = {
  description: "Create a new user in the inplatform",
  tags: ["Inplatform"],
  summary: "Create user",
  security: [{ BearerAuth: [] }],
  body: {
    type: "object",
    required: ["name", "email", "password"],
    properties: {
      name: {
        type: "string",
        description: "The name of the user",
      },
      email: {
        type: "string",
        description: "The user's email address",
      },
      password: {
        type: "string",
        description: "The user's password",
      },
    },
  },
  response: {
    201: {
      description: "User created successfully",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            created_at: { type: "string" },
            updated_at: { type: "string" },
          },
        },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    422: {
      description: "Validation error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        errors: {
          type: "object",
          additionalProperties: { type: "string" },
        },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};

exports.SUpdateUserInplatform = {
  description: "Update a user in the inplatform",
  tags: ["Inplatform"],
  summary: "Update user",
  security: [{ BearerAuth: [] }],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "integer",
        description: "The ID of the user to update",
      },
    },
  },
  body: {
    type: "object",
    required: ["name", "email_old", "email", "password"],
    properties: {
      name: {
        type: "string",
        description: "The new name of the user",
      },
      email_old: {
        type: "string",
        description: "The old email of the user",
      },
      email: {
        type: "string",
        description: "The new email of the user",
      },
      password: {
        type: "string",
        description: "The new password of the user",
      },
    },
  },
  response: {
    200: {
      description: "User updated successfully",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: {
          type: "string",
        },
        data: {
          type: "object",
          properties: {
            id: { type: "integer" },
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            updated_at: { type: "string" },
          },
        },
      },
    },
    400: {
      description: "User not found",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    422: {
      description: "Validation error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
        errors: {
          type: "object",
          additionalProperties: { type: "string" },
        },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};

exports.SDeleteUserInplatform = {
  description: "Delete a user by ID from the inplatform",
  tags: ["Inplatform"],
  summary: "Delete user",
  security: [{ BearerAuth: [] }],
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: {
        type: "integer",
        description: "The ID of the user to delete",
      },
    },
  },
  response: {
    200: {
      description: "User deleted successfully",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    400: {
      description: "User not found",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    401: {
      description: "Unauthenticated request",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
    500: {
      description: "Internal server error",
      type: "object",
      properties: {
        status: { type: "integer" },
        message: { type: "string" },
      },
    },
  },
};


exports.SRoot = {
    schema: {
        hide: true
    }
}

exports.SLogin = {
    schema: {
        description: 'Login user with email and password',
        tags: ['Authentication'],
        summary: 'User login',
        body: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email: { 
                    type: 'string',
                    description: 'The user\'s email address',
                },
                password: { 
                    type: 'string',
                    description: 'The user\'s password',
                }
            }
        },
        response: {
            200: {
                description: 'Successful login response',
                type: 'object',
                properties: {
                    status: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'success login' },
                    token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR...' }
                }
            },
            422: {
                description: 'Validation error or wrong credentials',
                type: 'object',
                properties: {
                    status: { type: 'integer', example: 422 },
                    message: { type: 'string', example: 'Email or Password is wrong' },
                    errors: {
                        type: 'object',
                        additionalProperties: { type: 'string' }
                    }
                }
            },
            500: {
                description: 'Internal server error',
                type: 'object',
                properties: {
                    status: { type: 'integer', example: 500 },
                    message: { type: 'string', example: 'Internal server error' }
                }
            }
        }
    }
}

exports.SMe = {
    schema: {
        description: 'Retrieve logged-in user details',
        tags: ['Authentication'],
        summary: 'Get user details',
        security: [
            {
                Bearer: []
            }
        ],
        response: {
            200: {
                description: 'Successfully retrieved user details',
                type: 'object',
                properties: {
                    status: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'user logged in detail' },
                    data: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                id: { type: 'integer', example: 1 },
                                name: { type: 'string', example: 'John Doe' },
                                email: { type: 'string', example: 'john.doe@example.com' },
                                createdAt: { type: 'string', example: '2024-01-01T12:34:56.000Z' },
                                updatedAt: { type: 'string', example: '2024-01-10T12:34:56.000Z' }
                            }
                        }
                    }
                }
            },
            500: {
                description: 'Internal server error',
                type: 'object',
                properties: {
                    status: { type: 'integer', example: 500 },
                    message: { type: 'string', example: 'Internal server error' }
                }
            }
        }
    }
}
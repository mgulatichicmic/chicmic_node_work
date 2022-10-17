'use strict';

const Joi = require('@hapi/joi');
const { AVAILABLE_AUTHS } = require(`../../utils/constants`);
//load controllers
const { registerNewUser, updateProfile, getUserProfile } = require(`../../controllers/userController`);

let routes = [
	{
		method: 'POST',
		path: '/v1/user/',
		joiSchema: {
			body: {
				email: Joi.string().email().required().description('User\'s email.'),
				password: Joi.string().required().description('User\'s password.'),
				firstName: Joi.string().required().description('User\'s first name.'),
				lastName: Joi.string().required().description('User\'s last name.'),
				profileImage: Joi.string().allow('').optional().description('Url of profile image.')
			}
		},
		handler: registerNewUser
	},
	{
		method: 'PUT',
		path: '/v1/user/',
		joiSchema: {
			headers: {
				'authorization': Joi.string().required().description('User\'s JWT token.')
			},
			body: {
				oldPassword: Joi.string().optional().description('oldPassword'),
				newPassword: Joi.string().when('oldPassword', { is: Joi.exist(), then: Joi.required(), otherwise: Joi.optional() }).description('New password.'),
				firstName: Joi.string().optional().description('User\'s first name.'),
				lastName: Joi.string().optional().description('User\'s last name.'),
				email: Joi.string().optional().description('User\'s email.'),
				profileImage: Joi.string().allow('').optional().description('Url of profile image.')
			}
		},
		auth: AVAILABLE_AUTHS.USER,
		handler: updateProfile
	},
	{
		method: 'GET',
		path: '/v1/user/',
		joiSchema: {
			headers: {
				'authorization': Joi.string().required().description('User\'s JWT token.')
			}
		},
		auth: AVAILABLE_AUTHS.USER,
		handler: getUserProfile
	}
];

module.exports = routes;

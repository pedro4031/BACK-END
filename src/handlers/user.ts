// deno-lint-ignore-file
import { Context, helpers } from "../deps.ts";
import type { User } from "../types/user.ts";
import * as db from "../db/user.ts";

export const allUsers = async (ctx: Context) => {
	try {
		const Users: User[] = db.allUsers();
		ctx.response.body = Users;
	} catch (err) {
		ctx.response.status = 404;
		ctx.response.body = { msg: err.message };
	}
};

export const findUser = async (ctx: Context) => {
	const { userId } = helpers.getQuery(ctx, { mergeParams: true });
	try {
		const user: User = db.findUserById(userId);
		ctx.response.body = user;
	} catch (err) {
		ctx.response.status = 404;
		ctx.response.body = { msg: err.message };
	}
};

export const deleteUser = async (ctx: Context) => {
	const { uuid } = await ctx.request.body().value;
	try {
		const deletedUser: User = db.deleteUser(uuid);

		ctx.response.body = { deletedUser };
	} catch (err) {
		ctx.response.status = 404;
		ctx.response.body = { msg: err.message };
	}
};

export const createUser = async (ctx: Context) => {
	try {
		const { name, birthDate } = await ctx.request.body().value;
		const createdUser: User = db.createUser({
			name,
			birthDate: new Date(birthDate),
		});
		ctx.response.body = createdUser;
	} catch (err) {
		ctx.response.status = 500;
		ctx.response.body = { msg: err.message };
	}
};
export const updateUser = async (ctx: Context) => {
	try {
		const { uuid, name, birthDate } = await ctx.request.body().value;
		const updatedUser: User = db.updateUser(uuid, { name, birthDate: new Date(birthDate) });
		ctx.response.body = updatedUser;
	} catch (err) {
		ctx.response.status = 500;
		ctx.response.body = { msg: err.message };
	}
};

// deno-lint-ignore-file
import type { User, UserForCreation, UserForUpdate } from "../types/user.ts";
import { v1 } from "../deps.ts";

let users: User[] = [];

export const allUsers = (): User[] => {
	try {
		return users;
	} catch (err) {
		throw new Error("Users not found", err);
	}
};

export const findUserById = (uuid: string): User => {
	try {
		let index = users.findIndex((prod) => prod.uuid == uuid);

		if (index == -1) {
			throw new Error("User not found");
		} else {
			return users[index];
		}
	} catch (err) {
		throw new Error("User not found", err);
	}
};
export const deleteUser = (uuid: string): User => {
	try {
		let index = users.findIndex((prod) => prod.uuid == uuid);

		if (index == -1) {
			throw new Error("User not found");
		} else {
			const deletedUser = users.splice(index, 1);
			return deletedUser[0];
		}
	} catch (err) {
		throw new Error("User not found", err);
	}
};
export const createUser = (user: UserForCreation): User => {
	try {
		let newUser: User = {
			uuid: v1.generate().toString(),
			name: user.name,
			birthDate: user.birthDate,
		};
		users.push(newUser);

		return newUser;
	} catch (err) {
		throw new Error("cant create the user", err);
	}
};

export const updateUser = (uuid: string, user: UserForUpdate): User => {
	try {
		let index = users.findIndex((prod) => prod.uuid == uuid);
		if (index == -1) {
			throw new Error("User not found");
		} else {
			users[index] = { ...users[index], ...user };
			return users[index];
		}
	} catch (err) {
		throw new Error("User not found", err);
	}
};

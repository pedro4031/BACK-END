import { Router } from "../deps.ts";
import { createUser, deleteUser, findUser, updateUser, allUsers } from "../handlers/user.ts";
export const router = new Router()

	.get("/api/users", allUsers)
	.get("/api/users/:userId", findUser)
	.delete("/api/users", deleteUser)
	.patch("/api/users", updateUser)
	.post("/api/users", createUser);

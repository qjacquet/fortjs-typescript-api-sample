import { Controller, jsonResult, textResult, DefaultWorker, HTTP_METHOD, HTTP_STATUS_CODE, Worker, Route, Guards } from 'fortjs'
import { UserService } from '../services/user_service'
import { ModelUserGuard } from '../guards/model_user_guard'
import { User } from '../models/user'
import { validate } from "class-validator"

export class UserController extends Controller {

	/**
	 * Get all Users
	 */
	@DefaultWorker()
	async getUsers() {
		const service = new UserService();
		return jsonResult(service.getUsers());
	}

	/**
	 * Get a User
	 */
	@Worker([HTTP_METHOD.Get])  
	@Route("/{id}")  
	async getUser() {  
			const userId = Number(this.param.id);  
			const service = new UserService();  
			const user = service.getUser(userId);  
			if (user == null) {  
				return textResult("invalid id");  
			}  
			return jsonResult(user);  
	} 

	/**
	 * Add a User
	 */
	@Guards([ModelUserGuard])
	@Worker([HTTP_METHOD.Post])
	@Route("/")
	async addUser() {
		const user: User = this.data.user;
		const service = new UserService();
		return jsonResult(service.addUser(user), HTTP_STATUS_CODE.Created);
	}

	/**
	 * Update a User
	 */
	@Worker([HTTP_METHOD.Put])
	@Guards([ModelUserGuard])
	@Route("/")
	async updateUser() {
		const user: User = this.data.user;
		const service = new UserService();
		const userUpdated = service.updateUser(user);
		if (userUpdated === true) {
			return textResult("user updated");
		}
		else {
			return textResult("invalid user");
		}
	}

	/**
	 * Delete a User
	 */
	@Worker([HTTP_METHOD.Delete])  
	@Route("/{id}")  
	async removeUser() {  
		const userId = Number(this.param.id);  
		const service = new UserService();  
		const user = service.getUser(userId);  
		if (user != null) {  
			service.removeUser(userId);  
			return textResult("user deleted");  
		}  
		else {  
			return textResult("invalid user");  
		}  
	}  

}  
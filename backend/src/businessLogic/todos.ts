import { TodosAccess } from '../dataLayer/todosAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as utils from '../lambda/utils'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';

// TODO: Implement businessLogic

const logger = createLogger("TodosAccess")
const attachmentUtils = new AttachmentUtils()
const todosAcess = new TodosAccess()

/*
GetTodos
See the /backend/src/lambda/http/getTodos.ts file. 
It should return all TODOs for a current user. A user id can be extracted from a JWT token that is sent by the frontend. 
*/


/*
createTodos
See the /backend/src/lambda/http/createTodos.ts file. 
It should create TODO, for a current user. 
*/

export async function createTodo( event 
    ): Promise <TodoItem>{
         //logger
    
    const parsedTodo: CreateTodoRequest = JSON.parse(event.body)
    const userId = utils.getUserId(event)
    const todoId = uuid.v4()
    const createdAt = new Date().toDateString()
    const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)

    //todo item
    const new_TodoItem = {
        userId, 
        todoId,
        name: parsedTodo.name,
        createdAt,
        dueDate: parsedTodo.dueDate,
        done: false,
        attachementUrl: s3AttachmentUrl
    }

    return await todosAcess.createTodoItem(new_TodoItem)

}

export async function getTodosForUser( event
    ): Promise<TodoItem[]> {
        //const parsedTodo: CreateTodoRequest = JSON.parse(event.body)
        const userId = utils.getUserId(event)

    return todosAcess.getAllTodos(userId)
}

//
export async function updateTodo(event
    ): Promise <TodoUpdate> {

    const parsedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const userId = utils.getUserId(event)
    const todoId = event.pathParameters.todoId
    

    const todoUpdatedIterm = {
     userId,
     todoId,
     parsedTodo
    }
    

   return await todosAcess.updateTodoItem(todoUpdatedIterm)
     
    
}

//
export async function deleteTodo(event
): Promise <String> {

    const userId = utils.getUserId(event)
    const todoId = event.pathParameters.todoId

    const todo = {
        userId,
        todoId
      
       }

    return todosAcess.deleteTodoItem(todo)
}
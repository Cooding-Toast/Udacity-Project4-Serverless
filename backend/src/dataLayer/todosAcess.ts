import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic

export class TodosAccess {
    constructor(
        private readonly doctClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly todoIndex = process.env.INDEX_NAME
    ){}

    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
        logger.info('')

        await this.doctClient
        .put({
            TableName: this.todosTable,
            Item: todoItem
        })
        .promise()
        
        return todoItem
    }

    async getAllTodos(userId: string): Promise<TodoItem[]>{

        const result = await this.doctClient
        .query({
            TableName: this.todosTable,
            IndexName: this.todoIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })
        .promise()
        .then(res => res.Items)

        return result as TodoItem[]
  
    }

    async updateTodoItem(
        todoUpdatedIterm
        ): Promise<TodoUpdate> {
            logger.info('')

         await this.doctClient.update({
            TableName: this.todosTable,
            Key: {
              userId: todoUpdatedIterm.userId,
              todoId: todoUpdatedIterm.todoId
            },
            UpdateExpression: "set #name = :name, dueDate = :dueDate, done = :done",
            ExpressionAttributeNames: { '#name': 'name' },
            ExpressionAttributeValues: {
              ":name": todoUpdatedIterm.updatedTodo.name,
              ":dueDate": todoUpdatedIterm.updatedTodo.dueDate,
              ":done": todoUpdatedIterm.updatedTodo.done
            },
            ReturnValues: "UPDATED_NEW"
        }).promise()
        

        return todoUpdatedIterm.updatedTodo as TodoUpdate
 }

    async deleteTodoItem(
    deleteTODOIterm
    ): Promise<string>{
       const result = await this.doctClient
        .delete({
            TableName: this.todosTable,
            Key: {
                userId: deleteTODOIterm.userId,
                todoId: deleteTODOIterm.todoId
            }
        })
        .promise()
        

        return "Deleted"
    }

}
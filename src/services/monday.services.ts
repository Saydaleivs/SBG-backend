import axios, { AxiosResponse } from "axios"
import {
  ContactForm,
  SubscriberColumns,
  Subscribers,
  UserColumns,
  Users,
} from "../enums/monday.enum"
import User from "../models/user.model"
import { ObjectId } from "mongodb"
import sendMail from "../utils/mail.utils"
import { ClickError } from "../enums/transaction.enum"
import { isValidObjectId } from "mongoose"

class MondayService {
  private apiUrl: string
  private apiToken: string

  constructor(apiUrl: string, apiToken: string) {
    this.apiUrl = apiUrl
    this.apiToken = apiToken
  }

  async addContactDeal(
    name: string,
    phone: string,
    message: string
  ): Promise<AxiosResponse<any>> {
    console.log(this.apiToken, this.apiUrl)

    const query = `mutation { 
      create_item (
        board_id: ${ContactForm.BOARD_ID}, 
        group_id: "${ContactForm.GROUP_ID}", 
        item_name: "${name}", 
        column_values: "{\\"phone\\":\\"${phone}\\", \\"text\\":\\"${message}\\"}") { 
          id 
        }
    }`

    return await this.post(query)
  }

  async addRegisteredUser(
    fullName: string,
    email: string
  ): Promise<AxiosResponse<any>> {
    const query = `mutation {
      create_item(
        board_id: ${Users.BOARD_ID},
        group_id: "${Users.GROUP_ID}",
        item_name: "${fullName}",
        column_values: "{\\"${UserColumns.EMAIL}\\":\\"${email}\\", \\"${
      UserColumns.DATE
    }\\":\\"${new Date(new Date()).toISOString().slice(0, 10)}\\"}"
      ) {
        id
      }
    }`

    return await this.post(query)
  }

  async addSubscriber(userId: string) {
    if (!isValidObjectId(userId)) {
      return {
        error: ClickError.UserNotFound,
        error_note: "User not found",
      }
    }

    const user = await User.findById(userId)

    if (!user) {
      return {
        error: ClickError.UserNotFound,
        error_note: "User not found",
      }
    }

    await sendMail(user.email, "Payment received", "", "payment_success")

    const deleteQuery = `mutation { delete_item (item_id: ${user.itemId}) { id }}`
    await this.post(deleteQuery)

    const addQuery = `mutation { create_item (board_id: ${
      Subscribers.BOARD_ID
    }, group_id: \"${Subscribers.GROUP_ID}\", item_name: \"${
      user.fullName
    }\", column_values: \"{\\\"${SubscriberColumns.EMAIL}\\\":\\\"${
      user.email
    }\\\", \\\"${SubscriberColumns.DATE}\\\":\\\"${new Date(new Date())
      .toISOString()
      .slice(0, 10)}\\\", \\\"${SubscriberColumns.PAYMENT_AMOUNT}\\\":\\\"${
      user.amount
    }\\\"}\") { id }}`

    await this.post(addQuery)
      .then(async (res) => {
        const id = res.data.data.create_item.id

        user.itemId = id
        await user.save()

        return res
      })
      .catch((err) => err)
  }

  async getColumns(boardId: number) {
    const query = `query {boards (ids: ${boardId}) { columns { id title }}}`
    return await this.post(query)
  }

  async getBoards(boardId: number) {
    const query = `query { boards (ids: ${boardId}) { name state id permissions }}`

    return await this.post(query)
  }

  async getGroups(boardId: number) {
    const query = `query { boards (ids: ${boardId}) { groups { title id }}}`

    return await this.post(query)
  }

  private async post(
    query: string,
    variables?: any
  ): Promise<AxiosResponse<any>> {
    const requestBody = { query, variables }
    const headers = {
      "Content-Type": "application/json",
      Authorization: this.apiToken,
    }

    try {
      const response = await axios.post(this.apiUrl, requestBody, { headers })
      // Extracting status and data from the Axios response
      console.log(response.data)

      return response
    } catch (error: any) {
      console.log(error.response.data)

      // If there's an error, return an object with status and error message
      return error
    }
  }
}

export default MondayService

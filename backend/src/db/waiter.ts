import { Table } from "../models/table.model"
import { tableModel } from "../schemas/table.schema"

const pino = require('pino')()

export const getTables = async () => {
    const res = await tableModel.aggregate([
        {
            "$lookup": {
                from: "users",
                localField: "waiter_id",
                foreignField: "_id",
                as: "waiter_info"
            }
        }
    ]).exec()

    return res as Table[]
}


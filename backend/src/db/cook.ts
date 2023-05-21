import { orderModel } from "../schemas/order.schema";
import { Order } from "../models/order.model";
import { tableModel } from "../schemas/table.schema";

// Cook Version, query for WAITING queue, only food
export const getWaitingOrders = async () => {
    const res = await orderModel.aggregate([
        {
            "$match": {
                pending: true,
                completed: false
            },
        },
        {
            "$lookup": {
                from: "foodtypes",
                localField: "items",
                foreignField: "name",
                as: "items_info"
            }
        },
        {
            "$match": { 
                items_info: {
                    $elemMatch: {
                        drink: false // cook route. shouldn't see drink orders
                    }
                }
            }
        }
    ]).exec()

    return res as Order[]
}

export const getCookingOrders = async () => {
    // PROCESSING queue
    const res = await orderModel.aggregate([
        {
            "$match": {
                pending: false,
                completed: false
            },
        },
        {
            "$lookup": {
                from: "foodtypes",
                localField: "items",
                foreignField: "name",
                as: "items_info"
            }
        },
        {
            "$match": {
                items_info: {
                    $elemMatch: {
                        drink: false // cook route. shouldn't see drink orders
                    }
                }
            }
        }
    ]).exec()

    return res as Order[]
}

export const startCooking = async (table_num: number) => {
    const table = await tableModel.find({ table_num: table_num }).exec()
    if (table) {
        // WAITING queue
        const orders_to_update = await orderModel.aggregate([
            {
                "$match": {
                    table_num: table_num,
                    pending: true,
                    completed: false
                },
            },
            {
                "$lookup": {
                    from: "foodtypes",
                    localField: "items",
                    foreignField: "name",
                    as: "items_info"
                }
            },
            {
                "$match": {
                    items_info: {
                        $elemMatch: {
                            drink: false 
                        }
                    }
                }
            }
        ]).exec()

        for (let order of orders_to_update) {
            await orderModel.findByIdAndUpdate(order._id, { pending: false }).exec()
        }

        return "Orders assigned to table " + table_num + " are being cooked"
    }

    throw new Error("invalid table_num")
}

export const finishCooking = async (table_num: number) => {
    const table = await tableModel.find({ table_num: table_num }).exec()
    if (table) {
        // PROCESSING queue
        const orders_to_update = await orderModel.aggregate([
            {
                "$match": {
                    table_num: table_num,
                    pending: false,
                    completed: false 
                },
            },
            {
                "$lookup": {
                    from: "foodtypes",
                    localField: "items",
                    foreignField: "name",
                    as: "items_info"
                }
            },
            {
                "$match": { 
                    items_info: {
                        $elemMatch: {
                            drink: false
                        }
                    }
                }
            }
        ]).exec()

        for (let order of orders_to_update) {
            await orderModel.findByIdAndUpdate(order._id, { completed: true }).exec()
        }

        return "Orders assigned to table " + table_num + " finished cooking"
    }

    throw new Error("invalid table_num")
}

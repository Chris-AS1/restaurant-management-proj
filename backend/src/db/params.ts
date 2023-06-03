export const waitingQueueParams =
    [{
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
    }]

export const processingQueueParams =
    [{
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
    }]


export const undeliveredQueueParams =
    [{
        "$match": {
            completed: true,
            delivered: false,
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
        "$lookup": {
            from: "tables",
            localField: "table_num",
            foreignField: "table_num",
            as: "tables_info"
        }
    }]



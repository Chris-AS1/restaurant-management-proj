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



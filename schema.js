db.createCollection( "abcdb_set",
   {
      validator: { $and:
         [
            { "data.title" : { $type: "string" } },
            { "data.creator" : { $type: "string" } },
            { "data.createDate" : { $type: "date" } },
            { "data.period" : { $type: "number" } },
            { "status" : { $in: ["AVAILABLE", "ON_LOAN"] } },
            { "userID" : { $type: "string" } },
            { "items" : { $type: "string" } }
         ]
      },
      validationAction: "error"
   }
)

db.createCollection( "abcdb_user",
   {
      validator: { $and:
         [
            // { "data.title" : { $type: "string" } },
            // { "data.creator" : { $type: 'string' } },
            // { "data.createDate" : { $type: 'string' } },
            // { "status" : { $type: 'string' } },
            // { "userID" : { $type: 'string' } },
            // { "items" : { $type: 'string' } }
         ]
      },
      validationAction: "error"
   }
)




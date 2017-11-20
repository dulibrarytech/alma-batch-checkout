db.createCollection( "abcdb_set",
   {
      validator: { $and:
         [
            { "data.title" : { $type: "string" } },
            { "data.creator" : { $type: "string" } },
            { "data.createDate" : { $type: "date" } },
            { "data.period" : { $type: "number" } },
            { "status" : { $in: ["AVAILABLE", "ON_LOAN"] } },
            { "items" : { $type: "string" } }
         ]
      },
      validationAction: "error"
   }
)

db.createCollection( "abcdb_loan",
   {
      validator: { $and:
         [
            { "setID" : { $type: "string" } },
            { "userID" : { $type: "string" } },
            { "due" : { $type: "date" } }
         ]
      },
      validationAction: "error"
   }
)





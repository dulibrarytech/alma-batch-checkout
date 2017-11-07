db.createCollection( "abcdb_set",
   {
      validator: { $and:
         [
            { "data.title" : { $type: "string" } },
            { "data.creator" : { $type: "string" } },
            { "data.createDate" : { $type: "date" } },
            { "data.period" : { $type: "number" } },
            { "status" : { $in: ["AVAILABLE", "ON_LOAN"] } },
            { "patronID" : { $type: "string" } },
            { "due" : { $type: "date" } },
            { "items" : { $type: "string" } }
         ]
      },
      validationAction: "error"
   }
)




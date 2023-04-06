import {app} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { date, object, string } from 'yup';

// example
const flashCardYup = object({
    front: string().required(),
    back: string().required(),
    category: string(),//.required(),
    createdOn: date().default(() => new Date()),
})

// /dev
app.get('/', (req, res) => {
  res.json({result:'CRUD server ready'});
})

// /dev/test, test route for https://<PROJECTID>.api.codehooks.io/dev/


// // Use Crudlify to create a REST API for any collection
// crudlify(app)

crudlify(app, {flashCard: flashCardYup})


// bind to serverless runtime
export default app.init();


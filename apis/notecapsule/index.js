import { app, Datastore } from 'codehooks-js';
import { crudlify } from 'codehooks-crudlify';
// import { date, object, string, number, boolean} from 'yup';
import jwtDecode from 'jwt-decode';
import * as Yup from 'yup';

// Define the schema for a Todo object using Yup
const noteSchema = Yup.object().shape({
  userId: Yup.string().required('User ID is required'), // User ID
  title: Yup.string().required('Note title is required'), // note title
  content: Yup.string().required('Note content is required'), // note content
  category: Yup.string().nullable(), // note category (optional)
  createdOn: Yup.date().default(() => new Date()),
});

// Define the schema for a Category object using Yup
// Todo: add category schema

const categoriesSchema = Yup.object({
  userId: Yup.string().required(),
  name: Yup.string().required(),
  createdOn: Yup.date().default(() => new Date()),
});

const options = {
  // Specify the schema type as "yup"
  schema: 'yup',
};

// const userAuth = async (req, res, next) => {
//   try {
//     const { authorization } = req.headers;
//     if (authorization) {
//       const token = authorization.replace('Bearer ', '');
//       // NOTE this doesn't validate, but we don't need it to. codehooks is doing that for us.
//       const token_parsed = jwtDecode(token);
//       req.user_token = token_parsed;
//     }

//     next();
//   } catch (error) {
//     next(error);
//   }
// };

// app.use(userAuth);

// lastest note is on the top
async function getNotesDescSortedByDate(req, res) {
  // const userId = req.user_token.sub;
  const userId = req.params.userId;
  // const userId = "test1"; // for testing
  const conn = await Datastore.open();
  const query = { userId: userId };
  const options = {
    filter: query,
    sort: { createdOn: 0 },
  };
  conn.find('note', options).json(res);
};

app.get('/getAllNotesDesc/:userId', getNotesDescSortedByDate);

// latest note is on the bottonm
async function getNotesAescSortedByDate(req, res) {
  // const userId = req.user_token.sub;
  const userId = req.params.userId;
  // const userId = "test1"; // for testing
  const conn = await Datastore.open();
  const query = { userId: userId };
  const options = {
    filter: query,
    sort: { createdOn: 1 },
  };
  conn.find('note', options).json(res);
};

app.get('/getAllNotesAesc/:userId', getNotesAescSortedByDate);


// Make REST API CRUD operations for the "notes" collection with the Yup schema

// search the note table by keyword
// show results by date desc order
async function getSearchRes(req, res) {
  const userId = req.params.userId;
  // const userId = "test1";
  // const userId = req.user_token.sub;
  const searchKey = req.params.searchInput;
  const conn = await Datastore.open();
  const query = {
    userId: userId,
    $or: [
      { title: { $regex: searchKey, $options: 'gi' } },
      { content: { $regex: searchKey, $options: 'gi' } },
      { category: { $regex: searchKey, $options: 'gi' } },
      // { createdOn: { $regex: searchKey, $options: 'gi' } },
    ],
  };
  const options = {
    sort: { createdOn: -1 },
    filter: query,
  };
  conn.find('note', options).json(res);
};

app.get('/getAllSearchNotes/:userId/:searchInput', getSearchRes);


// const { Client } = require('@elastic/elasticsearch');

// const client = new Client({
//   node: 'http://localhost:3000',
//   log: 'trace'
// });

// async function getSearchResFull(req, res) {
//   const userId = "test1";
//   const searchKey = req.params.searchInput;
//   const conn = await Datastore.open();
//   // const collection = conn.collection('note');
//   const idx = await conn.createIndex('note', ['title', 'content', 'category']);

//   // Let's start by indexing some data
//   await client.index({
//     index: 'notes',
//     document: {
//       title: 'Ned Stark',
//       content: 'Winter is coming.'
//     }
//   })

//   await client.index({
//     index: 'notes',
//     document: {
//       title: 'Daenerys Targaryen',
//       content: 'I am the blood of the dragon.'
//     }
//   })

//   await client.indices.refresh({ index: 'notes' })

//   const result= await client.search({
//     index: 'notes',
//     query: {
//       match: { content: 'winter' }
//     }
//   })

//   res.json(result);
// };

// app.get('/getAllSearchNotesFull/:userId/:searchInput', getSearchResFull);

// Make REST API CRUD operations for the "notes" collection with the Yup schema
crudlify(app, { note: noteSchema, categories: categoriesSchema }, options);

// Export app to a runtime server engine
export default app.init();

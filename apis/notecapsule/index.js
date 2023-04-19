import { app, Datastore } from 'codehooks-js';
import { crudlify } from 'codehooks-crudlify';
// import { date, object, string, number, boolean} from 'yup';
import jwtDecode from 'jwt-decode';
import * as Yup from 'yup';

// Define the schema for a Todo object using Yup
const noteSchema = Yup.object({
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

const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.replace('Bearer ', '');
      // NOTE this doesn't validate, but we don't need it to. codehooks is doing that for us.
      
      const token_parsed = jwtDecode(token);
      req.user_token = token_parsed;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(400);
    res.json(error).end();
    next();
  }
};
app.use(userAuth);

app.use("/note", (req, res, next) => {
  if (req.method === "POST") {
    // always save authenticating user Id token.
    // note -- were not enforcing uniqueness which isn't great.
    // we don't currently have a great way to do this -- one option would be to
    // have a user collection track which collections have been filled
    // It's a limitation for sure, but I'll just make that a front-end problem...
    req.body.userId = req.user_token.sub;
  } else if (req.method === "GET") {
    // on "index" -- always check for authentication.
    req.query.userId = req.user_token.sub;
  }
  next();
});

// lastest note is on the top
async function getNotesDescSortedByDate(req, res) {
  const userId = req.user_token.sub;
  // const userId = req.params.userId;
  // const userId = "test1"; // for testing
  const conn = await Datastore.open();
  const query = { userId: userId };
  const options = {
    filter: query,
    sort: { createdOn: 0 },
  };
  conn.find('note', options).json(res);
}

// latest note is on the bottonm
async function getNotesAescSortedByDate(req, res) {
  const userId = req.user_token.sub;
  // const userId = req.params.userId;
  // const userId = "test1"; // for testing
  const conn = await Datastore.open();
  const query = { userId: userId };
  const options = {
    filter: query,
    sort: { createdOn: 1 },
  };
  conn.find('note', options).json(res);
}

// Make REST API CRUD operations for the "notes" collection with the Yup schema

// search the note table by keyword
// show results by date desc order
async function getSearchRes(req, res) {
  // const userId = req.params.userId;
  // const userId = "test1";
  const userId = req.user_token.sub;
  const searchKey = req.params.searchInput;
  const conn = await Datastore.open();
  const query = {
    userId: userId,
    $or: [
      { title: { $regex: searchKey, $options: 'gi' } },
      { content: { $regex: searchKey, $options: 'gi' } },
      { category: { $regex: searchKey, $options: 'gi' } },
      { createdOn: { $regex: searchKey, $options: 'gi' } },
    ],
  };
  const options = {
    sort: { createdOn: -1 },
    filter: query,
  };
  conn.find('note', options).json(res);
}

async function getNotes(req, res) {
  const userId = req.user_token.sub;
  const conn = await Datastore.open();
  const options = {
    filter: { userId: userId },
  };
  conn.getMany("note", options).json(res);
}

app.get('/note', getNotes);

app.get('/getAllNotesDesc', getNotesDescSortedByDate);

app.get('/getAllNotesAesc', getNotesAescSortedByDate);

app.get('/getAllSearchNotes/:searchInput', getSearchRes);

// Make REST API CRUD operations for the "notes" collection with the Yup schema
crudlify(app, { note: noteSchema, categories: categoriesSchema }, options);

// Export app to a runtime server engine
export default app.init();

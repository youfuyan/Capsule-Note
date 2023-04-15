// // Export app to a runtime server engine
// export default app.init();
import { app } from 'codehooks-js';
import { crudlify } from 'codehooks-crudlify';
import * as yup from 'yup';

// Define the schema for a Todo object using Yup
const noteSchema = yup.object().shape({
  userId: yup.string().required('User ID is required'), // User ID
  title: yup.string().required('Todo title is required'), // note title
  content: yup.string().required('Todo content is required'), // note content
  category: yup.string().nullable(), // note category (optional)
  createdOn: yup.mixed().default(() => new Date().toISOString()), // note creation date (default: current date)
});

// Define the schema for a Category object using Yup
// Todo: add category schema

const options = {
  // Specify the schema type as "yup"
  schema: 'yup',
};

// Make REST API CRUD operations for the "notes" collection with the Yup schema
crudlify(app, { note: noteSchema }, options);

// Export app to a runtime server engine
export default app.init();

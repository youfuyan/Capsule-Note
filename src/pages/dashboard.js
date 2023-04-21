import React, { useEffect, useState, useRef, useContext } from 'react';
import Link from 'next/link';
import styles from '../styles/dashboard.module.css';
import { ThemeContext } from './_app';
import { useClerk } from '@clerk/clerk-react';
import { useAuth, useUser, UserButton, SignIn } from '@clerk/nextjs';
import {
  Container,
  Navbar,
  Button,
  Modal,
  ListGroup,
  Form,
  InputGroup,
  Dropdown,
} from 'react-bootstrap';
import {
  BsList,
  BsSearch,
  BsFilter,
  BsSortAlphaDown,
  BsPlus,
} from 'react-icons/bs';
import {
  getNotes,
  deleteNote,
  getAllCats,
  addCat,
  getNotesByCat,
} from '@/modules/Data';
import { addNote, updateNote, deleteCat, getNotesDesc, getNotesAsce } from '@/modules/Data';

const Dashboard = () => {
  const { signOut } = useClerk();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user, isSignedIn } = useUser();
  const [notes, setNotes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jwt, setJwt] = useState('');
  const [showLeftMenu, setShowLeftMenu] = useState(false);
  // Add state to manage the visibility of the move category modal
  const [showMoveCategoryModal, setShowMoveCategoryModal] = useState(false);
  // Add state to store the ID of the note being moved
  const [noteToMove, setNoteToMove] = useState(null);
  // Create a ref to store the select input element
  const categorySelectRef = useRef(null);

  const [sortDesc, setSortDesc] = useState(false);

  const {theme, setTheme} = useContext(ThemeContext);


  // Fetch notes and categories on initial render
  useEffect(() => {
    const fetchNotesAndCats = async () => {
      if (userId) {
        const token = await getToken({ template: 'codehooks' });
        setJwt(token);
        const fetchedNotes = await getNotes(token);
        setNotes(fetchedNotes);
        const fetchedCategories = await getAllCats(token);
        setCategories(fetchedCategories);
        console.log('Fetched categories:', fetchedCategories); // Log fetched categories for debugging
      }
    };
    fetchNotesAndCats();
  }, [userId, jwt]);

  const handleSelectCategory = async (category) => {
    setSelectedCategory(category);
    const fetchedNotes = await getNotesByCat(jwt, category);
    setNotes(fetchedNotes);
  };

  const handleAddCategory = async () => {
    if (newCategory && newCategory.trim()) {
      const newCat = { 
        userId: userId, 
        "name": newCategory.trim() 
      };
      const createdCategory = await addCat(jwt, newCat); // Get the created category from the API response
      setCategories([...categories, createdCategory]); // Add the created category to the state
      setNewCategory('');
      console.log('Added new category:', createdCategory);
    }
  };

  const handleDeleteNote = async (noteId) => {
    await deleteNote(jwt, noteId);
    setNotes(notes.filter((note) => note._id !== noteId));
  };

  const handleCreateNewNote = async () => {
    // Create a default note for the user
    // const defaultNote = {
    //   title: 'Untitled Note',
    //   content: 'Type your note content here...',
    //   category: 'General'
    // };

    const defaultNote = {
      userId: userId,
      title: 'Untitled Note',
      content: 'Type your note content here...',
      category: 'General',
    };
    const createdNote = await addNote(jwt, defaultNote);
    console.log("created new note is", createdNote);
    // Redirect the user to the editor page for the newly created note
    window.location.href = `/note/${createdNote._id}`;
  };

  // Handle moving the note to a different category
  const handleMoveNoteToCategory = async () => {
    // Get the selected category from the select input element
    const newCategory = categorySelectRef.current.value;
    // Update the note's category
    const modifiedNote = {
      title: noteToMove.title,
      content: noteToMove.content,
      category: newCategory,
      userId: userId
    };
    await updateNote(jwt, noteToMove._id, modifiedNote);
    // Refresh the notes list based on the selected category
    const fetchedNotes = await getNotes(jwt);
    setNotes(fetchedNotes);
    // Close the move category modal
    setShowMoveCategoryModal(false);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCat(jwt, categoryId);
      setCategories(
        categories.filter((category) => category._id !== categoryId)
      );
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSort = async (e) => {
    try {
      e.preventDefault();
      if(sortDesc){
        const fetchedNotes = await getNotesDesc(jwt, userId);
        setNotes(fetchedNotes);
      } else {
        const fetchedNotes = await getNotesAsce(jwt, userId);
        setNotes(fetchedNotes);
      }

      setSortDesc(!sortDesc);
    } catch (error) {
      console.error('Error sorting notes:', error);
    }
  }

  const handleClickNote = async (e, id) => {
    e.preventDefault();
    window.location.href = `/note/${id}`;
  }

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }

  return (
    <>
      <Navbar
        expand={false}
        variant='dark'
        style={{ backgroundColor: '#808080' }}
      >
        <Navbar.Toggle
          aria-controls='category-section'
          onClick={() => setShowLeftMenu(!showLeftMenu)}
        >
          <BsList />
        </Navbar.Toggle>
        <Navbar.Brand>{user.firstName}&apos;s Notes</Navbar.Brand>
      </Navbar>
      <div className='contentContainer' style={{ display: 'flex' }}>
        <Modal
          show={showLeftMenu}
          onHide={() => setShowLeftMenu(false)}
          dialogClassName='modal-90w'
          centered
        >
          <Modal.Body>
            <div className='sideMenu'>
              <div className='p-3'>
                <UserButton />
              </div>
              <h2 className='p-3'>Categories</h2>
              <Form className='p-3'>
                <Form.Group>
                  <Form.Control
                    type='text'
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder='New category'
                  />
                </Form.Group>
                <Button
                  onClick={handleAddCategory}
                  className='btn btn-primary mt-2'
                >
                  Add Category
                </Button>
                <br></br>
                <Button
                  onClick={handleToggleTheme}
                  className='btn btn-primary mt-2'
                >
                  Toggle Theme
                </Button>
              </Form>
              <ListGroup className='p-3'>
                {categories.map((category) => (
                  <ListGroup.Item key={category._id}>
                    <div className='d-flex justify-content-between align-items-center'>
                      {/* Category name and navigation */}
                      <Link
                        href={`/notes/${encodeURIComponent(category.name)}`}
                      >
                        {category.name}
                      </Link>
                      {/* Delete button */}
                      <Button
                        variant='danger'
                        size='sm'
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className='p-3 d-flex justify-content-between'>
                <Button variant='link' onClick={() => signOut()}>
                  Sign out
                </Button>
                {/* Dark mode button goes here */}
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <div className='mainContent'>
          {/* Action buttons */}
          
          <div className='d-flex justify-content-end p-3'>
            
            <Button variant='outline-secondary' className='mx-1'>
              <BsSearch />
            </Button>
            <Button variant='outline-secondary' className='mx-1'>
              <BsFilter />
            </Button>
            <Button variant='outline-secondary' className='mx-1' onClick={(e) => handleSort(e)}>
              <BsSortAlphaDown />
            </Button>
          </div>
          {/* Notes list */}
          <Container>
            <ListGroup>
              {notes.map((note) => (
                <ListGroup.Item className={styles.noteContainer} key={note._id}>
                  <div className='d-flex justify-content-between align-items-center'>
                    <Link href={`/note/${note._id}`} className={styles.noteLink}>
                      {note.title || 'Untitled Note'}
                    </Link>
                    <Dropdown>
                      <Dropdown.Toggle className={styles.dropdownList}
                        variant='link'
                        id={`dropdown-basic-${note._id}`}
                      >
                        <BsList />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {/* Add options to the dropdown menu */}
                        <Dropdown.Item href={`/note/${note._id}`}>
                          Edit
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            setNoteToMove(note);
                            setShowMoveCategoryModal(true);
                          }}
                        >
                          Move to Category
                        </Dropdown.Item>
                        <Dropdown.Item href='#/action-2'>Export</Dropdown.Item>
                        <Dropdown.Item href='#/action-3'>Copy</Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => handleDeleteNote(note._id)}
                        >
                          Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <div className='text-center my-4'>
              {/* Floating action button to create a new note */}
              <Button
                variant='primary'
                className='fab-button'
                onClick={handleCreateNewNote}
              >
                <BsPlus />
              </Button>
            </div>
          </Container>
        </div>
        {/* Move Category Modal */}
        <Modal
          show={showMoveCategoryModal}
          onHide={() => setShowMoveCategoryModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Move Note to Category</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId='categorySelect'>
              <Form.Label>Select Category</Form.Label>
              <Form.Control as='select' ref={categorySelectRef}>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant='secondary'
              onClick={() => setShowMoveCategoryModal(false)}
            >
              Close
            </Button>
            <Button variant='primary' onClick={handleMoveNoteToCategory}>
              Move
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <style jsx>{`
        .fab-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .modal-90w {
          max-width: 400px;
        }
        .sideMenu {
          width: 100%;
          max-width: 400px;
        }

        @media (max-width: 320px) {
          .modal-90w {
            max-width: 30vw;
          }
        }

        .mainContent {
          flex: 1;
        }
        .sideMenuOpen {
          width: 100%;
        }
        .sideMenuClose {
          width: 0;
        }
        .contentContainer {
          filter: blur(${(props) => (props.showLeftMenu ? '5px' : '0')});
        }
      `}</style>
    </>
  );
};

export default Dashboard;

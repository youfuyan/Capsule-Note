// pages/notes/[category].js
import React, { useEffect, useState, useRef, useContext } from 'react';
import { useRouter } from 'next/router';
import { useClerk } from '@clerk/clerk-react';
import { useAuth, useUser, UserButton, SignIn } from '@clerk/nextjs';
import { ThemeContext } from '../_app';
import styles from '../../styles/dashboard.module.css';
import Link from 'next/link';
import {
  Container,
  Navbar,
  Button,
  Modal,
  ListGroup,
  Form,
  Offcanvas,
  Dropdown,
  Nav,
} from 'react-bootstrap';

import {
  BsList,
  BsSearch,
  BsFilter,
  BsSortAlphaDown,
  BsSortAlphaDownAlt,
  BsPlus,
  BsMoon,
  BsBoxArrowRight,
  BsX,
  BsSun,
  BsMoonStars,
  BsFillHouseFill,
} from 'react-icons/bs';

import { RiSortAsc, RiSortDesc } from 'react-icons/ri';

import {
  getNotes,
  deleteNote,
  getAllCats,
  addCat,
  getNotesByCat,
} from '@/modules/Data.js';
import {
  addNote,
  updateNote,
  deleteCat,
  getNotesDesc,
  getNotesAsce,
  getSearchRes,
} from '@/modules/Data.js';

import { generatePdfHTML } from '@/modules/GeneratePDF.js';

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;
  const { user, isSignedIn } = useUser();
  const [categories, setCategories] = useState([]);
  const { isLoaded, userId, getToken } = useAuth();
  const [notes, setNotes] = useState([]);
  const [jwt, setJwt] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const [showLeftMenu, setShowLeftMenu] = useState(false);
  // Add state to manage the visibility of the move category modal
  const [showMoveCategoryModal, setShowMoveCategoryModal] = useState(false);
  // Add state to store the ID of the note being moved
  const [noteToMove, setNoteToMove] = useState(null);
  // Create a ref to store the select input element
  const categorySelectRef = useRef(null);

  const [sortDesc, setSortDesc] = useState(false);

  const { theme, setTheme } = useContext(ThemeContext);
  // Define classes based on the theme
  const offcanvasClass = theme === 'dark' ? 'offcanvasDarkMode' : '';
  const buttonClass = theme === 'dark' ? 'buttonDarkMode' : '';

  const [searchInput, setSearchInput] = useState(''); // Search input from the user
  const [filterCriteria, setFilterCriteria] = useState(''); // Filter criteria for notes (e.g., category)

  // Fetch notes and categories on initial render
  useEffect(() => {
    const fetchNotesAndCats = async () => {
      if (userId) {
        const token = await getToken({ template: 'codehooks' });
        const fetchedCategories = await getAllCats(token);
        setCategories(fetchedCategories);
        console.log('Fetched categories:', fetchedCategories); // Log fetched categories for debugging
      }
    };
    fetchNotesAndCats();
  }, [userId]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (userId && category) {
        const token = await getToken({ template: 'codehooks' });
        setJwt(token);
        const fetchedNotes = await getNotesByCat(token, category);
        setNotes(fetchedNotes);
      }
    };
    fetchNotes();
  }, [userId, jwt, category]);

  const handleDeleteNote = async (noteId) => {
    const token = await getToken({ template: 'codehooks' });
    await deleteNote(token, noteId);
    setNotes(notes.filter((note) => note._id !== noteId));
  };

  const handleCreateNewNote = async () => {
    // Create a default note for the user with the current category
    const defaultNote = {
      userId: userId,
      title: 'Untitled Note',
      content: 'Type your note here...',
      category: category,
    };
    const token = await getToken({ template: 'codehooks' });
    const createdNote = await addNote(token, defaultNote);
    // Redirect the user to the editor page for the newly created note
    router.push(`/note/${createdNote._id}`);
  };
  const handleAddCategory = async () => {
    if (newCategory && newCategory.trim()) {
      const token = await getToken({ template: 'codehooks' });
      const newCat = {
        userId: userId,
        name: newCategory.trim(),
      };
      const createdCategory = await addCat(token, newCat); // Get the created category from the API response
      setCategories([...categories, createdCategory]); // Add the created category to the state
      setNewCategory('');
      console.log('Added new category:', createdCategory);
    }
  };
  const generatePdf = async (title, content) => {
    generatePdfHTML(title, content);
  };

  const handleClickNote = async (e, id) => {
    e.preventDefault();
    window.location.href = `/note/${id}`;
  };

  const handleToggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Fetch notes based on search input, filter criteria, and sort order
  const searchNotes = async () => {
    let fetchedNotes = [];
    const token = await getToken({ template: 'codehooks' });
    if (searchInput) {
      fetchedNotes = await getSearchRes(token, searchInput);
    } else if (filterCriteria) {
      fetchedNotes = await getNotesByCat(token, filterCriteria);
    } else if (sortDesc) {
      fetchedNotes = await getNotesDesc(token, userId);
    } else {
      fetchedNotes = await getNotesAsce(token, userId);
    }
    setNotes(fetchedNotes);
  };

  // Handle search input change
  const handleSearch = async (e) => {
    setSearchInput(e.target.value);
    await searchNotes();
  };

  // Handle sort order change
  const handleSort = async () => {
    setSortDesc(!sortDesc);
    await searchNotes();
  };

  return (
    <div className={styles.dashboardContainer}>
      <Navbar
        expand={false}
        // variant='dark'
        // style={{
        //   backgroundColor: theme === 'dark' ? 'var(--gray5)' : '#808080',
        // }}
        className={styles.navBar}
      >
        <Navbar.Toggle
          aria-controls='category-section'
          onClick={() => setShowLeftMenu(!showLeftMenu)}
          className={styles.navBarToggle}
        >
          <BsList />
        </Navbar.Toggle>
        <Nav.Link href={'/dashboard'}>
          <BsFillHouseFill />
        </Nav.Link>
        {/* If first name is not available, use email as name instead. */}
        <Navbar.Brand className={styles.navBarText}>{user.firstName ? user.firstName : user.primaryEmailAddress.emailAddress}&apos;s Notes</Navbar.Brand>


        <Navbar.Offcanvas
          id='offcanvasNavbar'
          aria-labelledby='offcanvasNavbarLabel'
          placement='start'
          className={`sideBar-${theme}`}
          // className={styles.sideBar}
        >
          <Offcanvas.Header className="sideBarHeader" closeButton closeVariant={theme === 'dark' ? "white" : null}>
              <Offcanvas.Title id="offcanvasNavbarLabel">
                  
              </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className={styles.sideBarBody}>
            <div className={styles.sideMenu}>
              <span className={`categoriesText ${styles.categoriesText}`}>
                Categories
              </span>
              <ListGroup className={`p-1 ${styles.sideBarCatList}`}>
                {/* Link to go to all note (dashboard) */}
                <ListGroup.Item
                  className={` sideBarCatContainer ${styles.sideBarCatContainer}`}
                  // key={category._id}
                >
                  <div className='d-flex justify-content-between align-items-center'>
                    <Link
                      className={` sideBarCatLink ${styles.sideBarCatLink}`}
                      href={`/dashboard`}
                    >
                      All Notes
                    </Link>
                    
                  </div>
                </ListGroup.Item>
                {categories.map((category) => (
                  <ListGroup.Item
                    className={` sideBarCatContainer ${styles.sideBarCatContainer}`}
                    key={category._id}
                  >
                    <div className='d-flex justify-content-between align-items-center'>
                      <Link
                        className={` sideBarCatLink ${styles.sideBarCatLink}`}
                        href={`/notes/${encodeURIComponent(category.name)}`}
                      >
                        {category.name}
                      </Link>
                      <Button
                        className={`deleteButton ${styles.deleteButton}`}
                        variant='danger'
                        size='sm'
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <BsX />
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Form className={`${styles.newCategoryContainer} newCategoryContainer p-1`}>
                <Form.Group className={styles.newCategoryForm}>
                  <Form.Control
                    type='text'
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder='New category'
                  />
                </Form.Group>
                <Button
                  onClick={handleAddCategory}
                  className={`fab-button newCategoryButton ${buttonClass} ${styles.newCategoryButton}`}
                >
                  <BsPlus />
                </Button>
              </Form>

              <div className={`p-1 d-flex justify-content-between ${styles.sideBarBottom}`}>
                <div className={styles.userButton}>
                  <UserButton />
                </div>
                <Button
                  className={`sideBarBottomButton ${styles.sideBarBottomButton}`}
                  variant='link'
                  onClick={() => signOut()}
                >
                  <BsBoxArrowRight />
                </Button>
                <Button className={`sideBarBottomButton ${styles.sideBarBottomButton}`} variant='link' onClick={handleToggleTheme}>
                  {theme === 'dark' ? <BsSun /> : <BsMoonStars />}
                </Button>
              </div>
            </div>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Navbar>

      <div className='contentContainer' style={{ display: 'flex' }}>
        <div className={`sideBar-${theme} ${styles.sideBarContainer}`}>
          <div className={styles.sideMenuFixed}>
            <span className={`categoriesText ${styles.categoriesText}`}>
              Categories
            </span>
            <ListGroup className={`p-1 ${styles.sideBarCatList}`}>
              {/* Link to go to all note (dashboard) */}
              <ListGroup.Item
                  className={` sideBarCatContainer ${styles.sideBarCatContainer}`}
                  // key={category._id}
                >
                  <div className='d-flex justify-content-between align-items-center'>
                    <Link
                      className={` sideBarCatLink ${styles.sideBarCatLink}`}
                      href={`/dashboard`}
                    >
                      All Notes
                    </Link>
                  </div>
                </ListGroup.Item>
              {categories.map((category) => (
                <ListGroup.Item
                  className={` sideBarCatContainer ${styles.sideBarCatContainer}`}
                  key={category._id}
                >
                  <div className='d-flex justify-content-between align-items-center'>
                    <Link
                      className={` sideBarCatLink ${styles.sideBarCatLink}`}
                      href={`/notes/${encodeURIComponent(category.name)}`}
                    >
                      {category.name}
                    </Link>
                    <Button
                      className={`deleteButton ${styles.deleteButton}`}
                      variant='danger'
                      size='sm'
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      <BsX />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Form className={`${styles.newCategoryContainerFixed} newCategoryContainer p-1`}>
              <Form.Group className={styles.newCategoryForm}>
                <Form.Control
                  type='text'
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder='New category'
                />
              </Form.Group>
              <Button onClick={handleAddCategory} className={`fab-button newCategoryButton ${buttonClass} ${styles.newCategoryButton}`}>
                <BsPlus />
              </Button>
            </Form>

            <div className={`p-1 d-flex ${styles.sideBarBottomFixed}`}>
              <div className={styles.userButton}>
                <UserButton />
              </div>
              <Button className={`sideBarBottomButton ${styles.sideBarBottomButton}`} variant='link' onClick={() => signOut()}>
                <BsBoxArrowRight />
              </Button>
              <Button
                className={`sideBarBottomButton ${styles.sideBarBottomButton}`}
                variant='link'
                onClick={handleToggleTheme}
              >
                {theme === 'dark' ? <BsSun /> : <BsMoonStars />}
              </Button>
            </div>
          </div>
        </div>

        <div className={`${styles.mainContainer} mainContent`}>
          {/* Action buttons */}

          <div className={`${styles.searchBar} d-flex justify-content-end p-3`}>
            <Form.Control
              type='text'
              value={searchInput}
              onChange={handleSearch}
              placeholder='Search...'
              className='mx-1'
            />

            <Button
              variant='outline-secondary'
              className={`${styles.sort} mx-1`}
              onClick={handleSort}
            >
              <span>Sort</span>
              {sortDesc ? <RiSortAsc /> : <RiSortDesc />}
            </Button>
          </div>
          <div className={`${styles.categoryText}`}>
            {category}
          </div>
          {/* Notes list */}
          <Container className={styles.container}>
            <ListGroup>
              {notes.map((note) => (
                <ListGroup.Item className={styles.noteContainer} key={note._id}>
                  <div className='d-flex justify-content-between align-items-center'>
                    <Link
                      href={`/note/${note._id}`}
                      className={styles.noteLink}
                    >
                      {note.title || 'Untitled Note'}
                    </Link>
                    <Dropdown>
                      <Dropdown.Toggle
                        className={styles.dropdownList}
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
                        <Dropdown.Item
                          onClick={() => generatePdf(note.title, note.content)}
                          href='#/action-2'
                        >
                          Export
                        </Dropdown.Item>
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
                className={`${styles.addButton} fab-button ${buttonClass}`}
                onClick={handleCreateNewNote}
              >
                <span>New Note</span>
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
    </div>
  );
};

export default CategoryPage;

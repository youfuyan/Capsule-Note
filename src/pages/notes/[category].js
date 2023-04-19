// pages/notes/[category].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import { Container, ListGroup, Navbar, Button, Nav, Dropdown } from 'react-bootstrap';
import { AiOutlinePlus, AiOutlineArrowLeft } from 'react-icons/ai';
import { getNotesByCat, deleteNote, addNote } from '@/modules/Data';
import styles from '../../styles/dashboard.module.css';
import Link from 'next/link';
import {
  BsList,
  BsSearch,
  BsFilter,
  BsSortAlphaDown,
  BsPlus,
} from 'react-icons/bs';

const CategoryPage = () => {
  const router = useRouter();
  const { category } = router.query;
  const { isLoaded, userId, getToken } = useAuth();
  const [notes, setNotes] = useState([]);
  const [jwt, setJwt] = useState('');

  useEffect(() => {
    const fetchNotes = async () => {
      if (userId && category) {
        const token = await getToken({ template: 'codehooks' });
        setJwt(token);
        const fetchedNotes = await getNotesByCat(jwt, userId, category);
        setNotes(fetchedNotes);
      }
    };
    fetchNotes();
  }, [userId, jwt, category]);

  const handleDeleteNote = async (noteId) => {
    await deleteNote(jwt, noteId);
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
    const createdNote = await addNote(jwt, defaultNote);
    // Redirect the user to the editor page for the newly created note
    router.push(`/note/${createdNote._id}`);
  };

  return (
    <>
      <Navbar
        expand={false}
        variant='dark'
        style={{ backgroundColor: '#808080' }}
      >
        <Nav.Link href={'/dashboard'} className='mr-auto'>
          <AiOutlineArrowLeft /> Back
        </Nav.Link>
        <Navbar.Brand>{category} Notes</Navbar.Brand>
      </Navbar>
      <Container>
        {/* Notes list */}
        <ListGroup>
          {notes.map((note) => (
            <ListGroup.Item
              key={note._id}
              className={styles.noteContainer}
            >
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
        {/* Create New Note button */}
        <div className='text-center my-4'>
          <Button variant='primary' onClick={handleCreateNewNote}>
            <AiOutlinePlus /> New Note
          </Button>
        </div>
      </Container>
    </>
  );
};

export default CategoryPage;

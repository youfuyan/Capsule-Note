// page/note/[id].js
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth, SignInButton } from '@clerk/nextjs';
import { Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';
import { getNote, updateNote } from '@/modules/Data';
import styles from '@/styles/editor.module.css';
// Dynamic import for react-quill to prevent server-side rendering issues
const ReactQuill = dynamic(import('react-quill'), { ssr: false });

export default function Editor() {
  // Initialize states for the note title and content
  const [note, setNote] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');
  // State to track auto-save status
  const [isSaved, setIsSaved] = useState(false);

  // Use the useRouter hook to programmatically navigate back to the dashboard
  const router = useRouter();
  const { id } = router.query;
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [jwt, setJwt] = useState('');

  // Redirect to home page if user is not signed in
  useEffect(() => {
    if (!isLoaded && !userId) {
      router.push('/');
    }
  }, [userId, isLoaded, router]);

  // Fetch note data
  useEffect(() => {
    async function fetchNote() {
      if (userId && id) {
        const token = await getToken({ template: 'codehooks' });
        setJwt(token);
        const fetchedNote = await getNote(jwt, id);
        console.log('Fetched note:', fetchedNote);
        setNote(fetchedNote);
        setNoteTitle(fetchedNote.title);
        setNoteContent(fetchedNote.content);
      }
    }
    fetchNote();
  }, [userId, jwt, id]);

  // // Simulate auto-save functionality
  // useEffect(() => {
  //   if (noteContent) {
  //     setIsSaved(false);
  //     const timeoutId = setTimeout(() => {
  //       setIsSaved(true);
  //     }, 1000); // Simulated auto-save delay
  //     return () => clearTimeout(timeoutId);
  //   }
  // }, [noteContent]);

  // Auto-save when noteTitle or noteContent change
  useEffect(() => {
    setIsSaved(false);
    const autoSaveDelay = 1000; // Auto-save delay in milliseconds
    const timeoutId = setTimeout(handleAutoSave, autoSaveDelay);
    return () => clearTimeout(timeoutId);
  }, [noteTitle, noteContent]);

  // Update note data
  useEffect(() => {
    if (note) {
      setUpdatedTitle(note.title);
      setUpdatedContent(note.content);
    }
  }, [note]);

  // Function to handle auto-saving
  const handleAutoSave = async () => {
    try {
      await updateNote(
        jwt,
        userId,
        id,
        note.category,
        noteTitle, // Use the updated noteTitle state
        noteContent // Use the updated noteContent state
      );
      setIsSaved(true);
    } catch (error) {
      console.error('Failed to auto-save note:', error);
    }
  };

  if (!note) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {/* Check if the user is signed in before rendering the content */}
      {userId ? (
        <div className={styles.editorContainer}>
          {/* Top bar */}
          <div className={styles.topBar}>
            {/* Left button: Go back to dashboard */}
            <Button
              variant='outline-light'
              className={styles.backButton}
              // onClick={() => router.push('/dashboard')}
              onClick={() => router.push(`/notes/${note.category}`)}
            >
              <ArrowLeft />
            </Button>
            {/* Mid part: Display note title (non-editable) */}
            <div className={styles.pageTitle}>{noteTitle || 'Untitled'}</div>
            {/* Right part: Auto-save status */}
            <div className={styles.saveStatus}>
              {isSaved ? 'Saved' : 'Saving...'}
            </div>
          </div>

          {/* Title input (editable) */}
          <input
            className={styles.noteTitleInput}
            type='text'
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            placeholder='Note Title'
          />

          {/* Note Editor */}
          <ReactQuill
            className={styles.noteEditor}
            value={noteContent}
            onChange={setNoteContent}
            placeholder='Start writing your note...'
          />
        </div>
      ) : (
        <div className='text-center mt-5'>
          <Alert variant='info'>
            Please log in to access your Todo List.
            <SignInButton mode='modal'>
              <Button className='btn'>Sign in</Button>
            </SignInButton>
          </Alert>
        </div>
      )}
    </div>
  );
}

'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmployeeNavbar from '@/components/EmployeeNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/lib/firebase';

interface UploadedColoringPage {
  id: string;
  title: string;
  downloadUrl: string;
}

const allowedRoles = new Set(['manager', 'owner', 'admin']);

export default function EmployeeColoringPagesPage() {
  const { userData } = useAuth();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pages, setPages] = useState<UploadedColoringPage[]>([]);

  const canManage = !!userData?.role && allowedRoles.has(userData.role);

  const loadPages = async () => {
    const q = query(collection(db, 'coloringPages'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const items = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as UploadedColoringPage)
      .filter((page) => !!page.downloadUrl);
    setPages(items);
  };

  useEffect(() => {
    loadPages().catch((loadError) => {
      console.error('Error loading coloring pages:', loadError);
      setError('Unable to load coloring pages right now.');
    });
  }, []);

  const handleUpload = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!canManage) {
      setError('Only managers, owners, or admins can upload coloring pages.');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a page title.');
      return;
    }

    if (!file) {
      setError('Please choose a file to upload.');
      return;
    }

    const allowedFileTypes = [
      'application/pdf',
      'image/png',
      'image/jpeg',
      'image/svg+xml',
    ];

    if (!allowedFileTypes.includes(file.type)) {
      setError('Please upload a PDF, PNG, JPG, or SVG file.');
      return;
    }

    setIsUploading(true);

    try {
      const safeFileName = file.name.replace(/\s+/g, '-').toLowerCase();
      const storagePath = `coloring-pages/${Date.now()}-${safeFileName}`;
      const fileRef = ref(storage, storagePath);

      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'coloringPages'), {
        title: title.trim(),
        downloadUrl,
        storagePath,
        fileName: file.name,
        active: true,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setFile(null);
      setSuccess('Coloring page uploaded successfully.');
      await loadPages();
    } catch (uploadError) {
      console.error('Error uploading coloring page:', uploadError);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ProtectedRoute>
      <EmployeeNavbar />
      <main className="flex-1 py-12 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2 text-primary">Coloring Pages</h1>
          <p className="text-dark/60 mb-8">
            Upload printable files for the FREE KIDS SCOOP page.
          </p>

          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-accent">Upload New Coloring Page</h2>

            {!canManage && (
              <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
                You can view files, but only managers, owners, and admins can upload.
              </p>
            )}

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-dark mb-1">
                  Page Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full border border-dark/20 rounded px-3 py-2"
                  placeholder="Example: Unicorn Ice Cream Coloring Page"
                  disabled={!canManage || isUploading}
                />
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-dark mb-1">
                  File (PDF, PNG, JPG, SVG)
                </label>
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.svg"
                  onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                  disabled={!canManage || isUploading}
                />
              </div>

              {error && <p className="text-sm text-red-700">{error}</p>}
              {success && <p className="text-sm text-green-700">{success}</p>}

              <button
                type="submit"
                disabled={!canManage || isUploading}
                className="bg-primary text-white px-5 py-2.5 rounded hover:bg-primary/90 transition disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Upload Coloring Page'}
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-accent">Uploaded Files</h2>
            {pages.length === 0 ? (
              <p className="text-dark/60">No coloring pages uploaded yet.</p>
            ) : (
              <ul className="space-y-3">
                {pages.map((page) => (
                  <li key={page.id} className="flex items-center justify-between gap-4 border-b border-dark/10 pb-3">
                    <span className="text-dark">{page.title}</span>
                    <a
                      href={page.downloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary font-medium hover:underline"
                    >
                      View File
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

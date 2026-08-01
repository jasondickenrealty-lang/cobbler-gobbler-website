'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import ProtectedRoute from '@/components/ProtectedRoute';
import EmployeeNavbar from '@/components/EmployeeNavbar';
import { useAuth } from '@/contexts/AuthContext';
import { db, storage } from '@/lib/firebase';

interface UploadedColoringPage {
  id: string;
  title: string;
  downloadUrl: string;
  storagePath?: string;
  active?: boolean;
  downloadCount?: number;
}

const allowedRoles = new Set(['manager', 'owner', 'admin']);

// IMPORTANT: Server-side authorization for coloring page writes (create, update, delete)
// is enforced via Firestore Security Rules. The client-side role check (canManage) provides
// a UX guard, but the actual security boundary must be the Firestore rules, which should
// restrict writes to the 'coloringPages' collection to users whose custom claims or
// user document role is one of: manager, owner, admin.

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.svg']);

export default function EmployeeColoringPagesPage() {
  const { userData } = useAuth();
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pages, setPages] = useState<UploadedColoringPage[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const canManage = !!userData?.role && allowedRoles.has(userData.role);

  const loadPages = async () => {
    const q = query(collection(db, 'coloringPages'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const items = snapshot.docs
      .map((doc) => {
        const data = doc.data() as Omit<UploadedColoringPage, 'id'>;
        return {
          id: doc.id,
          ...data,
          downloadCount: typeof data.downloadCount === 'number' ? data.downloadCount : 0,
        } as UploadedColoringPage;
      })
      .filter((page) => !!page.downloadUrl);
    setPages(items);
  };

  const handleTogglePublish = async (page: UploadedColoringPage) => {
    if (!canManage) {
      setError('Only managers, owners, or admins can manage coloring pages.');
      return;
    }

    setError(null);
    setSuccess(null);
    setProcessingId(page.id);

    try {
      await updateDoc(doc(db, 'coloringPages', page.id), {
        active: page.active === false,
      });
      setSuccess(page.active === false ? 'Coloring page published.' : 'Coloring page unpublished.');
      await loadPages();
    } catch (toggleError) {
      console.error('Error updating coloring page status:', toggleError);
      setError('Unable to update coloring page status.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (page: UploadedColoringPage) => {
    if (!canManage) {
      setError('Only managers, owners, or admins can delete coloring pages.');
      return;
    }

    const confirmed = window.confirm(`Delete "${page.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setError(null);
    setSuccess(null);
    setProcessingId(page.id);

    try {
      if (page.storagePath) {
        await deleteObject(ref(storage, page.storagePath));
      }
      await deleteDoc(doc(db, 'coloringPages', page.id));
      setSuccess('Coloring page deleted.');
      await loadPages();
    } catch (deleteError) {
      console.error('Error deleting coloring page:', deleteError);
      setError('Unable to delete this coloring page.');
    } finally {
      setProcessingId(null);
    }
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

    // Validate file extension matches allowed types
    const fileExtension = file.name.includes('.')
      ? '.' + file.name.split('.').pop()!.toLowerCase()
      : '';
    if (!ALLOWED_EXTENSIONS.has(fileExtension)) {
      setError('File extension must be .pdf, .png, .jpg, .jpeg, or .svg.');
      return;
    }

    // Validate file size (max 10 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('File size must be under 10 MB.');
      return;
    }

    // For SVG files, check for embedded script tags to prevent XSS
    if (file.type === 'image/svg+xml') {
      const svgText = await file.text();
      if (/<script|on\w+\s*=|<style|javascript:/i.test(svgText)) {
        setError('SVG files must not contain scripts, event handlers, style tags, or javascript: URLs.');
        return;
      }
      if (/data:\s*[^,]*(?:text\/html|application\/x?javascript)/i.test(svgText)) {
        setError('SVG files must not contain dangerous data: URLs.');
        return;
      }
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
        downloadCount: 0,
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
                  <li key={page.id} className="flex flex-col items-start gap-2 border-b border-dark/10 pb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <div>
                      <p className="text-dark">{page.title}</p>
                      <p className="text-xs text-dark/50">
                        {page.active === false ? 'Unpublished' : 'Published'} | {(page.downloadCount ?? 0).toLocaleString()} {(page.downloadCount ?? 0) === 1 ? 'download' : 'downloads'}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 sm:gap-4">
                      <a
                        href={page.downloadUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex min-h-[44px] items-center px-1 text-primary font-medium hover:underline"
                      >
                        View File
                      </a>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(page)}
                        disabled={!canManage || processingId === page.id}
                        className="inline-flex min-h-[44px] items-center px-1 text-sm text-primary hover:underline disabled:opacity-50"
                      >
                        {page.active === false ? 'Republish' : 'Unpublish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(page)}
                        disabled={!canManage || processingId === page.id}
                        className="inline-flex min-h-[44px] items-center px-1 text-sm text-red-700 hover:underline disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
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

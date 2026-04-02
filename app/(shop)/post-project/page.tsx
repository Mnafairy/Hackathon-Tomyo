'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ProjectForm } from '@/features/post-project/ProjectForm';
import { ProjectSettings } from '@/features/post-project/ProjectSettings';

const PostProjectPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [type, setType] = useState('OTHER');
  const [minAge, setMinAge] = useState(14);
  const [maxAge, setMaxAge] = useState(24);
  const [link, setLink] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const toggleSubject = (subject: string) => {
    setSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject],
    );
  };

  const handlePublish = async () => {
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          subjects,
          type,
          minAge,
          maxAge,
          deadline: deadline || null,
          originalUrl: link.trim() || null,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/discovery'), 1500);
      } else {
        const data = await res.json();
        setError(data.error ?? 'Алдаа гарлаа. Дахин оролдоно уу.');
      }
    } catch {
      setError('Сервертэй холбогдож чадсангүй. Дахин оролдоно уу.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-ds-primary border-t-transparent" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      {/* Header */}
      <div className="animate-fade-up delay-0 mb-10 text-center">
        <h1 className="heading-display text-4xl font-black tracking-tight md:text-5xl">
          <span className="text-gradient-primary">Ирээдүйг бүтээ</span>
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-on-surface-variant">
          Инноваци, суралцахуйн орчин бий болго. Өөрийн алсын харааг
          хуваалцаж, дараагийн үеийн судлаач, бүтээгчидтэй холбогдоорой.
        </p>
      </div>

      {success && (
        <div className="animate-fade-up mb-8 rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
          <p className="text-lg font-bold text-green-400">Амжилттай нийтлэгдлээ!</p>
          <p className="mt-1 text-sm text-green-400/70">Боломжууд хуудас руу шилжиж байна...</p>
        </div>
      )}

      {error && (
        <div className="animate-fade-up mb-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
          <p className="text-sm font-medium text-red-400">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <ProjectForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          link={link}
          setLink={setLink}
          type={type}
          setType={setType}
          subjects={subjects}
          toggleSubject={toggleSubject}
        />

        <ProjectSettings
          minAge={minAge}
          setMinAge={setMinAge}
          maxAge={maxAge}
          setMaxAge={setMaxAge}
          deadline={deadline}
          setDeadline={setDeadline}
          handlePublish={handlePublish}
          submitting={submitting}
          title={title}
          description={description}
        />
      </div>
    </div>
  );
};

export default PostProjectPage;

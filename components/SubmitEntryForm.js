"use client";

import { useState, useRef } from 'react';
import { createClient } from '../lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import provinces from './provinces';
import SuccessConfirmation from './SuccessConfirmation';

export default function SubmitEntryForm() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [titleEn, setTitleEn] = useState('');
  const [titleKm, setTitleKm] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descKm, setDescKm] = useState('');
  const [contributorEn, setContributorEn] = useState('');
  const [contributorKm, setContributorKm] = useState('');
  const [placeIndex, setPlaceIndex] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const errorRef = useRef(null);

  const selectedProvince = placeIndex !== '' ? provinces[placeIndex] : null;

  const clearForm = () => {
    setTitleEn(''); setTitleKm(''); setDescEn(''); setDescKm('');
    setContributorEn(''); setContributorKm(''); setPlaceIndex('');
    setImageFile(null); setAudioFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!imageFile || !audioFile) {
      setErrorMsg('submitImageRequired');
      errorRef.current?.focus();
      return;
    }
    if (!selectedProvince) {
      setErrorMsg('submitProvinceRequired');
      errorRef.current?.focus();
      return;
    }
    if (loading) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated.');
      console.log("Submitting as user.id:", user.id);

      const fileExtImage = imageFile.name.split('.').pop();
      const fileExtAudio = audioFile.name.split('.').pop();
      const timestamp = Date.now();

      const imagePath = `${user.id}/${timestamp}.${fileExtImage}`;
      const { error: imgUploadErr } = await supabase.storage.from('image').upload(imagePath, imageFile);
      if (imgUploadErr) throw imgUploadErr;

      const audioPath = `${user.id}/${timestamp}.${fileExtAudio}`;
      const { error: audioUploadErr } = await supabase.storage.from('audio').upload(audioPath, audioFile);
      if (audioUploadErr) throw audioUploadErr;

      const { data: imgUrlData } = supabase.storage.from('image').getPublicUrl(imagePath);
      const { data: audioUrlData } = supabase.storage.from('audio').getPublicUrl(audioPath);

      const { error: insertError } = await supabase.from('entries').insert([{
        owner: user.id,
        title: { en: titleEn, km: titleKm },
        description: { en: descEn, km: descKm },
        contributor: { en: contributorEn, km: contributorKm },
        place: { en: selectedProvince.en, km: selectedProvince.km },
        image_url: imgUrlData.publicUrl,
        audio_url: audioUrlData.publicUrl,
        category: 'Lullaby',
        language: 'km',
      }]);

      if (insertError) throw insertError;

      clearForm();
      setSubmitted(true);
    } catch (err) {
      console.error('Submission error:', err);
      setErrorMsg('submitError');
      errorRef.current?.focus();
    } finally {
      setLoading(false);
    }
  };

  const t = {
    submitImageRequired: "Please select both an image and an audio file.",
    submitProvinceRequired: "Please select a province.",
    submitError: "Submission failed. Please try again.",
  };
  const tKm = {
    submitImageRequired: "សូមជ្រើសរើសឯកសាររូបភាព និងសំឡេង។",
    submitProvinceRequired: "សូមជ្រើសរើសខេត្ត។",
    submitError: "ការបញ្ជូនបានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។",
  };
  const ui = language === "km" ? tKm : t;
  const errorText = errorMsg ? ui[errorMsg] : null;

  if (submitted) {
    return <SuccessConfirmation />;
  }

  const styles = {
    form: {
      padding: '24px',
      maxWidth: '600px',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    },
    heading: {
      fontSize: '24px',
      fontWeight: 700,
      margin: '0 0 8px',
      color: '#E8EDF2',
    },
    fieldGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '12px',
      color: '#97A1B3',
      fontWeight: 600,
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #343C4B',
      borderRadius: '8px',
      backgroundColor: '#0F172A',
      color: '#E8EDF2',
      fontSize: '14px',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #343C4B',
      borderRadius: '8px',
      backgroundColor: '#0F172A',
      color: '#E8EDF2',
      fontSize: '14px',
      minHeight: '80px',
      resize: 'vertical',
      boxSizing: 'border-box',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#0EA5E9',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    buttonDisabled: {
      backgroundColor: '#343C4B',
      cursor: 'not-allowed',
    },
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Contribute a Lullaby</h2>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Title</label>
        <input type="text" placeholder="Enter title" value={titleEn} onChange={e => setTitleEn(e.target.value)} required style={styles.input} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>ចំណងជើង</label>
        <input type="text" placeholder="បញ្ចូលចំណងជើង" value={titleKm} onChange={e => setTitleKm(e.target.value)} required style={styles.input} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Description</label>
        <textarea placeholder="Enter description" value={descEn} onChange={e => setDescEn(e.target.value)} required style={styles.textarea} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>ការពិពណ៌នា</label>
        <textarea placeholder="បញ្ចូលការពិពណ៌នា" value={descKm} onChange={e => setDescKm(e.target.value)} required style={styles.textarea} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Contributor's Name (Lastname, Firstname)</label>
        <input type="text" placeholder="Enter contributor name" value={contributorEn} onChange={e => setContributorEn(e.target.value)} required style={styles.input} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>ឈ្មោះរបស់អ្នកចូលរួម (ត្រកូល , នាម )</label>
        <input type="text" placeholder="បញ្ចូលឈ្មោះអ្នកចូលរួម" value={contributorKm} onChange={e => setContributorKm(e.target.value)} required style={styles.input} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Province</label>
        <select
          value={placeIndex}
          onChange={(e) => setPlaceIndex(e.target.value)}
          required
          style={styles.input}
        >
          <option value="" disabled>
            Select a province
          </option>
          {provinces.map((p, i) => (
            <option key={p.en} value={i}>
              {language === "km" ? p.km : p.en}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Cover Image (.jpg, .png)</label>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} required style={styles.input} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Audio File (.mp3)</label>
        <input type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} required style={styles.input} />
      </div>

      {errorText && (
        <p
          ref={errorRef}
          role="alert"
          tabIndex={-1}
          style={{
            margin: 0,
            padding: "10px 14px",
            fontSize: 14,
            color: "#E85D5D",
            backgroundColor: "rgba(232, 93, 93, 0.08)",
            border: "1px solid rgba(232, 93, 93, 0.3)",
            borderRadius: 8,
            textAlign: "center",
          }}
        >
          {errorText}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={loading ? styles.buttonDisabled : styles.button}
      >
        {loading ? 'Submitting...' : 'Submit Entry'}
      </button>
    </form>
  );
}
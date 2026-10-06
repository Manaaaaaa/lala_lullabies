"use client";

import { useState } from 'react';
import { createClient } from '../lib/supabase/client';
import { useLanguage } from './LanguageProvider';
import provinces from './provinces';

export default function SubmitEntryForm() {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [titleEn, setTitleEn] = useState('');
  const [titleKm, setTitleKm] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descKm, setDescKm] = useState('');
  const [contributorEn, setContributorEn] = useState('');
  const [contributorKm, setContributorKm] = useState('');
  const [placeIndex, setPlaceIndex] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

  const selectedProvince = placeIndex !== '' ? provinces[placeIndex] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !audioFile) {
      alert('Please select both an image and an audio file.');
      return;
    }
    if (!selectedProvince) {
      alert('Please select a province.');
      return;
    }
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
      alert('Entry submitted successfully!');
      setTitleEn(''); setTitleKm(''); setDescEn(''); setDescKm('');
      setContributorEn(''); setContributorKm(''); setPlaceIndex('');
      setImageFile(null); setAudioFile(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
        <label style={styles.label}>Title (English)</label>
        <input type="text" placeholder="Enter title" value={titleEn} onChange={e => setTitleEn(e.target.value)} required style={styles.input} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>ចំណងជើង (ភាសាខ្មែរ)</label>
        <input type="text" placeholder="បញ្ចូលចំណងជើង" value={titleKm} onChange={e => setTitleKm(e.target.value)} required style={styles.input} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Description (English)</label>
        <textarea placeholder="Enter description" value={descEn} onChange={e => setDescEn(e.target.value)} required style={styles.textarea} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>ការពិពណ៌នា (ភាសាខ្មែរ)</label>
        <textarea placeholder="បញ្ចូលការពិពណ៌នា" value={descKm} onChange={e => setDescKm(e.target.value)} required style={styles.textarea} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>Contributor (English)</label>
        <input type="text" placeholder="Enter contributor name" value={contributorEn} onChange={e => setContributorEn(e.target.value)} required style={styles.input} />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>អ្នកចូលរួម (ភាសាខ្មែរ)</label>
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
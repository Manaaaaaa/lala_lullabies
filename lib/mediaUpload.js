// Uploads a file to a Supabase Storage bucket under the user's folder and
// returns its public URL. Mirrors the upload logic in SubmitEntryForm.js so
// edits store files the same way new submissions do.
export default async function uploadMedia(supabase, userId, file, bucket) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
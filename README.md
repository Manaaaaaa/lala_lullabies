# Localized Lullabies — Khmer Living Archive

## 1. What this is

A searchable, bilingual (English/Khmer) archive of Khmer lullabies collected from mothers and grandmothers in Cambodia. Contributors can submit a lullaby — title, description, cover photo, and audio recording — which an admin reviews before publishing. Published entries are browsable by anyone. Every entry credits its source by province and contributor name.

Built by Kimsourmana for ICT 340 — Vibe Coding at the American University of Phnom Penh, Fall 2026.

## 2. Who it's for

This archive is for Cambodians who want to preserve and share the lullabies that have been sung in their families for generations. It is also for researchers, students, and anyone interested in Khmer oral traditions.

Design decisions that follow from this audience:

**Khmer first.** The UI shows Khmer alongside English on every screen, including the admin review queue. Search matches both languages.

**Phone-first.** All pages work at mobile widths (tested at 375 px). Navigation collapses into a hamburger menu. Entry cards, forms, and the audio player fit a phone without horizontal scroll.

**Slow connections handled.** Audio streams — the page renders before it finishes buffering — and images come from Supabase public URLs. The home page loads first, then entries appear.

**Sources credited by name and province.** Every entry shows the contributor's name (in Khmer and English) and the province where it was collected. Admin edits carry a small "edited by admin" note so the original credit is never erased.

## 3. How it works

### Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router, React 19), plain CSS + inline styles |
| Auth | Supabase Auth (email/password) |
| Database | Supabase Postgres |
| File storage | Supabase Storage (`image` and `audio` buckets) |
| Deployment | Vercel |

### Database tables

**`entries`** — every lullaby. Key columns: `id`, `owner` (FK to auth.users), `title` (jsonb `{en, km}`), `description` (jsonb), `contributor` (jsonb), `place` (jsonb), `image_url`, `audio_url`, `category`, `language`, `status`, `admin_edited_by`, `admin_edited_at`, `review_comment`, `created_at`.

**`admins`** — one column: `user_id`. If your user id is in here, the header shows the Review Entries link and you can publish/return submissions.

**`pending_entry_edits`** — when a contributor edits their own published entry, the proposed changes land here for admin review. It stores the proposed localized content and optional replacement media until an admin approves or rejects the changes.

### Entry statuses

| Status | Meaning | Who sees it |
|--------|---------|------------|
| `NULL` | Legacy entry (published before status tracking) | Public |
| `published` | Approved and visible | Public |
| `pending` | Submitted / resubmitted, awaiting review | Owner + admins |
| `returned` | Admin sent it back with feedback | Owner + admins |
| `draft` | Saved but not yet submitted | Owner only |

### Access patterns (Supabase queries)

- **Public browse** (`/` and `/browse`): `.or("status.eq.published,status.is.null")` — only published entries.
- **My Contributions** (`/my-contributions`): `.eq("owner", user.id)` — contributors see their own entries.
- **Admin review queue** (`/admin/review`): two queries — (1) `entries WHERE status = 'pending'`, (2) `pending_entry_edits JOIN entries` for proposed edits. Both require the calling user to be in the `admins` table.

### RPC functions (run in Postgres, not the client)

| RPC | What it does |
|-----|-------------|
| `admin_review_entry(p_entry_id, p_new_status, p_comment)` | Admin publishes or returns a pending entry. Stores `review_comment` when returning. |
| `submit_edit_published_entry(p_entry_id, p_title, p_description, p_contributor, p_place, p_image_url, p_audio_url)` | Contributor proposes edits to their own published entry. Inserts into `pending_entry_edits`. |
| `resubmit_entry(p_entry_id, p_title, p_description, p_contributor, p_place, p_image_url, p_audio_url)` | Contributor resubmits a returned entry. Clears `review_comment` and sets `status = 'pending'`. |
| `admin_update_entry(p_entry_id, p_title, p_description, p_place, p_image_url, p_audio_url)` | Admin edits a pending entry inline. Contributor is preserved server-side. |
| `admin_approve_edit(p_edit_id)` | Approves a proposed edit: copies pending values into `entries` and deletes the pending row. |
| `admin_reject_edit(p_edit_id)` | Rejects a proposed edit: deletes the pending row and leaves the published entry unchanged. |

## 4. Security decisions

### The review gate

No contributor can publish their own entry. The `admin_review_entry` RPC runs in Postgres and checks the caller is in the `admins` table before changing status. Even if someone inspects the browser console and calls the Supabase client directly, the RPC rejects them.

### Why review happens in the database, not the frontend

If the Publish button were just a client-side `UPDATE entries SET status = 'published'` hidden from non-admins in the HTML, a contributor could open the network tab and call that update themselves. Moving status changes into an RPC that checks `admins` makes the review gate enforceable at the database level.

### The hidden Publish button

The admin nav link and the Publish/Return buttons only render when `isAdmin` is true (queried from the `admins` table). This is UX, not security — the actual gate is the database-side authorization.

### What a returned entry says

When an admin returns an entry, they can write a comment explaining what needs to change. The comment is stored in `review_comment` and displayed to the contributor in My Contributions. When the contributor resubmits, `resubmit_entry` clears it.

### Editing published entries requires review

Contributors can propose edits to their own published entries. These changes are stored separately in `pending_entry_edits`; the currently published version remains unchanged while the proposal is waiting for review.

An admin can approve the proposal, which applies the changes to the published entry, or reject it, which removes the proposal and leaves the original published entry unchanged.

### Deleting and unpublishing entries

There is no separate unpublish action. However, contributors can delete their own entries, including published entries, without admin approval. Deleting an entry removes it rather than simply hiding it from public browsing.

Contributors cannot delete entries belonging to other users. Ownership is enforced through database permissions and Row Level Security (RLS), not only by hiding or showing buttons in the interface.

Admins can also delete entries through the authorized admin workflow.

### Your own pending entries are private

Public browse only returns entries with `status = 'published'` or `status IS NULL`. Your own pending or returned entries are visible only in My Contributions and to authorized admins.

### The anon key is public by design

`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is the Supabase anon/publishable key. It is safe to expose because RLS policies and RPC checks restrict unauthorized access. The real secret — the `service_role` key — is never placed in the frontend or committed to the repository.

## 5. AI use

This project was built with AI assistance through several tools and models:

- **Cline** (VS Code agent mode) with **DeepSeek-V4-Flash** — wrote the majority of the React components, page layouts, Supabase integration, and the edit/review flows. The code was then reviewed and adjusted by the student.
- **Claude** (free web chatbot at claude.ai) — used alongside Cline to help implement specific code patterns and debug issues.
- **ChatGPT** (free web version) — used to plan the project structure, design the database schema, and reason through the contribution-review-publish flow before writing code.
- **Gemini** (free web version) — used to help visualize UI layout decisions and get styling inspiration.

Aside from `collection.config.js`, `provinces.js`, and most of `uiText.js` (the Khmer labels were written by the owner of the repository), the code is AI-generated and was reviewed, tested, and adjusted by the owner of the repository.

| Task | Tool / Model | What the AI wrote | What was changed after review |
|------|-------------|-------------------|-------------------------------|
| Initial project setup from template | Cline (DeepSeek-V4-Flash) | Starter template from the instructor | Nothing |
| Home page, browse page, entry cards | Cline (DeepSeek-V4-Flash) | JSX structure, inline styles, data fetching | Colour/spacing tweaks to match dark theme |
| Submit form with image/audio upload | Cline (DeepSeek-V4-Flash) | File upload to Storage, form validation, success confirmation | Added Khmer error messages; replaced placeholder text |
| Auth (signup, login, logout) | Cline (DeepSeek-V4-Flash) | Server/client Supabase wrappers, login/signup pages, session handling | No changes |
| My Contributions page | Cline (DeepSeek-V4-Flash) | Entry listing with status badges, delete dialog with file cleanup | Added admin-vs-mine toggle |
| Admin review queue | Cline (DeepSeek-V4-Flash) | Pending entries list, Publish/Return, inline editor | Added edit-proposal review component |
| Edit unpublished entries | Cline (DeepSeek-V4-Flash) | `resubmit_entry` RPC call, status flow | No changes |
| Edit published entries (proposed edits) | Cline (DeepSeek-V4-Flash) | `submit_edit_published_entry` RPC, `pending_entry_edits` table, admin approve/reject | Added media fields to pending edits |
| Image/audio replacement in edit form | Cline (DeepSeek-V4-Flash) | File inputs in EntryEditor, upload helper, RPC params | Indentation fixes, Khmer label corrections |
| Admin return comment box | Cline (DeepSeek-V4-Flash) | Comment textarea in AdminReviewRow, display in ContributionRow | Indentation fix |
| Project structure & database planning | ChatGPT (free web) | Suggested table schema, status flow, RPC design | Adjusted to match actual Supabase setup |
| UI layout & styling ideas | Gemini (free web) | Provided layout inspiration for dark-theme cards, audio player, mobile nav | Adapted to inline styles pattern |
| Code implementation & debugging | Claude (free web) | Helped debug specific component issues and suggest code patterns | Incorporated into Cline-generated code |
| README | Cline (DeepSeek-V4-Flash) | First draft of all eight sections | Reviewed and corrected by the student |

Every line of AI-written code was run in the dev server and tested against both a contributor account and a logged-out browser before being committed. Khmer text was verified by the student.

## 6. Sources and credits

Every lullaby in this archive was collected from a person in Takeo province, with their permission to be named. Thanks to these contributors for sharing the songs.

| Lullaby | Contributor | Province |
|---------|-------------|----------|
| Lullaby (Bompe Kon) — traditional lullaby sung by mothers, sisters, and grandmothers to soothe children to sleep | Thorng Amara | Takeo |
| Rooster Crowing (Morn Rongeav) — a song sung to help children fall asleep, with a voice that soothes the heart | Mang Malis | Takeo |
| Gloomy Sky (Pel Mek Srotom) — a song of deep, melancholy emotion, filled with tenderness and affection | Mang Malis | Takeo |
| Tak Ting Nung Nung — a song older sisters sang to soothe their younger siblings to sleep when they were crying | Seang Kunthea | Takeo |
| Reminiscing Mother's Love (Sronos Mday Thnom) — a song of a mother's love, cherishing her child from infancy until they grow up and marry | Khat Sukheam | Takeo |
| Years of Waiting for You (Yoo Chnam Del Cham Aun) — gentle, showing true love, waiting, and longing that lasts a long time | Sath Kunthy | Takeo |
| The Breeze of Pailin (Jumno Pailin) — a timeless song filled with nostalgia and soft emotion | Sath Kunthy | Takeo |
| The Fisherman's Daughter (Kon Srey Neak Nesat) — a touching story of simple life, devotion, and gentle emotion along the peaceful waterside | Sath Kunthy | Takeo |

## 7. Running it locally

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Environment variables

Create `.env.local` in the project root with these variables (never commit this file):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
```

Both values are in your Supabase dashboard under **Project Settings → API**. The publishable/anon key is safe to expose in the browser when RLS and database-side authorization are correctly configured. The `service_role` key must never be exposed in frontend code or committed to the repository.
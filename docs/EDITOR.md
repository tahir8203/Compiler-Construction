# Lecture editor (teacher) and cloud database

Added in v21 (November 2026). The teacher can edit, add, delete and re-order slides, and edit lecture details, from the web portal or the Android app. Edits are stored in a small cloud database and reach every student automatically.

## How the teacher uses it
1. Open **Me → Settings → Teacher: edit lectures** and sign in with the teacher email and password (once per device).
2. Open any lecture. In the study view each slide has **✏️ Edit** and **＋ Slide**; the toolbar has **✏️ Edit lecture** and **🗂 Manage slides**. In Present mode the footer has **✏️ Edit** and **🗂 Slides**.
3. **Save** writes the change to the cloud at once. Students see it the next time they open the portal or the app with internet (it is then kept for offline use).
4. **🗂 Manage slides → ↩ Restore the original lecture** removes every edit of that lecture.

Students never sign in and never see the Edit buttons.

## How it works
- `assets/cloud-config.js`: the Firebase `projectId` and web `apiKey` (public identifiers, not secrets). Empty values switch the feature off.
- `assets/cloud.js`: loaded after the sessions files and before `app.js`. Applies the cached edits from `localStorage` (`cc-cloud-v1`), then downloads Firestore collection `units` once per visit. One document per lecture: document id = lecture id, field `json` = the whole lecture object, `by`, `at`. Uses plain `fetch` (Firestore and Identity Toolkit REST); no Firebase SDK, so it also works inside the Android WebView.
- `assets/editor.js`: the forms. A save always writes the whole lecture (`CCCloud.saveUnit`), then calls `CCApp.refresh()`.
- `app.js`: deck slides that come from `s.slides` carry `_i` (their index); study cards carry `data-si`; `CCEdit.decorate()` is called after each render.
- Sign-in is Firebase Authentication, email + password (Google sign-in pop-ups do not work inside an Android WebView).

## Firebase setup (one time)
1. Create a Firebase project; add a **Web app**; copy `projectId` and `apiKey` into `assets/cloud-config.js`.
2. **Authentication → Sign-in method → Email/Password: enable.** Then **Users → Add user** (the teacher). Copy the user's UID.
3. **Firestore Database → Create database** (production mode), then set these rules, with the teacher's UID:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /units/{id} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == "TEACHER_UID";
    }
  }
}
```

4. In Authentication → Settings, switch off "Enable create (sign-up)" so nobody else can make an account (the rules already stop other accounts from writing).

## Things to know
- An edited lecture is a full copy in the cloud. Later changes to that lecture in `assets/sessions/*.js` do not show until the teacher uses **Restore the original lecture** (or re-applies the edit).
- Text boxes accept simple HTML (`<b>`, `<code>`). Code boxes take plain code; `<`, `>` and `&` are escaped on save.
- The free Firestore plan allows 50,000 reads a day; each visit reads at most 32 small documents.

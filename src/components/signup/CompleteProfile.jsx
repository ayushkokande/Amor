import { useState } from "react";
import { db, auth } from "../../lib/firebase";
import store from "../../store/store";
import "./completeProfileStyles.css";

/**
 * Shown after OAuth sign-in when the profile is missing matching fields
 * (sex/age). Email signups collect these in the signup form; Google users
 * skip it, so they land here once before entering the app.
 */
export default function CompleteProfile({ uid, data }) {
  const [form, setForm] = useState({
    f_name: data?.f_name || "",
    l_name: data?.l_name || "",
    age: data?.age || "",
    sex: data?.sex || "",
    bio: data?.bio || "",
  });
  const [saving, setSaving] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.f_name || !form.age || !form.sex) {
      alert("Name, age and sex are required for matching.");
      return;
    }
    setSaving(true);
    try {
      await db.collection("profiles").doc(uid).update(form);
      await db
        .collection("groupcount")
        .doc("0")
        .collection("users")
        .add({ uid, sex: form.sex });
      store.dispatch({
        type: "signedIn",
        id: uid,
        data: { ...data, ...form },
      });
    } catch (err) {
      alert(err.message);
      setSaving(false);
    }
  }

  return (
    <div
      className="completeProfile"
      style={{ backgroundImage: `url(/images/pink_rice.png)` }}
    >
      <form className="completeProfileCard" onSubmit={submit}>
        <h2>Almost there!</h2>
        <p>We need a few details before you can start matching.</p>

        <div className="cpRow">
          <input
            type="text"
            name="f_name"
            placeholder="First name"
            value={form.f_name}
            onChange={onChange}
          />
          <input
            type="text"
            name="l_name"
            placeholder="Last name"
            value={form.l_name}
            onChange={onChange}
          />
        </div>

        <div className="cpRow">
          <input
            type="number"
            name="age"
            placeholder="Age"
            min="18"
            value={form.age}
            onChange={onChange}
          />
          <select name="sex" value={form.sex} onChange={onChange}>
            <option value="" disabled>
              Sex
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        <textarea
          name="bio"
          placeholder="A short bio (optional)"
          rows="3"
          value={form.bio}
          onChange={onChange}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Start matching"}
        </button>
        <span className="cpSignOut" onClick={() => auth.signOut()}>
          Sign out
        </span>
      </form>
    </div>
  );
}

import api from "./axios";

// -----------------------------
// Types
// -----------------------------

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "RECRUITER" | "ADMIN";

  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;

  student?: any;
  recruiter?: any;
  company?: any;

  resumes?: any[];
}

export interface ProfileResponse {
  success: boolean;
  user: Profile;
}

export interface UploadResponse {
  success: boolean;
  url: string;
}

export interface ResumeResponse {
  success: boolean;
  resume: any;
}

export interface PasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// -----------------------------
// Get Profile
// -----------------------------

export const getProfile = async () => {
  const { data } = await api.get<ProfileResponse>(
    "/profile"
  );

  return data;
};

// -----------------------------
// Update Profile
// -----------------------------

export const updateProfile = async (
  body: Partial<Profile>
) => {
  const { data } = await api.put(
    "/profile",
    body
  );

  return data;
};

// -----------------------------
// Upload Avatar
// -----------------------------
export const uploadAvatar = async (file: File) => {
  const form = new FormData();

  form.append("avatar", file);

  console.log(form.get("avatar")); // ye File object print hona chahiye

  const { data } = await api.post(
    "/profile/avatar",
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};
export async function getCandidateProfile(userId: string) {
  const { data } = await api.get(
    `/profile/candidate/${userId}`
  );

  return data;
}

// -----------------------------
// Upload Cover
// -----------------------------

export const uploadCover = async (
  file: File
) => {

  const form = new FormData();

  form.append("cover", file);

  const { data } = await api.post<UploadResponse>(
    "/profile/cover",
    form
  );

  return data;
};

// -----------------------------
// Upload Company Logo
// -----------------------------

export const uploadCompanyLogo = async (
  file: File
) => {

  const form = new FormData();

  form.append("logo", file);

  const { data } = await api.post<UploadResponse>(
    "/profile/company-logo",
    form
  );

  return data;
};

// -----------------------------
// Upload Resume
// -----------------------------

export const uploadResume = async (
  file: File
) => {

  const form = new FormData();

  form.append("resume", file);

  const { data } = await api.post<ResumeResponse>(
    "/profile/resume",
    form
  );

  return data;
};

// -----------------------------
// Delete Resume
// -----------------------------

export const deleteResume = async (
  id: string
) => {

  const { data } = await api.delete(
    `/profile/resume/${id}`
  );

  return data;
};

// -----------------------------
// Change Password
// -----------------------------

export const changePassword = async (
  body: PasswordPayload
) => {

  const { data } = await api.put(
    "/profile/password",
    body
  );

  return data;
};

// -----------------------------
// Delete Account
// -----------------------------

export const deleteAccount = async () => {

  const { data } = await api.delete(
    "/profile"
  );

  return data;
};
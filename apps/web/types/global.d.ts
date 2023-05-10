/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_BASE_URL: string;
    NEXT_PUBLIC_EMBED_URL: string;
    NEXT_PUBLIC_AMPLITUDE_ID: string;
  }
}

interface IProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePicture: string;
  _projectId?: string;
  accessToken?: string;
}

interface ICreateProjectData {
  name: string;
}

interface ICreateTemplateData {
  name: string;
  code: string;
}
interface IUpdateTemplateData {
  name: string;
}

interface Window {
  impler: any;
}

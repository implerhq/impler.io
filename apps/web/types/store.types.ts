export interface IAppStore {
  profileInfo?: IProfileData;
  setProfileInfo: (info: IProfileData) => void;
}

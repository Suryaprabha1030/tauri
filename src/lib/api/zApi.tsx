import { AuthContextType } from "@/context/authContextProvider";
import { AxiosResponse, AxiosError } from "axios";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type SuccessCallback<T> = (response: AxiosResponse<T>) => void;
type ErrorCallback = (error: any) => void;

class zApi {
  private router: AppRouterInstance;
  private authContext?: AuthContextType;

  constructor(router: AppRouterInstance, authContext?: AuthContextType) {
    this.router = router;
    if (authContext) this.authContext = authContext;
  }

  async request<T>(
    requestFunc: () => Promise<AxiosResponse<T>>,
    successCallback: SuccessCallback<T>,
    errorCallback: ErrorCallback
  ): Promise<void> {
    try {
      const response = await requestFunc();
      successCallback(response);
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        this.redirectToLogin();
      }
      console.error("Error when fetching data ", error);
      errorCallback(error);
    }
  }

  redirectToLogin() {
    if (this.authContext) this.authContext.logout();
    this.router.push("/login");
    return;
  }
}

export default zApi;

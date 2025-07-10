import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import { authApi } from "@/features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { userLoggedIn } from "@/features/authSlice"; // Import action

export const appStore = configureStore({
    reducer: rootReducer,
    middleware:(defaultMiddleware) =>  defaultMiddleware().concat(authApi.middleware, courseApi.middleware)
});
const initializeApp = async () => {
   const result = await appStore.dispatch(
    authApi.endpoints.loadUser.initiate({}, { forceRefetch: true })
  );
  // ✅ If user is returned, update Redux state
  if (result?.data?.user) {
    appStore.dispatch(userLoggedIn({ user: result.data.user }));
  }
}
 
initializeApp();
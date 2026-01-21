// import { configureStore } from "@reduxjs/toolkit";
// import { authApi } from "../api/authApi";
// import { userApi } from "../api/userApi";
// import authReducer from "../api/authSlice";
// import { checklistApi } from "../api/checklistApi";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     [authApi.reducerPath]: authApi.reducer,
//     [userApi.reducerPath]: userApi.reducer,
//     //  [checklistApi.reducerPath]: checklistApi.reducer,
//       [checklistApi.reducerPath]: checklistApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(authApi.middleware, userApi.middleware,checklistApi.middleware ),
// });

import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { userApi } from "../api/userApi";
import { logApi } from "../api/logApi"; // <-- added logApi
import { auditApi } from "../api/auditApi"; // <-- added auditApi
import { checklistApi } from "../api/checklistApi";
import authReducer from "../api/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [checklistApi.reducerPath]: checklistApi.reducer,
    [logApi.reducerPath]: logApi.reducer, // <-- added logApi reducer
    [auditApi.reducerPath]: auditApi.reducer, // <-- added auditApi reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      checklistApi.middleware,
      logApi.middleware, // <-- added logApi middleware
      auditApi.middleware // <-- added auditApi middleware
    ),
  devTools: true,
});

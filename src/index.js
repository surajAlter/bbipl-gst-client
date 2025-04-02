import React from "react";
import ReactDOM from "react-dom/client";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import "./index.css";
import Layout from "./layout/Layout";
import Home from "./layout/Home";
import Error from "./Error.jsx";
import Login from "./authentication/officials/Login.jsx";
import About from "./pages/About.jsx";
import UserDashboard from "./pages/users/UserDashboard.jsx";
import Admin from "./pages/admin/Admin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

// login
import UserForgotPassword from "./authentication/users/UserForgotPassword.jsx";
import UserLogin from "./authentication/users/UserLogin.jsx";
import UserSignUp from "./authentication/users/UserSignUp.jsx";

//officials
import ForgotPassword from "./authentication/officials/ForgotPassword.jsx";
import Logout from "./components/admin/Logout.jsx";
import OfficialDashboard from "./pages/officials/OfficialDashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute";

//contexts
import { UserProvider } from "./context/UserContext";
import GstRegistration from "./pages/GstRegistration.jsx";

// const routerFromelements=
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<Layout />} errorElement={<Error />}>
			<Route path="" element={<Home />}></Route>
			{/* login */}
			<Route
				path="authentication/officials/officials-login"
				element={<Login />}
			></Route>

			<Route path="authentication/logout" element={<Logout />} />

			<Route
				path="authentication/officials/forgot-password"
				element={<ForgotPassword />}
			></Route>

			{/* user */}
			<Route
				path="authentication/users/user-login"
				element={<UserLogin />}
			></Route>
			<Route
				path="authentication/users/user-sign-up"
				element={<UserSignUp />}
			></Route>
			<Route
				path="authentication/users/user-forgot-password"
				element={<UserForgotPassword />}
			></Route>
			<Route
				path="pages/user-dashboard"
				element={<UserDashboard />}
			></Route>

			<Route
				path="pages/admin-dashboard"
				element={
					<ProtectedRoute requiredRole="admin">
						<AdminDashboard />
					</ProtectedRoute>
				}
			></Route>
			<Route
				path="pages/admin"
				element={
					<ProtectedRoute requiredRole="admin">
						<Admin />
					</ProtectedRoute>
				}
			></Route>
			<Route
				path="pages/backend-support-dashboard"
				element={
					<ProtectedRoute requiredRole="backendSupport">
						<OfficialDashboard />
					</ProtectedRoute>
				}
			></Route>

			<Route path="pages/about" element={<About />}></Route>
			{/* <Route
				path="pages/gst-registration"
				element={<GstRegistration />}
			></Route> */}
			<Route
				path="pages/gst-registration"
				element={
					<ProtectedRoute requiredRole="user">
						<GstRegistration />
					</ProtectedRoute>
				}
			></Route>
		</Route>
	)
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<UserProvider>
			<RouterProvider router={router}></RouterProvider>
		</UserProvider>
	</React.StrictMode>
);

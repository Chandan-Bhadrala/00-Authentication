TODO:

1. ~~Setup multer to handle profile pic in the form data.~~
   ~~2. Setup cloudinary to upload the profile pic properly & delete the one on the server.~~
2. ~~Setup MailTrap to send verification email.~~
3. ~~Setup refresh token in the cookie & refresh token as data to be stored in the local storage. Send the tokens in sign up route.~~
4. ~~Create email verification route. In email verification route, user must get logged in automatically & that route should also provide user its access & refresh token after successful email verification.~~
   ~~- via. FE, redirect the user to /dashboard or /home after successful email verification.~~
5. ~~Create login route & use jwt middleware there to create jwt & send short lived access token in res object authorization header & long lived in the res object cookie.~~


---

# Authentication Project

## Need to include

- Register, Login, Logout, jwt (may be refresh & access token) & change password & change profile pic (delete old profile pic from cloudinary after successful addition of the profile pic in the cloudinary).

- Mailing services for verify email, forgot password.

- Add functionality to check for "username availability" on spot in FE. ChatGPt, on how to achieve this behavior.

- Create a super admin route, who can convert any user into an admin or back to user.

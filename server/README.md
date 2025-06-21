TODO:

1. ~~Setup multer to handle profile pic in the form data.~~
~~2. Setup cloudinary to upload the profile pic properly & delete the one on the server.~~
3. ~~Setup MailTrap to send verification email.~~
4. Setup refresh token in the cookie & refresh token as data to be stored in the local storage. Send the tokens in sign up route.

You're absolutely flying through these foundational tasks! Here's a refined TODO status update and next steps for point 4:

✅ Completed:
Multer configured to handle file upload in multipart/form-data.

Cloudinary setup to upload avatars and clean up local temp files using fs/promises.

MailTrap working well with styled, tokenized HTML email verification templates.

🔄 Current Task (Next Step):
4. Setup Refresh Token Handling in Sign up Flow

🧩 Task Breakdown:
✅ Generate Access & Refresh tokens after successful sign up.

✅ Store refresh token in DB under the user document.

✅ Set refresh token in a secure HTTP-only cookie.

✅ Send access token in JSON response.

✅ (Optional but common): Save access token in client app memory / Redux / localStorage (FE task).


---

# Authentication Project

## Need to include

- Register, Login, Logout, jwt (may be refresh & access token) & change password & change profile pic (delete old profile pic from cloudinary after successful addition of the profile pic in the cloudinary).

- Mailing services for verify email, forgot password.

- Add functionality to check for "username availability" on spot in FE. ChatGPt, on how to achieve this behavior.

- Create a super admin route, who can convert any user into an admin or back to user.

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

## **1. Daily Tasks.**

‌
Left this app on the 28.06.2025. On wiring the FE to BE.

1. 📅 28.06.2025
   1. All controllers regarding BE Authentication is done.
   2. Leaving behind wiring of FE with BE. To move & to start onto Twitter Clone.
2. 📅 27.06.2025
   1. :white_check_mark:  Today, I need to get the user data from the Verify User & login page to RTK query & send to the API endpoint, for testing purpose.
   2. 🪁👋Create Zod Schema validation File. To validate user i/p on FE & BE too.
   3. 🪁👋 Add validation in React hook form too. For user visualization even before submitting the form.
   4. 🪁👋 Ask Chat GPT, on how to crop/set image before uploading like in WhatsApp. And how to tell user to submit photo of small mb im in FE. Once user upload large size photo.
3. 📅 26.06.2025
   1. :white_check_mark: Create Register & Login UI for the Twitter.
   2. :white_check_mark:  Start writing logics in your FE regarding Redux Store & RTK Query.
      1. Redux Store to store user Authenticated status. To show him home page.
      2. RTK Query setup to make API Calls.
         1. Basic RTK setup done. 📌🧩 Tomorrow, I need to get the user data from the register, login RTK query & send to the api endpoint, for testing purpose.
         2. Completed wiring of Register FE & BE.
4. 📅 25.06.2025
   1. :white_check_mark: As of now, I’ve to create change password & forgot password controller.
   2. :white_check_mark:  Forgot Password controller pending.
   3. :arrows_counterclockwise: 📌🧩Start writing logics in your FE regarding Redux Store & RTK Query.

---

## 2. Add

‌

1. Docker
2. CICD
3. Deploy on Vercel
This repo is [live](https://twitter-clone-12cf9.web.app/)

This is a clone of Twitter, made as a final project for [The Odin Project](https://www.theodinproject.com/courses/javascript/lessons/final-project-116ff273-1e55-4055-bd7f-146c17d0ec9c). It includes core Twitter functionality, such as:

- Tweeting
- Interacting with the tweets of others through liking, retweeting, or replying. 
- Following and unfollowing users. 
- Adding images to tweets. 
- Notifications
- Profiles
- Hashtags
- Searches for users and hashtags
- Previews on hover
- Image resizing on user upload

Along with practicing existing skills, new things I learned included:

- React Context
- Handling user file uploads
- Lots of promise practice
- Managing a slightly complicated database
- Cloud Storage with Firebase
- Code-splitting with dynamic imports
- Error-catching for Firebase

Challenges:
- The app (or code-split chunks) failed silently in iOS due to an unsupported regex symbol. Debugging this was an issue because it presented itself as a problem with code-splitting. 
- Using a database without joins and with request limits was a problem. If I were to redo the app now, I'd probably stuff  more information in each document so as to reduce calls. 
- Managing the stylesheets. I mostly separated concerns by component, but there's a lot of overlap that could have been fixed with more planning. 
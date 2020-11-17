# Software Requirements

**What is the vision of this product?**
- We want to create a site all about Mars. On the home page, we want the homepage header to be generated from the random Mars photo API. We want to make the background photo populate from APOD (Astronomy pic of the day). In addition, we would like to create a navigation to a separate page that will generate Mars weather data (per sol). Moreover, we will have a unique page for all three rovers and each of those pages will includes photos taken by that rover. 

**What pain point does this project solve?**
- Although this does not solve any crisis’s, it is important that people have access to the latest Mars images and weather data. To the little boy that dreams of becoming an astronomer, to the older gentleman just figuring out the web, this app is for everyone. We believe that our site will inform and inspire the youth of the World. 

**Why should we care about your product?**
- You should care about our product because we believe the future of the human race will be on Mars. There is no doubt that our business with Mars is not finished. Until we get there, it is important that we get as familiar as possible with the infamous red planet.

**IN** 
- The web app will display a photo of the day as the site's background from the APOD API.
- The web app will display a Mars photo of the day in the body header from the Mars Rover Photos API.
- The web app will display Mars weather for the next 7 sols from the InSight API.
- The web app will have a unique page for each rover that will display their photos. 

**OUT**
- Our web app will never provide opinions about Mars (only facts).
- Our web app will never allow users to communicate with NASA directly. 

**MVP**
- When users navigate to our site, they will see a random Mars photo generated in the body header and a random photo from NASA as the background image. When a user navigates to the Mars Weather page, they will be able to see the weather on Mars for the next 7 Sols. When a user navigates to one of the rover-specific pages, they will be able to see photos taken by that specific rover. 

**Stretch Goals:**
- Allow users to add photos to a favorites list.
- Allow users to click a button and have a new random Mars photo (on the homepage) display. 
- Allow users to see past weather data on Mars.

**Functional Requirements**
- A user can see photo of the day as the site's background from the APOD API.
- A user can see a Mars photo of the day in the body header from the Mars Rover Photos API.
- A user can view Mars weather for the next 7 sols from the InSight API.
- A user can view a unique page for each rover that will display their photos. 

**Data Flow (Listed by Page)**
- Homepage: The homepage will request a random photo from both the APOD and Mars Rover Photos APIs.
- Individual Rover Pages: Each individual rover page will request photos from the Mars Rover Photos API (specifically the most recent 25). This API will so provide data on the total number of photos taken as well as the total number of Sols that the rover has been active. 
- Mars Weather Page: Request the weather for the next 7 Sols from the InSight API. It will display the Earth date and Sol, along with the corresponding high and low temperatures. 
- About Mars Rovers Page: Static data about the Mars Rovers.


**Non-Functional Requirements**
1. Clean design: This is important because a clean design allows the user to focus on the data being provided. This will be implemented by following the design in our wireframes, choosing legible fonts, and adding a color palette that is both aesthetically pleasing and easy on the eyes. 
2. Photo quality: This is important because photos are the main data type on our app. This will be implemented by tailoring the API call to request the highest quality of photos available. 

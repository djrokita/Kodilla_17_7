const express = require("express");
const app = express();
const path = require("path");
let passport = require("passport");
let GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const config = require("./config");
let googleProfile = {};

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.CALLBACK_URL
    },
    function(accessToken, refreshToken, profile, cb) {
      googleProfile = {
        id: profile.id,
        displayName: profile.displayName
      };
      cb(null, profile);
    }
  )
);

app.set("view engine", "pug");
app.set("views", "./views");
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("styles"));

app.get("/", (req, res) =>
  res.render("greetings", {
    user: req.user,
    logo: "http://via.placeholder.com/100x50"
  })
);

app.get("/logged", (req, res) =>
  res.render("main", {
    user: googleProfile,
    logo: "http://via.placeholder.com/100x50",
    story1: {
      title: "What's it for?",
      content:
        "Aliquam eu posuere ligula. Etiam finibus vitae nibh quis elementum. Vivamus et aliquet erat. Suspendisse sodales eu dolor id facilisis. Aliquam erat volutpat. Duis eget augue massa. Donec ut velit luctus ex venenatis lobortis in in ipsum. Cras et maximus metus. Pellentesque ex nisi, scelerisque eget quam sit amet, tempor luctus nulla. Nullam laoreet lacus metus, at pulvinar tellus elementum eget. Suspendisse rhoncus nulla urna, vel posuere erat pulvinar non. Nam ut eleifend ante. Donec a ipsum laoreet, ornare nisi quis, semper odio.  Nam vehicula tellus id odio ullamcorper tincidunt."
    },
    story2: {
      title: "What can I do?",
      content:
        "Ut eget ante sit amet diam facilisis sodales. Praesent sit amet tempus elit. Curabitur nisl ipsum, varius vel velit eu, gravida tempor augue. Curabitur non justo ipsum. Ut velit enim, ullamcorper at pretium sed, luctus ut leo. Etiam pellentesque nisl et congue tempor. Aliquam commodo risus odio, vitae feugiat sem feugiat sit amet. Vivamus condimentum turpis vitae nulla imperdiet, id aliquam erat tristique. Donec vitae aliquam est."
    },
    story3: {
      title: "Things You need to know",
      content:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec condimentum sagittis mi id sollicitudin. Mauris mattis, massa at ultrices convallis, diam massa convallis urna, ut vulputate dui risus ut dolor. Nam nec auctor ex, ac dapibus augue. Cras varius odio sed odio dapibus vestibulum. Pellentesque ac mauris nibh. Morbi consectetur a odio id scelerisque. Nam interdum nec enim ac varius. Proin quis orci sapien. Nam ut ligula placerat, molestie massa in, tristique libero."
    }
  })
);

//Passport routes

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/logged",
    failureRedirect: "/"
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.use((req, res, next) =>
  res.status(404).send("Strona o podanym adresie nie istnieje :(")
);

const server = app.listen(3000, () => {
  const port = server.address().port;
  console.log("Serwer uruchomiony, nasłuchuje na localhost:", port);
});

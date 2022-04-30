const Presenter = require("../models/presenterAuth.model");

const register = async (req, res) => {
  //console.log(req.body);
  const presenter = new Presenter(req.body);

  try {
    await presenter.save().then(presenter => {
      //console.log(user);
      res.status(201).send(presenter);
    });
  } catch (e) {
    console.log(e);
  }
};

const logIn = async (req, res) => {
  const { email, password } = req.body;
  let presenter = await Presenter.findOne({ email });
  try {
    if (!presenter) {
      res.status(401).send({ msg: "No user exists for this email" });
    }
    const isPasswordCorrect = await presenter.comparePassword(password);
    if (isPasswordCorrect) {
      const token = presenter.createJWT();
      res.status(200).json({ presenter: { name: presenter.name }, token });
    }
    if (!isPasswordCorrect) {
      res.status(401).send("Please use correct password");
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = { register, logIn };

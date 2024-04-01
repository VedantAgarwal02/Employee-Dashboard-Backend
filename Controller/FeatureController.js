const featureModel = require("../Model/Features");

const addFeature = async (req, res) => {
  const { title } = req.body;

  try {
    if (!title) {
      return res.json({
        status: 400,
        message: "title is required.",
      });
    }

    const newField = await featureModel.create({ title });

    return res.json({
      status: 200,
      message: "Field Added",
      field: newField,
    });
  } catch (error) {
    res.json({
      message: error.message,
      status: 500,
    });
  }
};

const getFeature = async (req, res) => {
  const features = await featureModel.find();

  return res.json({
    status: 200,
    features,
  });
};

const deleteFeature = async (req, res) => {
  const { id } = req.params;

  const deletedField = await featureModel.deleteOne({ _id: id });
  return res.json({
    status: 200,
    field: deletedField,
  });
};

module.exports = { addFeature, getFeature, deleteFeature };

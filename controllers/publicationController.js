const Publication = require('../models/Publication');

exports.addPublication = async (req, res) => {
  try {
    const { name, language, description, price } = req.body;
    const publication = new Publication({
      name,
      language,
      description,
      price
    });
    await publication.save();
    res.status(201).json({ message: 'Publication added successfully', publication });
  } catch (error) {
    res.status(500).json({ message: 'Error adding publication' });
  }
};

exports.editPublication = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, language, description, price } = req.body;
    
    const publication = await Publication.findByIdAndUpdate(
      id,
      { name, language, description, price },
      { new: true }
    );

    if (!publication) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    res.json({ message: 'Publication updated successfully', publication });
  } catch (error) {
    res.status(500).json({ message: 'Error updating publication' });
  }
};